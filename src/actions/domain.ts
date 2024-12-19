'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import * as vercel from '@/lib/vercel';
import { verifySession } from '@/data/_verifySession';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import db from '@/lib/db';
import { getPlanDetails } from '../utils/billing';

const domainSchema = z
  .string({
    required_error: 'Please enter a domain name.',
  })
  .regex(/^(?!:\/\/)([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/, {
    message: 'Please enter a valid domain name.',
  })
  .regex(/^(?!www\.)/, { message: 'Domain name cannot start with www.' })
  .min(3, { message: 'Domain name must be at least 3 characters long.' })
  .max(255, { message: 'Domain name must be less than 255 characters.' });

const isApexDomain = (domain: string) => {
  return domain.split('.').length === 2;
};

const isDomainVerified = (domain: string, domainConfig: vercel.DomainConfigResponse): boolean => {
  if (isApexDomain(domain)) {
    return domainConfig.aValues.includes('76.76.21.21');
  }

  return domainConfig.cnames.includes('cname.usegrant.dev.');
};

export async function addDomain(projectId: string, formData: FormData): ActionResponse {
  const session = await verifySession();

  const validation = domainSchema.safeParse(formData.get('domain'));

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  // allow based on plan
  const planLimits = getPlanDetails(session.plan);

  if (!planLimits.customDomain.available) {
    return ['Custom domains are not available on your current plan. Please upgrade.', null];
  }

  // get existing domains, don't allow more than 1
  const existingDomains = await db.domain.findMany({
    where: { projectId },
  });

  if (existingDomains.length >= planLimits.customDomain.limit) {
    return ['You have reached the limit for custom domains. Please upgrade.', null];
  }

  const domain = validation.data;

  try {
    await vercel.addDomain(domain);
    const domainConfig = await vercel.getDomainConfig(domain);
    const isVerified = isDomainVerified(domain, domainConfig);
    await db.domain.create({
      data: {
        domain,
        verified: isVerified,
        projectId,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, (errorCode) => {
      switch (errorCode) {
        case 'EXISTS':
          return 'Domain already added to this project.';
        default:
          return 'Failed to add domain. Try again.';
      }
    });

    return [errorMessage, null];
  }

  revalidatePath(`/u/projects/${projectId}/settings/domain`);
  return [null, null];
}

export async function deleteDomain(projectId: string, domain: string): ActionResponse {
  await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: { domain, projectId },
  });

  if (!domainRecord) {
    return ['Domain not found.', null];
  }

  try {
    await vercel.deleteDomain(domain);
  } catch (error) {
    if (error instanceof vercel.APIError && error.response.status !== 404) {
      return ['Failed to delete domain. Try again.', null];
    }

    return ['Failed to delete domain. Try again.', null];
  }

  try {
    await db.domain.delete({
      where: { domain, projectId },
    });
  } catch {
    return ['Failed to delete domain. Try again.', null];
  }

  revalidatePath(`/u/projects/${projectId}/settings/domain`);
  return [null, null];
}

export async function verifyDomain(projectId: string, domain: string): ActionResponse<boolean> {
  await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: { domain, projectId },
  });

  if (!domainRecord) {
    return ['Domain not found.', false];
  }

  try {
    const response = await vercel.verifyDomain(domain);
    if (!response.verified) {
      return ['Failed to verify domain. Potentially configured with a different project.', null];
    }

    const domainConfig = await vercel.getDomainConfig(domain);
    const isVerified = isDomainVerified(domain, domainConfig);

    await db.domain.update({
      where: { domain, projectId },
      data: { verified: isVerified },
    });

    revalidatePath(`/u/projects/${projectId}/settings/domain`);
    return [null, isVerified];
  } catch (error) {
    if (error instanceof vercel.APIError && error.response.status !== 400) {
      return ['Failed to verify domain. Potentially configured with a different project.', null];
    }

    return ['Failed to verify domain. Try again.', null];
  }
}

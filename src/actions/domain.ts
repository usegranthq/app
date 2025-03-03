'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import ROUTES from '@/constants/routes';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import db from '@/lib/db';
import vercel from '@/lib/vercel';
import { verifySession } from '@/data/_verifySession';

import { findPlanByPlanName } from '../utils/billing';

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

export async function addDomain(providerId: string, formData: FormData): ActionResponse {
  const session = await verifySession();

  // allow based on plan
  const planLimits = findPlanByPlanName(session.plan);
  if (!planLimits.customDomain.available) {
    return ['Custom domains are not available on your current plan. Please upgrade.', null];
  }

  const validation = domainSchema.safeParse(formData.get('domain'));

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  // get existing domains, don't allow more than 1
  const existingDomains = await db.domain.findMany({
    where: { providerId },
  });

  if (existingDomains.length >= planLimits.customDomain.limit) {
    return ['You have reached the limit for custom domains. Please upgrade.', null];
  }

  const domain = validation.data;

  try {
    const addDomainResponse = await vercel.domains.add(domain);
    const domainConfig = await vercel.domains.getConfig(domain);
    const isVerified = addDomainResponse.verified && !domainConfig.misconfigured;

    await db.domain.create({
      data: {
        domain,
        verified: isVerified,
        providerId,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, (errorCode) => {
      switch (errorCode) {
        case 'EXISTS':
          return 'Domain already added to this provider.';
        default:
          return 'Failed to add domain. Try again.';
      }
    });

    return [errorMessage, null];
  }

  revalidatePath(ROUTES.PROVIDERS_ID_SETTINGS_DOMAIN(providerId));
  return [null, null];
}

export async function deleteDomain(providerId: string, domain: string): ActionResponse {
  await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: { domain, providerId },
  });

  if (!domainRecord) {
    return ['Domain not found.', null];
  }

  try {
    await vercel.domains.delete(domain);
  } catch {
    return ['Failed to delete domain. Try again.', null];
  }

  try {
    await db.domain.delete({
      where: { domain, providerId },
    });
  } catch {
    return ['Failed to delete domain. Try again.', null];
  }

  revalidatePath(ROUTES.PROVIDERS_ID_SETTINGS_DOMAIN(providerId));
  return [null, null];
}

export async function verifyDomain(providerId: string, domain: string): ActionResponse<boolean> {
  await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: { domain, providerId },
  });

  if (!domainRecord) {
    return ['Domain not found.', null];
  }

  try {
    const verifyDomainResponse = await vercel.domains.verify(domain);
    if (!verifyDomainResponse.verified) {
      return ['Failed to verify domain. Potentially configured with a different provider.', null];
    }

    const domainConfig = await vercel.domains.getConfig(domain);
    const isVerified = verifyDomainResponse.verified && !domainConfig.misconfigured;

    await db.domain.update({
      where: { domain, providerId },
      data: { verified: isVerified },
    });

    revalidatePath(ROUTES.PROVIDERS_ID_SETTINGS_DOMAIN(providerId));
    return [null, isVerified];
  } catch {
    return ['Failed to verify domain. Try again.', null];
  }
}

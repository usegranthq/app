'use server';

import { revalidatePath } from 'next/cache';

import ROUTES from '@/constants/routes';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import db from '@/lib/db';
import vercel from '@/lib/vercel';
import { verifySession } from '@/data/_verifySession';
import { domainSchema } from '@/schema';

export async function addDomain(providerId: string, formData: FormData): ActionResponse {
  const { plan, user } = await verifySession();

  // allow based on plan
  if (!plan.features.customDomain.available) {
    return ['Custom domains are not available on your current plan. Please upgrade.', null];
  }

  const validation = domainSchema.safeParse(formData.get('domain'));

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  // get existing domains, don't allow more than 1
  const existingDomains = await db.domain.findMany({
    where: {
      providerId,
      Provider: {
        userId: user.id,
      },
    },
  });

  if (existingDomains.length >= plan.features.customDomain.limit) {
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
  const { user } = await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: {
      domain,
      providerId,
      Provider: {
        userId: user.id,
      },
    },
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
      where: {
        domain,
        providerId,
        Provider: {
          userId: user.id,
        },
      },
    });
  } catch {
    return ['Failed to delete domain. Try again.', null];
  }

  revalidatePath(ROUTES.PROVIDERS_ID_SETTINGS_DOMAIN(providerId));
  return [null, null];
}

export async function verifyDomain(providerId: string, domain: string): ActionResponse<boolean> {
  const { user } = await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: {
      domain,
      providerId,
      Provider: {
        userId: user.id,
      },
    },
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
      where: {
        domain,
        providerId,
        Provider: {
          userId: user.id,
        },
      },
      data: { verified: isVerified },
    });

    revalidatePath(ROUTES.PROVIDERS_ID_SETTINGS_DOMAIN(providerId));
    return [null, isVerified];
  } catch {
    return ['Failed to verify domain. Try again.', null];
  }
}

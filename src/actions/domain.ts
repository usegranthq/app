'use server';

import { refresh } from 'next/cache';

import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import db from '@/lib/db';
import customDomain from '@/lib/domain';
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
    const externalDomain = await customDomain.add(domain);

    await db.domain.create({
      data: {
        domain,
        verified: externalDomain.verified,
        providerId,
        externalId: externalDomain.id,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, (errMessage) => {
      switch (errMessage) {
        case 'EXISTS':
          return 'Domain already added to this provider.';
        default:
          return errMessage ?? 'Failed to add domain. Try again.';
      }
    });

    return [errorMessage, null];
  }

  refresh();
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
    await customDomain.remove(domainRecord.externalId);
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to remove domain. Try again.');
    return [errorMessage, null];
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

  refresh();
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
    const isVerified = await customDomain.verify(domainRecord.externalId);
    if (!isVerified) {
      return [`Unable to verify domain. Please verify if the DNS records are correctly configured.`, null];
    }

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

    refresh();
    return [null, isVerified];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to verify domain. Try again.');
    return [errorMessage, null];
  }
}

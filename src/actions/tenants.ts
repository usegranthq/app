'use server';

import { revalidatePath } from 'next/cache';

import db from '@/lib/db';

import { verifySession } from '@/data/_verifySession';
import { getPlanDetails } from '@/data/user';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { Tenant, TenantProvider } from '@/types/app.types';
import { tenantProviderSchema, tenantSchema } from '@/schema';
import { getIssuerCertifcate } from '@/utils/ca';
import { isValidUrl } from '@/utils/url';

export async function createTenant(formData: FormData): ActionResponse<Tenant> {
  const session = await verifySession();

  const validation = tenantSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  // check if the user has reached the limit for providers
  const tenantsCount = await db.tenant.count({
    where: {
      userId: session.user.id,
    },
  });

  const plan = await getPlanDetails();

  if (!plan.tenants.available) {
    return ['Tenants are not available for your plan. Upgrade your plan or contact support to enable tenants.', null];
  }

  if (tenantsCount >= plan.tenants.limit) {
    return [
      'You have reached the limit for tenants. Upgrade your plan or contact support to increase the limit.',
      null,
    ];
  }

  try {
    const tenant = await db.tenant.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        userId: session.user.id,
      },
    });

    revalidatePath('/u/tenants', 'layout');
    return [null, tenant];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create provider');
    return [errorMessage, null];
  }
}

export async function fetchFingerprint(url: string): ActionResponse<string> {
  await verifySession();

  if (!isValidUrl(url)) {
    return ['Invalid URL', null];
  }

  const domain = new URL(url).hostname;

  try {
    const certificate = await getIssuerCertifcate(domain);
    const fingerprint = certificate.fingerprint.replace(/:/g, '').toUpperCase();
    return [null, fingerprint];
  } catch (error) {
    console.log(error);
    return ['Failed to fetch fingerprint', null];
  }
}

export async function createTenantProvider(tenantId: string, formData: FormData): ActionResponse<TenantProvider> {
  await verifySession();

  const validation = tenantProviderSchema.safeParse({
    url: formData.get('url'),
    fingerprint: formData.get('fingerprint'),
    audience: formData.get('audience'),
    earliestIssuanceTimeAllowed: formData.get('earliestIssuanceTimeAllowed'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.tenantProvider.create({
      data: {
        url: validation.data.url,
        fingerprints: [validation.data.fingerprint],
        audience: validation.data.audience,
        earliestIssuanceTimeAllowed: validation.data.earliestIssuanceTimeAllowed,
        tenantId,
      },
    });

    revalidatePath(`/u/tenants`);
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create provider');
    return [errorMessage, null];
  }
}

export async function deleteTenantProvider(tenantId: string, providerId: string): ActionResponse<void> {
  await verifySession();

  const tenantProvider = await db.tenantProvider.findUnique({
    where: { id: providerId, tenantId },
  });

  if (!tenantProvider) {
    return ['Provider not found', null];
  }

  try {
    await db.tenantProvider.delete({
      where: { id: providerId, tenantId },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete provider');
    return [errorMessage, null];
  }

  revalidatePath(`/u/tenants`);
  return [null, null];
}

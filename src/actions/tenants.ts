'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

import ROUTES, { DYNAMIC_ROUTES } from '@/constants/routes';
import { verifySession } from '@/data/_verifySession';
import db from '@/lib/db';
import { tenantProviderPolicySchema, tenantProviderSchema, tenantSchema } from '@/schema';
import { Tenant } from '@/types/app.types';
import { getIssuerCertifcate } from '@/utils/ca';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { isValidUrl } from '@/utils/url';

type TenantFormValues = z.infer<typeof tenantSchema>;
type TenantPolicyFormValues = z.infer<typeof tenantProviderPolicySchema>;

export async function createTenant(data: TenantFormValues): ActionResponse<Tenant> {
  const { user } = await verifySession();

  const validation = tenantSchema.safeParse(data);

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    const tenant = await db.tenant.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        userId: user.id,
      },
    });

    revalidatePath(ROUTES.TENANTS, 'layout');
    return [null, tenant];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create tenant');
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
  } catch {
    return ['Failed to fetch fingerprint', null];
  }
}

type TenantProviderRequestFormValues = z.infer<typeof tenantProviderSchema>;

export async function createTenantProvider(tenantId: string, payload: TenantProviderRequestFormValues): ActionResponse {
  const { user } = await verifySession();

  const validation = tenantProviderSchema.safeParse(payload);

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  // check if url is already added to the tenant
  const tenantProvider = await db.tenantProvider.findUnique({
    where: {
      url_tenantId: {
        url: validation.data.url,
        tenantId,
      },
      Tenant: {
        userId: user.id,
      },
    },
  });

  if (tenantProvider) {
    return ['Provider with this URL already added to the tenant', null];
  }

  try {
    await db.tenantProvider.create({
      data: {
        url: validation.data.url,
        fingerprints: validation.data.fingerprints,
        audience: validation.data.audience,
        earliestIssuanceTimeAllowed: validation.data.earliestIssuanceTimeAllowed,
        tenantId,
      },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create provider');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.TENANTS);
  return [null, null];
}

export async function deleteTenantProvider(tenantId: string, providerId: string): ActionResponse {
  const { user } = await verifySession();

  const tenantProvider = await db.tenantProvider.findUnique({
    where: { id: providerId, tenantId, Tenant: { userId: user.id } },
  });

  if (!tenantProvider) {
    return ['Provider not found', null];
  }

  try {
    await db.tenantProvider.delete({
      where: { id: providerId, tenantId, Tenant: { userId: user.id } },
    });
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete provider');
    return [errorMessage, null];
  }

  revalidatePath(ROUTES.TENANTS);
  return [null, null];
}

export async function updateTenant(tenantId: string, data: TenantFormValues): ActionResponse {
  const { user } = await verifySession();

  const validation = tenantSchema.safeParse(data);
  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.tenant.update({
      where: { id: tenantId, userId: user.id },
      data: validation.data,
    });
    revalidatePath(ROUTES.TENANTS, 'layout');
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to update tenant');
    return [errorMessage, null];
  }
}

export async function deleteTenant(tenantId: string): ActionResponse {
  const { user } = await verifySession();

  try {
    await db.tenant.delete({
      where: {
        id: tenantId,
        userId: user.id,
      },
    });

    revalidatePath(ROUTES.TENANTS, 'layout');
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete tenant');
    return [errorMessage, null];
  }

  redirect(ROUTES.TENANTS);
}

export async function createTenantProviderPolicy(
  tenantId: string,
  tenantProviderId: string,
  data: TenantPolicyFormValues,
): ActionResponse {
  const { user } = await verifySession();

  const validation = tenantProviderPolicySchema.safeParse(data);

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.tenantProviderPolicy.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        audience: validation.data.audience,
        conditions: validation.data.conditions,
        TenantProvider: {
          connect: {
            id: tenantProviderId,
            Tenant: {
              userId: user.id,
            },
          },
        },
      },
    });
  } catch (error) {
    return [getApiErrorMessage(error, 'Failed to create policy'), null];
  }

  revalidatePath(DYNAMIC_ROUTES.TENANTS_ID_PROVIDERS_ID(tenantId, tenantProviderId));
  redirect(DYNAMIC_ROUTES.TENANTS_ID_PROVIDERS_ID(tenantId, tenantProviderId));
}

export async function deleteTenantProviderPolicy(
  tenantId: string,
  tenantProviderId: string,
  policyId: string,
): ActionResponse {
  const { user } = await verifySession();

  try {
    await db.tenantProviderPolicy.delete({
      where: {
        id: policyId,
        TenantProvider: {
          tenantId,
          id: tenantProviderId,
          Tenant: { userId: user.id },
        },
      },
    });
  } catch (error) {
    return [getApiErrorMessage(error, 'Failed to delete policy'), null];
  }

  revalidatePath(DYNAMIC_ROUTES.TENANTS_ID_PROVIDERS_ID(tenantId, tenantProviderId));
  redirect(DYNAMIC_ROUTES.TENANTS_ID_PROVIDERS_ID(tenantId, tenantProviderId));
}

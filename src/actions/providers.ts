'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { JWK } from 'jose';
import { Prisma } from '@prisma/client';

import db from '@/lib/db';
import { Client, Provider } from '@/types/app.types';
import { verifySession } from '@/data/_verifySession';
import { getPlanDetails } from '@/data/user';
import { createUrlId, getIssuer } from '@/utils/provider';
import { createJwt, defaultJwk } from '@/utils/jwt';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { generateJwk } from '@/utils/jwk';
import { clientSchema, providerSchema } from '@/schema';

export async function createProvider(formData: FormData): ActionResponse<Provider> {
  const session = await verifySession();

  const validation = providerSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  // check if the user has reached the limit for providers
  const providersCount = await db.provider.count({
    where: {
      userId: session.user.id,
    },
  });

  const plan = await getPlanDetails();
  if (providersCount >= plan.providers) {
    return [
      'You have reached the limit for providers. Upgrade your plan or contact support to increase the limit.',
      null,
    ];
  }

  try {
    const urlId = createUrlId(validation.data.name);

    const provider = await db.provider.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        urlId,
        userId: session.user.id,
      },
    });

    revalidatePath('/u/providers', 'layout');
    return [null, provider];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create provider');
    return [errorMessage, null];
  }
}

export async function updateProvider(providerId: string, formData: FormData): ActionResponse<Provider> {
  await verifySession();

  const validation = providerSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.provider.update({
      where: { id: providerId },
      data: validation.data,
    });
    revalidatePath('/u/providers', 'layout');
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to update provider');
    return [errorMessage, null];
  }
}

export async function deleteProvider(providerId: string): ActionResponse {
  await verifySession();

  try {
    await db.provider.delete({ where: { id: providerId } });
    revalidatePath('/u/providers', 'layout');
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete provider');
    return [errorMessage, null];
  }

  redirect('/u/providers');
}

export async function createClient(providerId: string, formData: FormData): ActionResponse<Client> {
  await verifySession();

  const validation = clientSchema.safeParse({
    name: formData.get('name'),
    audience: formData.get('audience'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const clientsCount = await db.client.count({
    where: {
      providerId,
    },
  });

  const plan = await getPlanDetails();
  if (clientsCount >= plan.clients) {
    return [
      'You have reached the limit for clients per provider. Upgrade your plan or contact support to increase the limit.',
      null,
    ];
  }

  try {
    await db.client.create({
      data: {
        name: validation.data.name,
        audience: validation.data.audience,
        providerId,
      },
    });
    revalidatePath(`/u/providers/${providerId}`, 'layout');
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create client');
    return [errorMessage, null];
  }
}

export async function deleteClient(providerId: string, clientId: string): ActionResponse {
  await verifySession();

  try {
    await db.client.delete({ where: { id: clientId, providerId } });
    revalidatePath(`/u/providers/${providerId}`);
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete client');
    return [errorMessage, null];
  }
}

const defaultGenerateAccessTokenOptions = {
  audienceAsArray: true,
  useJwtType: true,
};

export async function generateAccessToken(
  providerId: string,
  clientId: string,
  options = defaultGenerateAccessTokenOptions,
): ActionResponse<string> {
  await verifySession();
  const plan = await getPlanDetails();

  const opts = {
    ...defaultGenerateAccessTokenOptions,
    ...options,
  };

  const client = await db.client.findUnique({
    where: {
      id: clientId,
      providerId,
    },
    include: {
      Provider: {
        include: {
          Domain: {
            where: {
              verified: true,
            },
          },
        },
      },
    },
  });

  if (!client) {
    return ['Client not found', null];
  }

  const customDomain = client.Provider.Domain[0];

  const claims = {
    iss: getIssuer(client.Provider.urlId, plan, customDomain),
    aud: opts.audienceAsArray ? [client.audience] : client.audience,
    sub: client.subject,
  };

  const jwk = await db.jwks.findFirst({
    where: {
      providerId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const signingKey: JWK = jwk ? (jwk.key as unknown as JWK) : defaultJwk;

  const jwtOptions = {
    jwtType: opts.useJwtType,
  };

  try {
    const token = await createJwt(claims, signingKey, jwtOptions);
    revalidatePath(`/u/providers/${providerId}`);
    return [null, token];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to generate client token');
    return [errorMessage, null];
  }
}

export async function requestSigningKey(providerId: string): ActionResponse<string> {
  await verifySession();

  const plan = await getPlanDetails();
  if (!plan.rotateSigningKey) {
    return ['This feature is not available in your current plan. Please upgrade to access this feature.', null];
  }

  const provider = await db.provider.findUnique({
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    return ['Provider not found', null];
  }

  if (provider.rotateJwks) {
    return ['Unable to rotate JWKS. Automatic rotation is enabled for this provider.', null];
  }

  try {
    const [kid, jwk] = await generateJwk('RS256');
    const key = await db.jwks.create({
      data: {
        kid,
        key: jwk as unknown as Prisma.JsonObject,
        providerId,
      },
    });

    revalidatePath(`/u/providers/${providerId}/advanced`);

    return [null, key.id];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to generate new key');
    return [errorMessage, null];
  }
}

export async function removeKey(providerId: string, id: string): ActionResponse {
  await verifySession();

  const provider = await db.provider.findUnique({
    where: { id: providerId },
  });

  if (!provider) {
    return ['Provider not found', null];
  }

  if (provider.rotateJwks) {
    return ['Unable to remove key. Automatic rotation is enabled for this provider.', null];
  }

  const latestKey = await db.jwks.findFirst({
    where: { providerId },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestKey) {
    return ['No keys found', null];
  }

  if (latestKey.id === id) {
    return ['Cannot remove the latest key', null];
  }

  try {
    await db.jwks.delete({ where: { id, providerId } });
    revalidatePath(`/u/providers/${providerId}/advanced`);
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to remove key');
    return [errorMessage, null];
  }
}

export async function toggleRotateJwks(providerId: string, rotateJwks: boolean): ActionResponse {
  await verifySession();

  const plan = await getPlanDetails();
  if (!plan.rotateSigningKey) {
    return ['This feature is not available in your current plan. Please upgrade to access this feature.', null];
  }

  try {
    await db.provider.update({ where: { id: providerId }, data: { rotateJwks } });
    revalidatePath(`/u/providers/${providerId}/advanced`);
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to toggle rotate JWKS');
    return [errorMessage, null];
  }
}

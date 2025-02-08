'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { JWK } from 'jose';

import db from '@/lib/db';
import { verifySession } from '@/data/_verifySession';
import { getPlanDetails } from '@/data/user';
import ERRORS, { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { generateJwk } from '@/utils/jwk';
import { createJwt, defaultJwk } from '@/utils/jwt';
import { createUrlId, getIssuer } from '@/utils/provider';
import { clientSchema, providerSchema } from '@/schema';
import { Client, Provider } from '@/types/app.types';

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

  if (!plan.providers.available) {
    return [ERRORS.PROVIDERS_NOT_AVAILABLE.message, null];
  }

  if (providersCount >= plan.providers.limit) {
    return [ERRORS.MAX_PROVIDERS_LIMIT_REACHED.message, null];
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
  if (clientsCount >= plan.providers.clients) {
    return [ERRORS.MAX_CLIENTS_LIMIT_REACHED.message, null];
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
    return [ERRORS.GENERIC_FEATURE_NOT_AVAILABLE.message, null];
  }

  const provider = await db.provider.findUnique({
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    return [ERRORS.PROVIDER_NOT_FOUND.message, null];
  }

  if (provider.rotateJwks) {
    return [ERRORS.AUTOMATIC_ROTATION_ENABLED.message, null];
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
    return [ERRORS.PROVIDER_NOT_FOUND.message, null];
  }

  if (provider.rotateJwks) {
    return [ERRORS.AUTOMATIC_ROTATION_ENABLED_REMOVE_KEY.message, null];
  }

  const latestKey = await db.jwks.findFirst({
    where: { providerId },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestKey) {
    return [ERRORS.NO_KEYS_FOUND.message, null];
  }

  if (latestKey.id === id) {
    return [ERRORS.CANNOT_REMOVE_LATEST_KEY.message, null];
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
    return [ERRORS.GENERIC_FEATURE_NOT_AVAILABLE.message, null];
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

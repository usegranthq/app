'use server';

import { JWK } from 'jose';
import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import z from 'zod';

import ROUTES from '@/constants/routes';
import { verifySession } from '@/data/_verifySession';
import db from '@/lib/db';
import customDomain from '@/lib/domain';
import { createSigningKey } from '@/lib/signing-key';
import { clientSchema, providerSchema } from '@/schema';
import { Provider } from '@/types/app.types';
import { Prisma } from '@/types/db.types';
import ERRORS, { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { generateJwk } from '@/utils/jwk';
import { createJwt } from '@/utils/jwt';
import { createUrlId, getIssuer } from '@/utils/provider';

type ProviderFormValues = z.infer<typeof providerSchema>;
type ClientFormValues = z.infer<typeof clientSchema>;

export async function createProvider(data: ProviderFormValues): ActionResponse<Provider> {
  const { user } = await verifySession();

  const validation = providerSchema.safeParse(data);

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    const urlId = createUrlId(validation.data.name);

    const provider = await db.provider.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        urlId,
        userId: user.id,
      },
    });

    refresh();
    return [null, provider];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create provider');
    return [errorMessage, null];
  }
}

export async function updateProvider(providerId: string, data: ProviderFormValues): ActionResponse {
  const { user } = await verifySession();

  const validation = providerSchema.safeParse(data);

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.provider.update({
      where: { id: providerId, userId: user.id },
      data: validation.data,
    });
    refresh();
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to update provider');
    return [errorMessage, null];
  }
}

export async function deleteProvider(providerId: string): ActionResponse {
  const { user } = await verifySession();

  try {
    // delete all domains
    const domains = await db.domain.findMany({
      where: {
        providerId,
        Provider: { userId: user.id },
      },
    });

    for (const domain of domains) {
      await customDomain.remove(domain.externalId);
      await db.domain.delete({ where: { id: domain.id, Provider: { userId: user.id } } });
    }

    await db.provider.delete({ where: { id: providerId, userId: user.id } });

    refresh();
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete provider');
    return [errorMessage, null];
  }

  redirect(ROUTES.PROVIDERS);
}

export async function createClient(providerId: string, data: ClientFormValues): ActionResponse {
  await verifySession();

  const validation = clientSchema.safeParse(data);

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.client.create({
      data: {
        name: validation.data.name,
        audience: validation.data.audience,
        providerId,
      },
    });
    refresh();
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to create client');
    return [errorMessage, null];
  }
}

export async function deleteClient(providerId: string, clientId: string): ActionResponse {
  const { user } = await verifySession();

  try {
    await db.client.delete({
      where: {
        id: clientId,
        providerId,
        Provider: { userId: user.id },
      },
    });
    refresh();
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
  const { user } = await verifySession();

  const opts = {
    ...defaultGenerateAccessTokenOptions,
    ...options,
  };

  const client = await db.client.findUnique({
    where: {
      id: clientId,
      providerId,
      Provider: {
        userId: user.id,
      },
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
    iss: getIssuer(client.Provider.urlId, customDomain),
    aud: opts.audienceAsArray ? [client.audience] : client.audience,
    sub: client.subject,
  };

  const jwk = await db.jwks.findFirst({
    where: {
      providerId,
      Provider: {
        userId: user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const signingKey: JWK = jwk ? (jwk.key as unknown as JWK) : await createSigningKey(providerId);

  const jwtOptions = {
    jwtType: opts.useJwtType,
  };

  try {
    const token = await createJwt(claims, signingKey, jwtOptions);
    refresh();
    return [null, token];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to generate client token');
    return [errorMessage, null];
  }
}

export async function requestSigningKey(providerId: string): ActionResponse<string> {
  const { user } = await verifySession();

  const provider = await db.provider.findUnique({
    where: {
      id: providerId,
      userId: user.id,
    },
  });

  if (!provider) {
    return [ERRORS.PROVIDER_NOT_FOUND.message, null];
  }

  if (provider.rotateJwks) {
    return [ERRORS.AUTOMATIC_ROTATION_ENABLED.message, null];
  }

  // get count of keys
  const keysCount = await db.jwks.count({
    where: {
      providerId,
      Provider: {
        userId: user.id,
      },
    },
  });

  if (keysCount >= 10) {
    return ['You can only have up to 10 custom signing keys per provider', null];
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

    refresh();
    return [null, key.id];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to generate new key');
    return [errorMessage, null];
  }
}

export async function removeKey(providerId: string, id: string): ActionResponse {
  const { user } = await verifySession();

  const provider = await db.provider.findUnique({
    where: { id: providerId, userId: user.id },
  });

  if (!provider) {
    return [ERRORS.PROVIDER_NOT_FOUND.message, null];
  }

  if (provider.rotateJwks) {
    return [ERRORS.AUTOMATIC_ROTATION_ENABLED_REMOVE_KEY.message, null];
  }

  const latestKey = await db.jwks.findFirst({
    where: { providerId, Provider: { userId: user.id } },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestKey) {
    return [ERRORS.NO_KEYS_FOUND.message, null];
  }

  if (latestKey.id === id) {
    return [ERRORS.CANNOT_REMOVE_LATEST_KEY.message, null];
  }

  try {
    await db.jwks.delete({ where: { id, providerId, Provider: { userId: user.id } } });
    refresh();
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to remove key');
    return [errorMessage, null];
  }
}

export async function toggleRotateJwks(providerId: string, rotateJwks: boolean): ActionResponse {
  const { user } = await verifySession();

  try {
    await db.provider.update({
      where: { id: providerId, userId: user.id },
      data: { rotateJwks },
    });
    refresh();
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to toggle rotate JWKS');
    return [errorMessage, null];
  }
}

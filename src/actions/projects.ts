'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { generateKeyPair, exportJWK } from 'jose';
import { JWK } from 'jose';
import { Prisma } from '@prisma/client';
import Sqids from 'sqids';
import slugify from 'slugify';

import { Client, Project } from '@/types/app.types';
import db from '@/lib/db';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { createJwt, defaultJwk } from '@/utils/jwt';
import { verifySession } from '@/data/_verifySession';

const projectSchema = z.object({
  name: z.string({ required_error: 'Please enter a project name.' }),
  description: z.string({ required_error: 'Please enter a project description.' }),
});

const sqids = new Sqids({
  alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
});

export async function createProject(formData: FormData): ActionResponse<Project> {
  const session = await verifySession();

  const validation = projectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    const urlSuffix = sqids.encode([Date.now()]);
    const urlId = slugify(validation.data.name, { lower: true }) + '-' + urlSuffix;

    const project = await db.project.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        urlId,
        userId: session.user.id,
      },
    });

    revalidatePath('/u/projects', 'layout');
    return [null, project];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to create project');
    return [errorMessage, null];
  }
}

export async function updateProject(projectId: string, formData: FormData): ActionResponse<Project> {
  await verifySession();

  const validation = projectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.project.update({
      where: { id: projectId },
      data: validation.data,
    });
    revalidatePath('/u/projects', 'layout');
    return [null, null];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to update project');
    return [errorMessage, null];
  }
}

export async function deleteProject(projectId: string): ActionResponse {
  await verifySession();

  try {
    await db.project.delete({ where: { id: projectId } });
    revalidatePath('/u/projects', 'layout');
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to delete project');
    return [errorMessage, null];
  }

  redirect('/u/projects');
}

const clientSchema = z.object({
  name: z.string({ required_error: 'Please provide a client name.' }),
  audience: z.string({ required_error: 'Please provide a client audience.' }),
});

export async function createClient(projectId: string, formData: FormData): ActionResponse<Client> {
  await verifySession();

  const validation = clientSchema.safeParse({
    name: formData.get('name'),
    audience: formData.get('audience'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  try {
    await db.client.create({
      data: {
        name: validation.data.name,
        audience: validation.data.audience,
        projectId,
      },
    });
    revalidatePath(`/u/projects/${projectId}`, 'layout');
    return [null, null];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to create client');
    return [errorMessage, null];
  }
}

export async function deleteClient(projectId: string, clientId: string): ActionResponse {
  await verifySession();

  try {
    await db.client.delete({ where: { id: clientId, projectId } });
    revalidatePath(`/u/projects/${projectId}`);
    return [null, null];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to delete client');
    return [errorMessage, null];
  }
}

export async function generateAccessToken(projectId: string, clientId: string): ActionResponse<string> {
  await verifySession();

  const client = await db.client.findUnique({
    where: {
      id: clientId,
      projectId,
    },
    include: {
      Project: true,
    },
  });

  if (!client) {
    return ['Client not found', null];
  }

  const claims = {
    iss: `http://${client.Project.urlId}.auth.usegrant.dev`,
    aud: client.audience,
    sub: client.subject,
  };

  const jwk = await db.jwks.findFirst({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const signingKey: JWK = jwk ? (jwk.key as unknown as JWK) : defaultJwk;

  try {
    const token = await createJwt(claims, signingKey);
    revalidatePath(`/u/projects/${projectId}`);
    return [null, token];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to generate client token');
    return [errorMessage, null];
  }
}

export async function requestSigningKey(projectId: string): ActionResponse<string> {
  await verifySession();

  const alg = 'RS256';
  const kid = nanoid();

  try {
    const { privateKey } = await generateKeyPair(alg);
    const jwk = await exportJWK(privateKey);
    jwk.kid = kid; // Set the kid
    jwk.alg = alg;

    const key = await db.jwks.create({
      data: {
        kid,
        key: jwk as unknown as Prisma.JsonObject,
        projectId,
      },
    });

    revalidatePath(`/u/projects/${projectId}/advanced`);

    return [null, key.id];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to generate new key');
    return [errorMessage, null];
  }
}

export async function removeKey(projectId: string, id: string): ActionResponse {
  await verifySession();

  const latestKey = await db.jwks.findFirst({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestKey) {
    return ['No keys found', null];
  }

  if (latestKey.id === id) {
    return ['Cannot remove the latest key', null];
  }

  try {
    await db.jwks.delete({ where: { id, projectId } });
    revalidatePath(`/u/projects/${projectId}/advanced`);
    return [null, null];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to remove key');
    return [errorMessage, null];
  }
}

'use server';

import { z } from 'zod';
import Sqids from 'sqids';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';
import { JWK } from 'jose';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

import { Client, Project } from '@/types/app.types';
import db from '@/lib/db';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { defaultJwk, signJwt } from '@/utils/jwt';
import { verifySession } from '@/data/_verifySession';

const projectSchema = z.object({
  name: z.string({ required_error: 'Please enter a project name.' }),
  description: z.string({ required_error: 'Please enter a project description.' }),
});

const sqids = new Sqids();

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
    const urlId = slugify(urlSuffix, { lower: true }) + '-' + urlSuffix;

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
  try {
    await db.client.delete({ where: { id: clientId, projectId } });
    revalidatePath(`/u/projects/${projectId}`);
    return [null, null];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to delete client');
    return [errorMessage, null];
  }
}
export async function generateClientToken(projectId: string, clientId: string): ActionResponse<string> {
  try {
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

    const jwt = {
      jti: nanoid(),
      sub: client.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      client_id: clientId,
      iss: `http://${client.Project.urlId}.auth.usegrant.dev`,
      aud: client.audience,
    };

    const jwks = await db.jwks.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let signingKey: JWK = defaultJwk;

    if (jwks.length !== 0) {
      signingKey = jwks[0].key as unknown as JWK;
    }

    const protectedHeaders = {
      alg: 'RS256',
    };
    const token = await signJwt(jwt, protectedHeaders, signingKey);
    revalidatePath(`/u/projects/${projectId}`);
    return [null, token];
  } catch (error) {
    const errorMessage = await getApiErrorMessage(error, 'Failed to generate client token');
    return [errorMessage, null];
  }
}

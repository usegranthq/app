'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { JWK } from 'jose';
import { Prisma } from '@prisma/client';

import { Client, Project } from '@/types/app.types';
import db from '@/lib/db';
import { getApiErrorMessage, getZodErrorMessage } from '@/utils/error';
import { createJwt, defaultJwk } from '@/utils/jwt';
import { verifySession } from '@/data/_verifySession';
import { generateJwk } from '@/utils/jwk';
import { clientSchema, projectSchema } from '@/schema';
import { createUrlId, getIssuer } from '@/utils/project';
import { getPlanDetails } from '@/data/user';

export async function createProject(formData: FormData): ActionResponse<Project> {
  const session = await verifySession();

  const validation = projectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  // check if the user has reached the limit for projects
  const projectsCount = await db.project.count({
    where: {
      userId: session.user.id,
    },
  });

  const plan = await getPlanDetails();
  if (projectsCount >= plan.projects) {
    return [
      'You have reached the limit for projects. Upgrade your plan or contact support to increase the limit.',
      null,
    ];
  }

  try {
    const urlId = createUrlId(validation.data.name);

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
    const errorMessage = getApiErrorMessage(error, 'Failed to create project');
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
    const errorMessage = getApiErrorMessage(error, 'Failed to update project');
    return [errorMessage, null];
  }
}

export async function deleteProject(projectId: string): ActionResponse {
  await verifySession();

  try {
    await db.project.delete({ where: { id: projectId } });
    revalidatePath('/u/projects', 'layout');
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to delete project');
    return [errorMessage, null];
  }

  redirect('/u/projects');
}

export async function createClient(projectId: string, formData: FormData): ActionResponse<Client> {
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
      projectId,
    },
  });

  const plan = await getPlanDetails();
  if (clientsCount >= plan.clients) {
    return [
      'You have reached the limit for clients per project. Upgrade your plan or contact support to increase the limit.',
      null,
    ];
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
    const errorMessage = getApiErrorMessage(error, 'Failed to create client');
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
    const errorMessage = getApiErrorMessage(error, 'Failed to delete client');
    return [errorMessage, null];
  }
}

const defaultGenerateAccessTokenOptions = {
  audienceAsArray: true,
  useJwtType: true,
};

export async function generateAccessToken(
  projectId: string,
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
      projectId,
    },
    include: {
      Project: true,
    },
  });

  // get custom domains for the project
  const customDomain = await db.domain.findFirst({
    where: {
      projectId,
      verified: true,
    },
  });

  if (!client) {
    return ['Client not found', null];
  }

  const claims = {
    iss: getIssuer(client.Project.urlId, plan, customDomain),
    aud: opts.audienceAsArray ? [client.audience] : client.audience,
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

  const jwtOptions = {
    jwtType: opts.useJwtType,
  };

  try {
    const token = await createJwt(claims, signingKey, jwtOptions);
    revalidatePath(`/u/projects/${projectId}`);
    return [null, token];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to generate client token');
    return [errorMessage, null];
  }
}

export async function requestSigningKey(projectId: string): ActionResponse<string> {
  await verifySession();

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return ['Project not found', null];
  }

  if (project.rotateJwks) {
    return ['Unable to rotate JWKS. Automatic rotation is enabled for this project.', null];
  }

  try {
    const [kid, jwk] = await generateJwk('RS256');
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
    const errorMessage = getApiErrorMessage(error, 'Failed to generate new key');
    return [errorMessage, null];
  }
}

export async function removeKey(projectId: string, id: string): ActionResponse {
  await verifySession();

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return ['Project not found', null];
  }

  if (project.rotateJwks) {
    return ['Unable to remove key. Automatic rotation is enabled for this project.', null];
  }

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
    const errorMessage = getApiErrorMessage(error, 'Failed to remove key');
    return [errorMessage, null];
  }
}

export async function toggleRotateJwks(projectId: string, rotateJwks: boolean): ActionResponse {
  await verifySession();

  try {
    await db.project.update({ where: { id: projectId }, data: { rotateJwks } });
    revalidatePath(`/u/projects/${projectId}/advanced`);
    return [null, null];
  } catch (error) {
    const errorMessage = getApiErrorMessage(error, 'Failed to toggle rotate JWKS');
    return [errorMessage, null];
  }
}

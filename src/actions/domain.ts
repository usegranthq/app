'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import dns from 'node:dns';

import * as vercel from '@/lib/vercel';
import { verifySession } from '@/data/_verifySession';
import { getZodErrorMessage } from '@/utils/error';
import db from '@/lib/db';

const domainSchema = z
  .string({
    required_error: 'Please enter a domain name.',
  })
  .regex(/^(?!:\/\/)([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/, {
    message: 'Please enter a valid domain name.',
  })
  .regex(/^(?!www\.)/, { message: 'Domain name cannot start with www.' })
  .min(3, { message: 'Domain name must be at least 3 characters long.' })
  .max(255, { message: 'Domain name must be less than 255 characters.' });

const isApexDomain = (domain: string) => {
  return domain.split('.').length === 2;
};

const getResolvedCname = async (domain: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    dns.resolveCname(domain, (err, addresses) => {
      if (err) {
        reject([]);
      }

      resolve(addresses);
    });
  });
};

const getResolvedA = async (domain: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    dns.resolve(domain, 'A', (err, addresses) => {
      if (err) {
        reject([]);
      }

      resolve(addresses);
    });
  });
};

const isDomainVerified = async (domain: string): Promise<boolean> => {
  if (isApexDomain(domain)) {
    const resolvedA = await getResolvedA(domain);
    return resolvedA.includes('76.76.21.21');
  }

  const resolvedCname = await getResolvedCname(domain);
  return resolvedCname.includes('cname.usegrant.dev');
};

export async function addDomain(projectId: string, formData: FormData): ActionResponse {
  await verifySession();

  const validation = domainSchema.safeParse(formData.get('domain'));

  if (!validation.success) {
    return [getZodErrorMessage(validation.error), null];
  }

  const domain = validation.data;

  try {
    await vercel.addDomain(domain);
    await db.domain.create({
      data: {
        domain,
        projectId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return ['Domain already added to this project.', null];
      }
    }

    return ['Failed to add domain. Try again.', null];
  }

  revalidatePath(`/u/projects/${projectId}/settings/domain`);
  return [null, null];
}

export async function deleteDomain(projectId: string, domain: string): ActionResponse {
  await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: { domain, projectId },
  });

  if (!domainRecord) {
    return ['Domain not found.', null];
  }

  try {
    await vercel.deleteDomain(domain);
  } catch (error) {
    if (error instanceof vercel.APIError && error.response.status !== 404) {
      return ['Failed to delete domain. Try again.', null];
    }

    return ['Failed to delete domain. Try again.', null];
  }

  try {
    await db.domain.delete({
      where: { domain, projectId },
    });
  } catch {
    return ['Failed to delete domain. Try again.', null];
  }

  revalidatePath(`/u/projects/${projectId}/settings/domain`);
  return [null, null];
}

export async function verifyDomain(projectId: string, domain: string): ActionResponse {
  await verifySession();

  const domainRecord = await db.domain.findUnique({
    where: { domain, projectId },
  });

  if (!domainRecord) {
    return ['Domain not found.', null];
  }

  try {
    const response = await vercel.verifyDomain(domain);
    if (!response.verified) {
      return ['Failed to verify domain. Try checking the ownership of the domain.', null];
    }

    const isVerified = await isDomainVerified(domain);
    await db.domain.update({
      where: { domain, projectId },
      data: { verified: isVerified },
    });
  } catch {
    return ['Failed to verify domain. Try again.', null];
  }

  revalidatePath(`/u/projects/${projectId}/settings/domain`);
  return [null, null];
}

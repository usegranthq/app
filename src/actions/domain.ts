'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

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
  .min(3, { message: 'Domain name must be at least 3 characters long.' })
  .max(255, { message: 'Domain name must be less than 255 characters.' });

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

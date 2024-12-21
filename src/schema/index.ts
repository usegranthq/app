import { z } from 'zod';

import sanitize from '@/utils/sanitize';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .email({ message: 'Please enter a valid email address.' }),
  token: z.string({ required_error: 'Missing captcha verification token.' }),
});

export const verifySchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .email({ message: 'Please enter a valid email address.' }),
  code: z.string({ required_error: 'Please enter the code sent to your email.' }),
});

export const providerSchema = z.object({
  name: z.string({ required_error: 'Please enter a provider name.' }).trim().transform(sanitize),
  description: z.string({ required_error: 'Please enter a provider description.' }).trim().transform(sanitize),
});

export const clientSchema = z.object({
  name: z.string({ required_error: 'Please provide a client name.' }),
  audience: z.string({ required_error: 'Please provide a client audience.' }),
});

export const createTokenSchema = z.object({
  name: z.string().trim().transform(sanitize),
  expiration: z.string().transform(Number).optional(),
});

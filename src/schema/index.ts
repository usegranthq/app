import { z } from 'zod';

import sanitize from '@/utils/sanitize';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .email({ message: 'Please enter a valid email address.' })
    .trim()
    .transform(sanitize),
  token: z
    .string({ required_error: 'Missing captcha verification token.' })
    .min(10, { message: 'Captcha verification token is too short.' })
    .trim(),
});

export const verifySchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address.' })
    .email({ message: 'Please enter a valid email address.' })
    .trim()
    .transform(sanitize),
  code: z.string({ required_error: 'Please enter the code sent to your email.' }).trim(),
});

export const providerSchema = z.object({
  name: z
    .string({ required_error: 'Please enter a provider name.' })
    .min(3, { message: 'Provider name must be at least 3 characters long.' })
    .max(50, { message: 'Provider name must be at most 50 characters long.' })
    .trim()
    .transform(sanitize),
  description: z
    .string({ required_error: 'Please enter a provider description.' })
    .min(10, { message: 'Provider description must be at least 10 characters long.' })
    .max(200, { message: 'Provider description must be at most 200 characters long.' })
    .trim()
    .transform(sanitize),
});

export const clientSchema = z.object({
  name: z
    .string({ required_error: 'Please provide a client name.' })
    .min(3, { message: 'Client name must be at least 3 characters long.' })
    .max(50, { message: 'Client name must be at most 50 characters long.' })
    .trim()
    .transform(sanitize),
  audience: z
    .string({ required_error: 'Please provide a client audience.' })
    .min(3, { message: 'Client audience must be at least 3 characters long.' })
    .max(100, { message: 'Client audience must be at most 100 characters long.' })
    .trim()
    .transform(sanitize),
});

export const createTokenSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Token name must be at least 3 characters long.' })
    .max(50, { message: 'Token name must be at most 50 characters long.' })
    .trim()
    .transform(sanitize),
  expiration: z
    .number({ coerce: true })
    .min(0, { message: 'Token expiration must be at least 1 day.' })
    .max(365, { message: 'Token expiration must be at most 365 days.' })
    .nullable()
    .optional(),
});

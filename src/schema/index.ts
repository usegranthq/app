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

export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'API key name must be at least 3 characters long.' })
    .max(50, { message: 'API key name must be at most 50 characters long.' })
    .trim()
    .transform(sanitize),
  expiration: z
    .number({ coerce: true })
    .min(0, { message: 'API key expiration must be at least 1 day.' })
    .max(365, { message: 'API key expiration must be at most 365 days.' })
    .nullable()
    .optional(),
});

export const tenantSchema = z.object({
  name: z
    .string({ required_error: 'Please provide a tenant name.' })
    .min(3, { message: 'Tenant name must be at least 3 characters long.' })
    .max(50, { message: 'Tenant name must be at most 50 characters long.' })
    .trim()
    .transform(sanitize),
  description: z
    .string({ required_error: 'Please provide a tenant description.' })
    .min(10, { message: 'Tenant description must be at least 10 characters long.' })
    .max(200, { message: 'Tenant description must be at most 200 characters long.' })
    .trim()
    .transform(sanitize),
});

export const conditionsSchema = z.object({
  key: z
    .string({ required_error: 'Please provide a condition key.' })
    .min(1, { message: 'Please provide a condition key.' })
    .max(10, { message: 'Condition key must be at most 10 characters long.' })
    .transform(sanitize),
  operator: z.enum(['stringEquals', 'stringLike', 'stringNotEquals', 'stringNotLike']),
  value: z
    .string({ required_error: 'Please provide a condition value.' })
    .min(1, { message: 'Please provide a condition value.' })
    .max(100, { message: 'Condition value must be at most 100 characters long.' })
    .transform(sanitize),
});

export const tenantProviderSchema = z.object({
  url: z
    .string({ required_error: 'Please provide a provider URL.' })
    .trim()
    .url({ message: 'Please provide a valid URL.' })
    .refine((url) => url.startsWith('https://'), 'URL must use HTTPS protocol')
    .transform((url) => url.replace(/\/$/, '')) // Remove trailing slash
    .transform(sanitize),
  fingerprints: z
    .array(
      z
        .string({ required_error: 'Please provide the provider fingerprint.' })
        .min(32, { message: 'Fingerprint must be at least 32 characters long.' })
        .max(64, { message: 'Fingerprint must be at most 64 characters long.' })
        .trim()
        .transform(sanitize),
    )
    .min(1, { message: 'Provider must have at least one fingerprint.' })
    .max(5, { message: 'Provider must have at most 5 fingerprints.' }),
  audience: z
    .string({ required_error: 'Please provide the provider audience.' })
    .min(3, { message: 'Provider audience must be at least 3 characters long.' })
    .max(100, { message: 'Provider audience must be at most 100 characters long.' })
    .trim()
    .transform(sanitize),
  earliestIssuanceTimeAllowed: z
    .number({ required_error: 'Please provide the earliest issuance time allowed.', coerce: true })
    .describe('Earliest issuance time allowed in hours')
    .min(0, { message: 'Earliest issuance time allowed must be at least 0.' })
    .max(12, { message: 'Earliest issuance time allowed must be at most 12.' }),
});

export const tenantProviderPolicySchema = z.object({
  name: z
    .string({ required_error: 'Please provide a policy name.' })
    .min(3, { message: 'Policy name must be at least 3 characters long.' })
    .max(50, { message: 'Policy name must be at most 50 characters long.' })
    .trim()
    .transform(sanitize),
  description: z
    .string({ required_error: 'Please provide a policy description.' })
    .min(10, { message: 'Policy description must be at least 10 characters long.' })
    .max(200, { message: 'Policy description must be at most 200 characters long.' })
    .trim()
    .transform(sanitize),
  audience: z
    .string({ required_error: 'Please provide the provider audience.' })
    .min(3, { message: 'Provider audience must be at least 3 characters long.' })
    .max(100, { message: 'Provider audience must be at most 100 characters long.' })
    .trim()
    .transform(sanitize),
  conditions: z.array(conditionsSchema).optional(),
});

export const domainSchema = z
  .string({
    required_error: 'Please enter a domain name.',
  })
  .regex(/^(?!:\/\/)([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/, {
    message: 'Please enter a valid domain name.',
  })
  .regex(/^(?!www\.)/, { message: 'Domain name cannot start with www.' })
  .min(3, { message: 'Domain name must be at least 3 characters long.' })
  .max(255, { message: 'Domain name must be less than 255 characters.' });

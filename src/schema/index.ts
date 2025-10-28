import z from 'zod';

const DEFAULT_SAFE_REGEX = [
  /^[A-Za-z\d\-_\s]+$/,
  'Invalid characters. Please Use only alphabets, numbers, hyphens, underscores, and spaces.',
] as const;

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address.').trim(),
  token: z.string('Missing captcha verification token.').min(10, 'Captcha verification token is too short.').trim(),
});

export const verifySchema = z.object({
  email: z.email('Please enter a valid email address.').trim(),
  code: z.string().trim().min(1, 'Please enter the code sent to your email.'),
});

export const profileSchema = z.object({
  email: z.email('Please enter a valid email address.').trim(),
});

export const providerSchema = z.object({
  name: z
    .string('Please enter a provider name.')
    .regex(...DEFAULT_SAFE_REGEX)
    .min(3, 'Provider name must be at least 3 characters long.')
    .max(50, 'Provider name must be at most 50 characters long.')
    .trim(),
  description: z
    .string({ error: 'Please enter a provider description.' })
    .trim()
    .regex(...DEFAULT_SAFE_REGEX)
    .min(10, 'Provider description must be at least 10 characters long.')
    .max(200, 'Provider description must be at most 200 characters long.'),
});

export const clientSchema = z.object({
  name: z
    .string('Please provide a client name.')
    .regex(...DEFAULT_SAFE_REGEX)
    .trim()
    .min(3, 'Client name must be at least 3 characters long.')
    .max(50, 'Client name must be at most 50 characters long.'),
  audience: z
    .string('Please provide a client audience.')
    .regex(...DEFAULT_SAFE_REGEX)
    .trim()
    .min(3, 'Client audience must be at least 3 characters long.')
    .max(100, 'Client audience must be at most 100 characters long.'),
});

export const createApiKeySchema = z.object({
  name: z
    .string()
    .regex(...DEFAULT_SAFE_REGEX)
    .trim()
    .min(3, 'API key name must be at least 3 characters long.')
    .max(50, 'API key name must be at most 50 characters long.'),
  expiration: z.coerce
    .number()
    .min(0, 'API key expiration must be at least 1 day.')
    .max(365, 'API key expiration must be at most 365 days.')
    .nullable()
    .optional(),
});

export const tenantSchema = z.object({
  name: z
    .string('Please provide a tenant name.')
    .regex(...DEFAULT_SAFE_REGEX)
    .trim()
    .min(3, 'Tenant name must be at least 3 characters long.')
    .max(50, 'Tenant name must be at most 50 characters long.'),
  description: z
    .string('Please provide a tenant description.')
    .regex(...DEFAULT_SAFE_REGEX)
    .trim()
    .min(10, 'Tenant description must be at least 10 characters long.')
    .max(200, 'Tenant description must be at most 200 characters long.'),
});

export const conditionsSchema = z.object({
  key: z
    .string('Please provide a condition key.')
    .min(1, 'Please provide a condition key.')
    .max(10, 'Condition key must be at most 10 characters long.')
    .regex(...DEFAULT_SAFE_REGEX),
  operator: z.enum(['stringEquals', 'stringLike', 'stringNotEquals', 'stringNotLike']),
  value: z
    .string('Please provide a condition value.')
    .min(1, 'Please provide a condition value.')
    .max(100, 'Condition value must be at most 100 characters long.')
    .regex(...DEFAULT_SAFE_REGEX),
});

export const tenantProviderSchema = z.object({
  url: z
    .url('Please provide a valid URL.')
    .refine((url) => url.startsWith('https://'), 'URL must use HTTPS protocol')
    .transform((url) => url.replace(/\/$/, '')), // Remove trailing slash
  fingerprints: z
    .array(
      z
        .string('Please provide the provider fingerprint.')
        .trim()
        .min(32, 'Fingerprint must be at least 32 characters long.')
        .max(64, 'Fingerprint must be at most 64 characters long.')
        .regex(...DEFAULT_SAFE_REGEX),
    )
    .min(1, 'Provider must have at least one fingerprint.')
    .max(5, 'Provider must have at most 5 fingerprints.'),
  audience: z
    .string('Please provide the provider audience.')
    .trim()
    .min(3, 'Provider audience must be at least 3 characters long.')
    .max(100, 'Provider audience must be at most 100 characters long.')
    .regex(...DEFAULT_SAFE_REGEX),
  earliestIssuanceTimeAllowed: z.coerce
    .number<number>('Please provide the earliest issuance time allowed.')
    .describe('Earliest issuance time allowed in hours')
    .min(0, 'Earliest issuance time allowed must be at least 0.')
    .max(12, 'Earliest issuance time allowed must be at most 12.'),
});

export const tenantProviderPolicySchema = z.object({
  name: z
    .string('Please provide a policy name.')
    .min(3, 'Policy name must be at least 3 characters long.')
    .max(50, 'Policy name must be at most 50 characters long.')
    .trim()
    .regex(...DEFAULT_SAFE_REGEX),
  description: z
    .string('Please provide a policy description.')
    .min(10, 'Policy description must be at least 10 characters long.')
    .max(200, 'Policy description must be at most 200 characters long.')
    .trim()
    .regex(...DEFAULT_SAFE_REGEX),
  audience: z
    .string('Please provide the provider audience.')
    .min(3, 'Provider audience must be at least 3 characters long.')
    .max(100, 'Provider audience must be at most 100 characters long.')
    .trim()
    .regex(...DEFAULT_SAFE_REGEX),
  conditions: z.array(conditionsSchema).optional(),
});

export const domainSchema = z
  .string('Please enter a domain name.')
  .regex(/^(?!:\/\/)([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/, 'Please enter a valid domain name.')
  .regex(/^(?!www\.)/, 'Domain name cannot start with www.')
  .min(3, 'Domain name must be at least 3 characters long.')
  .max(255, 'Domain name must be less than 255 characters long.');

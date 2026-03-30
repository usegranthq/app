import { oc } from '@orpc/contract';
import z from 'zod/v4';

import {
  clientSchema,
  conditionsSchema,
  domainSchema,
  providerSchema,
  tenantProviderPolicySchema,
  tenantProviderSchema,
  tenantSchema,
} from '@/schema';
import { MAX_EXPIRY, ONE_HOUR } from '@/utils/jwt';
import { STATUS_CODES } from '@/utils/rest';

import ERRORS from './errors';

const contractBase = oc.errors({
  INTERNAL_SERVER_ERROR: {
    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred. Please try again later.',
  },
});

const listProvidersContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/providers',
    successStatus: STATUS_CODES.OK,
    summary: 'List Providers',
    tags: ['providers'],
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        urlId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        rotateJwks: z.boolean(),
      }),
    ),
  );

const getProviderContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/providers/{id}',
    successStatus: STATUS_CODES.OK,
    summary: 'Get Provider',
    tags: ['providers'],
  })
  .input(z.object({ id: z.string().describe('Provider ID') }))
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
  })
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      rotateJwks: z.boolean(),
      urlId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const createProviderContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/providers',
    successStatus: STATUS_CODES.CREATED,
    summary: 'Create Provider',
    tags: ['providers'],
  })
  .input(providerSchema)
  .errors({
    [ERRORS.PROVIDERS_NOT_AVAILABLE.code]: ERRORS.PROVIDERS_NOT_AVAILABLE,
    [ERRORS.MAX_PROVIDERS_LIMIT_REACHED.code]: ERRORS.MAX_PROVIDERS_LIMIT_REACHED,
  })
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      urlId: z.string(),
      rotateJwks: z.boolean(),
    }),
  );

const deleteProviderContract = contractBase
  .route({
    method: 'DELETE',
    path: '/v1/providers/{id}',
    successStatus: STATUS_CODES.NO_CONTENT,
    summary: 'Delete Provider',
    tags: ['providers'],
  })
  .input(z.object({ id: z.string('Provider ID') }))
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
  });

const createClientContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/providers/{providerId}/clients',
    successStatus: STATUS_CODES.CREATED,
    summary: 'Create Client',
    tags: ['providers/clients'],
  })
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.MAX_CLIENTS_LIMIT_REACHED.code]: ERRORS.MAX_CLIENTS_LIMIT_REACHED,
    [ERRORS.CLIENT_ALREADY_EXISTS.code]: ERRORS.CLIENT_ALREADY_EXISTS,
  })
  .input(
    clientSchema.extend({
      providerId: z.string().describe('Provider ID'),
    }),
  )
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      audience: z.string(),
      subject: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      providerId: z.string(),
    }),
  );

const deleteClientContract = contractBase
  .route({
    method: 'DELETE',
    path: '/v1/providers/{providerId}/clients/{clientId}',
    successStatus: STATUS_CODES.NO_CONTENT,
    summary: 'Delete Client',
    tags: ['providers/clients'],
  })
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.CLIENT_NOT_FOUND.code]: ERRORS.CLIENT_NOT_FOUND,
  })
  .input(
    z.object({
      providerId: z.string().describe('Provider ID'),
      clientId: z.string().describe('Client ID'),
    }),
  );

const listClientsContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/providers/{providerId}/clients',
    successStatus: STATUS_CODES.OK,
    summary: 'List Clients',
    tags: ['providers/clients'],
  })
  .input(z.object({ providerId: z.string().describe('Provider ID') }))
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        audience: z.string(),
        subject: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  );

const getClientContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/providers/{providerId}/clients/{clientId}',
    successStatus: STATUS_CODES.OK,
    summary: 'Get Client',
    tags: ['providers/clients'],
  })
  .input(
    z.object({
      providerId: z.string().describe('Provider ID'),
      clientId: z.string().describe('Client ID'),
    }),
  )
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.CLIENT_NOT_FOUND.code]: ERRORS.CLIENT_NOT_FOUND,
  })
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      audience: z.string(),
      subject: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const createAccessTokenContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/providers/{providerId}/clients/{clientId}/tokens',
    successStatus: STATUS_CODES.CREATED,
    summary: 'Create Access Token',
    tags: ['providers/clients/tokens'],
  })
  .input(
    z.object({
      providerId: z.string().describe('Provider ID'),
      clientId: z.string().describe('Client ID'),
      // payload
      expiresIn: z.number().positive().max(MAX_EXPIRY).default(ONE_HOUR),
      useJwtType: z.boolean().optional(),
      audienceAsArray: z.boolean().optional(),
      forceDefaultDomain: z.boolean().optional(),
    }),
  )
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.CLIENT_NOT_FOUND.code]: ERRORS.CLIENT_NOT_FOUND,
  })
  .output(
    z.strictObject({
      accessToken: z.string(),
      type: z.literal('Bearer'),
      expiresAt: z.date(),
    }),
  );

const listDomainsContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/providers/{providerId}/domains',
    successStatus: STATUS_CODES.OK,
    summary: 'List Domains',
    tags: ['providers/domains'],
  })
  .input(z.object({ providerId: z.string().describe('Provider ID') }))
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        domain: z.string(),
        verified: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  );

const getDomainContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/providers/{providerId}/domains/{domainId}',
    successStatus: STATUS_CODES.OK,
    summary: 'Get Domain',
    tags: ['providers/domains'],
  })
  .input(
    z.object({
      providerId: z.string().describe('Provider ID'),
      domainId: z.string().describe('Domain ID'),
    }),
  )
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.DOMAIN_NOT_FOUND.code]: ERRORS.DOMAIN_NOT_FOUND,
  })
  .output(
    z.object({
      id: z.string(),
      domain: z.string(),
      verified: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const verifyDomainContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/providers/{providerId}/domains/{domainId}/verify',
    successStatus: STATUS_CODES.OK,
    summary: 'Verify Domain',
    tags: ['providers/domains'],
  })
  .input(
    z.object({
      providerId: z.string().describe('Provider ID'),
      domainId: z.string().describe('Domain ID'),
    }),
  )
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.DOMAIN_NOT_FOUND.code]: ERRORS.DOMAIN_NOT_FOUND,
    [ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE.code]: ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE,
  })
  .output(
    z.strictObject({
      verified: z.boolean(),
      message: z.string(),
      domain: z
        .strictObject({
          id: z.string(),
          domain: z.string(),
          verified: z.boolean(),
          createdAt: z.date(),
          updatedAt: z.date(),
        })
        .nullable(),
    }),
  );

const addDomainContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/providers/{providerId}/domains',
    successStatus: STATUS_CODES.CREATED,
    summary: 'Add Domain to Provider',
    tags: ['providers/domains'],
  })
  .input(
    z.object({
      providerId: z.string().describe('Provider ID'),
      domain: domainSchema,
    }),
  )
  .errors({
    [ERRORS.MAX_DOMAINS_LIMIT_REACHED.code]: ERRORS.MAX_DOMAINS_LIMIT_REACHED,
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.DOMAIN_ALREADY_ADDED.code]: ERRORS.DOMAIN_ALREADY_ADDED,
    [ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE.code]: ERRORS.CUSTOM_DOMAINS_NOT_AVAILABLE,
  })
  .output(
    z.object({
      id: z.string(),
      domain: z.string(),
      verified: z.boolean(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const deleteDomainContract = contractBase
  .route({
    method: 'DELETE',
    path: '/v1/providers/{providerId}/domains/{domainId}',
    successStatus: STATUS_CODES.NO_CONTENT,
    summary: 'Delete Domain',
    tags: ['providers/domains'],
  })
  .input(
    z.object({
      providerId: z.string().describe('Provider ID'),
      domainId: z.string().describe('Domain ID'),
    }),
  )
  .errors({
    [ERRORS.PROVIDER_NOT_FOUND.code]: ERRORS.PROVIDER_NOT_FOUND,
    [ERRORS.DOMAIN_NOT_FOUND.code]: ERRORS.DOMAIN_NOT_FOUND,
  });

const listTenantsContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/tenants',
    successStatus: STATUS_CODES.OK,
    summary: 'List Tenants',
    tags: ['tenants'],
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  );

const getTenantContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/tenants/{id}',
    successStatus: STATUS_CODES.OK,
    summary: 'Get Tenant',
    tags: ['tenants'],
  })
  .input(z.object({ id: z.string().describe('Tenant ID') }))
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
  })
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const createTenantContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/tenants',
    successStatus: STATUS_CODES.CREATED,
    summary: 'Create Tenant',
    tags: ['tenants'],
  })
  .errors({
    [ERRORS.TENANTS_NOT_AVAILABLE.code]: ERRORS.TENANTS_NOT_AVAILABLE,
    [ERRORS.MAX_TENANTS_LIMIT_REACHED.code]: ERRORS.MAX_TENANTS_LIMIT_REACHED,
    [ERRORS.TENANT_ALREADY_EXISTS.code]: ERRORS.TENANT_ALREADY_EXISTS,
  })
  .input(tenantSchema)
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const deleteTenantContract = contractBase
  .route({
    method: 'DELETE',
    path: '/v1/tenants/{id}',
    successStatus: STATUS_CODES.NO_CONTENT,
    summary: 'Delete Tenant',
    tags: ['tenants'],
  })
  .input(z.object({ id: z.string().describe('Tenant ID') }))
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
  });

const createTenantProviderContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/tenants/{tenantId}/providers',
    successStatus: STATUS_CODES.CREATED,
    summary: 'Create Tenant Provider',
    tags: ['tenants/providers'],
  })
  .input(
    tenantProviderSchema.extend({
      tenantId: z.string().describe('Tenant ID'),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.MAX_TENANT_PROVIDERS_LIMIT_REACHED.code]: ERRORS.MAX_TENANT_PROVIDERS_LIMIT_REACHED,
    [ERRORS.TENANT_PROVIDER_ALREADY_EXISTS.code]: ERRORS.TENANT_PROVIDER_ALREADY_EXISTS,
  })
  .output(
    z.object({
      id: z.string(),
      url: z.string(),
      audience: z.string(),
      fingerprints: z.string().array(),
      earliestIssuanceTimeAllowed: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const listTenantProvidersContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/tenants/{tenantId}/providers',
    successStatus: STATUS_CODES.OK,
    summary: 'List Tenant Providers',
    tags: ['tenants/providers'],
  })
  .input(z.object({ tenantId: z.string().describe('Tenant ID') }))
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        url: z.string(),
        audience: z.string(),
        fingerprints: z.string().array(),
        earliestIssuanceTimeAllowed: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  );

const getTenantProviderContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/tenants/{tenantId}/providers/{tenantProviderId}',
    successStatus: STATUS_CODES.OK,
    summary: 'Get Tenant Provider',
    tags: ['tenants/providers'],
  })
  .input(
    z.object({
      tenantId: z.string().describe('Tenant ID'),
      tenantProviderId: z.string().describe('Tenant Provider ID'),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_NOT_FOUND,
  })
  .output(
    z.object({
      id: z.string(),
      url: z.string(),
      audience: z.string(),
      fingerprints: z.string().array(),
      earliestIssuanceTimeAllowed: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const deleteTenantProviderContract = contractBase
  .route({
    method: 'DELETE',
    path: '/v1/tenants/{tenantId}/providers/{tenantProviderId}',
    successStatus: STATUS_CODES.NO_CONTENT,
    summary: 'Delete Tenant Provider',
    tags: ['tenants/providers'],
  })
  .input(
    z.object({
      tenantId: z.string().describe('Tenant ID'),
      tenantProviderId: z.string().describe('Tenant Provider ID'),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_NOT_FOUND,
  });

const listTenantProviderPoliciesContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/tenants/{tenantId}/providers/{tenantProviderId}/policies',
    successStatus: STATUS_CODES.OK,
    summary: 'List Tenant Provider Policies',
    tags: ['tenants/providers/policies'],
  })
  .input(
    z.object({
      tenantId: z.string().describe('Tenant ID'),
      tenantProviderId: z.string().describe('Tenant Provider ID'),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_NOT_FOUND,
  })
  .output(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        audience: z.string(),
        conditions: z.array(conditionsSchema).optional().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    ),
  );

const createTenantProviderPolicyContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/tenants/{tenantId}/providers/{tenantProviderId}/policies',
    successStatus: STATUS_CODES.CREATED,
    summary: 'Create Tenant Provider Policy',
    tags: ['tenants/providers/policies'],
  })
  .input(
    tenantProviderPolicySchema.extend({
      tenantId: z.string().describe('Tenant ID'),
      tenantProviderId: z.string().describe('Tenant Provider ID'),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_NOT_FOUND,
    [ERRORS.MAX_TENANT_PROVIDER_POLICIES_LIMIT_REACHED.code]: ERRORS.MAX_TENANT_PROVIDER_POLICIES_LIMIT_REACHED,
    [ERRORS.TENANT_PROVIDER_POLICY_ALREADY_EXISTS.code]: ERRORS.TENANT_PROVIDER_POLICY_ALREADY_EXISTS,
  })
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      audience: z.string(),
      conditions: z.array(conditionsSchema).optional().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const getTenantProviderPolicyContract = contractBase
  .route({
    method: 'GET',
    path: '/v1/tenants/{tenantId}/providers/{tenantProviderId}/policies/{policyId}',
    successStatus: STATUS_CODES.OK,
    summary: 'Get Tenant Provider Policy',
    tags: ['tenants/providers/policies'],
  })
  .input(
    z.object({
      tenantId: z.string().describe('Tenant ID'),
      tenantProviderId: z.string().describe('Tenant Provider ID'),
      policyId: z.string().describe('Policy ID'),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_POLICY_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_POLICY_NOT_FOUND,
  })
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      audience: z.string(),
      conditions: z.array(conditionsSchema).optional().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  );

const deleteTenantProviderPolicyContract = contractBase
  .route({
    method: 'DELETE',
    path: '/v1/tenants/{tenantId}/providers/{tenantProviderId}/policies/{policyId}',
    successStatus: STATUS_CODES.NO_CONTENT,
    summary: 'Delete Tenant Provider Policy',
    tags: ['tenants/providers/policies'],
  })
  .input(
    z.object({
      tenantId: z.string().describe('Tenant ID'),
      tenantProviderId: z.string().describe('Tenant Provider ID'),
      policyId: z.string().describe('Policy ID'),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_NOT_FOUND,
    [ERRORS.TENANT_PROVIDER_POLICY_NOT_FOUND.code]: ERRORS.TENANT_PROVIDER_POLICY_NOT_FOUND,
  });

const validateTokenContract = contractBase
  .route({
    method: 'POST',
    path: '/v1/tenants/{tenantId}/validate',
    successStatus: STATUS_CODES.OK,
    summary: 'Validate Token',
    tags: ['tenants/tokens'],
  })
  .input(
    z.object({
      tenantId: z.string().describe('Tenant ID'),
      tenantProviderPolicyId: z.string(),
      token: z.string(),
    }),
  )
  .errors({
    [ERRORS.TENANT_NOT_FOUND.code]: ERRORS.TENANT_NOT_FOUND,
    [ERRORS.INVALID_TOKEN.code]: ERRORS.INVALID_TOKEN,
    [ERRORS.INVALID_ISSUER.code]: ERRORS.INVALID_ISSUER,
    [ERRORS.INVALID_TOKEN_HEADERS.code]: ERRORS.INVALID_TOKEN_HEADERS,
    [ERRORS.EXPIRED_TOKEN.code]: ERRORS.EXPIRED_TOKEN,
  })
  .output(
    z.strictObject({
      exp: z.number().optional(),
    }),
  );

const contract = {
  providers: {
    list: listProvidersContract,
    get: getProviderContract,
    create: createProviderContract,
    delete: deleteProviderContract,
    domains: {
      list: listDomainsContract,
      get: getDomainContract,
      add: addDomainContract,
      verify: verifyDomainContract,
      delete: deleteDomainContract,
    },
    clients: {
      list: listClientsContract,
      get: getClientContract,
      create: createClientContract,
      delete: deleteClientContract,
      tokens: {
        create: createAccessTokenContract,
      },
    },
  },
  tenants: {
    list: listTenantsContract,
    get: getTenantContract,
    create: createTenantContract,
    delete: deleteTenantContract,
    providers: {
      list: listTenantProvidersContract,
      get: getTenantProviderContract,
      create: createTenantProviderContract,
      delete: deleteTenantProviderContract,
      policies: {
        list: listTenantProviderPoliciesContract,
        get: getTenantProviderPolicyContract,
        create: createTenantProviderPolicyContract,
        delete: deleteTenantProviderPolicyContract,
      },
    },
    tokens: {
      validate: validateTokenContract,
    },
  },
};

export default contract;

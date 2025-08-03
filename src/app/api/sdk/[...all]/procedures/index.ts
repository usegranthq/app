import addDomain from './add-domain';
import createAccessToken from './create-access-token';
import createClient from './create-client';
import createProvider from './create-provider';
import createTenant from './create-tenant';
import createTenantProvider from './create-tenant-provider';
import createTenantProviderPolicy from './create-tenant-provider-policy';
import deleteClient from './delete-client';
import deleteDomain from './delete-domain';
import deleteProvider from './delete-provider';
import deleteTenant from './delete-tenant';
import deleteTenantProvider from './delete-tenant-provider';
import deleteTenantProviderPolicy from './delete-tenant-provider-policy';
import getClient from './get-client';
import getDomain from './get-domain';
import getProvider from './get-provider';
import getTenant from './get-tenant';
import getTenantProvider from './get-tenant-provider';
import getTenantProviderPolicy from './get-tenant-provider-policy';
import listClients from './list-clients';
import listDomains from './list-domains';
import listProviders from './list-providers';
import listTenantProviderPolicies from './list-tenant-provider-policy';
import listTenantProviders from './list-tenant-providers';
import listTenants from './list-tenants';
import validateToken from './validate-token';
import verifyDomain from './verify-domain';

const procedures = {
  providers: {
    list: listProviders,
    get: getProvider,
    create: createProvider,
    delete: deleteProvider,
    clients: {
      list: listClients,
      get: getClient,
      create: createClient,
      delete: deleteClient,
      tokens: {
        create: createAccessToken,
      },
    },
    domains: {
      list: listDomains,
      get: getDomain,
      add: addDomain,
      verify: verifyDomain,
      delete: deleteDomain,
    },
  },
  tenants: {
    list: listTenants,
    get: getTenant,
    create: createTenant,
    delete: deleteTenant,
    providers: {
      list: listTenantProviders,
      get: getTenantProvider,
      create: createTenantProvider,
      delete: deleteTenantProvider,
      policies: {
        list: listTenantProviderPolicies,
        get: getTenantProviderPolicy,
        create: createTenantProviderPolicy,
        delete: deleteTenantProviderPolicy,
      },
    },
    tokens: {
      validate: validateToken,
    },
  },
};

export default procedures;

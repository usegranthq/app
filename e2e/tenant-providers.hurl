# test connection
GET http://localhost:3000
HTTP 200

# create tenant first (needed for tenant providers)
POST {{domain}}/v1/tenants
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "name": "Test Tenant for Providers",
  "description": "A test tenant for tenant provider e2e testing"
}
HTTP 201
[Captures]
tenantId: jsonpath "$.id"
[Asserts]
jsonpath "$.name" == "Test Tenant for Providers"
jsonpath "$.id" exists

# list tenant providers (should be empty initially)
GET {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

# create tenant provider
POST {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "url": "https://example.com/.well-known/jwks.json",
  "audience": "test-audience",
  "fingerprints": ["Fd16c6Zid4MaSWiEvPEqaAPK4yjTadOa", "ehilOlRwX4JpDH5kkdGeUMZUqMDgXX3C"],
  "earliestIssuanceTimeAllowed": 12
}
HTTP 201
[Captures]
tenantProviderId: jsonpath "$.id"
[Asserts]
jsonpath "$.url" == "https://example.com/.well-known/jwks.json"
jsonpath "$.audience" == "test-audience"
jsonpath "$.fingerprints" count == 2
jsonpath "$.fingerprints[0]" == "Fd16c6Zid4MaSWiEvPEqaAPK4yjTadOa"
jsonpath "$.fingerprints[1]" == "ehilOlRwX4JpDH5kkdGeUMZUqMDgXX3C"
jsonpath "$.earliestIssuanceTimeAllowed" == 12
jsonpath "$.id" exists

# list tenant providers (should contain the created provider)
GET {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 1
jsonpath "$[0].id" == {{tenantProviderId}}
jsonpath "$[0].url" == "https://example.com/.well-known/jwks.json"
jsonpath "$[0].audience" == "test-audience"

# get specific tenant provider
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$.id" == {{tenantProviderId}}
jsonpath "$.url" == "https://example.com/.well-known/jwks.json"
jsonpath "$.audience" == "test-audience"
jsonpath "$.fingerprints" count == 2

# test missing required fields for tenant provider
POST {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "audience": "test-audience"
}
HTTP 422

# test invalid tenant id for tenant provider
POST {{domain}}/v1/tenants/invalid-tenant-id/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "url": "https://example.com/.well-known/jwks.json",
  "audience": "test-audience",
  "fingerprints": ["Fd16c6Zid4MaSWiEvPEqaAPK4yjTadOa"],
  "earliestIssuanceTimeAllowed": 12
}
HTTP 404

# list tenant provider policies (should be empty initially)
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

# create tenant provider policy
POST {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "name": "Test Policy",
  "description": "A test policy for tenant provider",
  "audience": "policy-audience",
  "conditions": [
    {
      "key": "sub",
      "operator": "stringLike",
      "value": "test-value"
    }
  ]
}
HTTP 201
[Captures]
policyId: jsonpath "$.id"
[Asserts]
jsonpath "$.name" == "Test Policy"
jsonpath "$.description" == "A test policy for tenant provider"
jsonpath "$.audience" == "policy-audience"
jsonpath "$.conditions" exists
jsonpath "$.id" exists

# list tenant provider policies (should contain the created policy)
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 1
jsonpath "$[0].id" == {{policyId}}
jsonpath "$[0].name" == "Test Policy"
jsonpath "$[0].audience" == "policy-audience"

# get specific tenant provider policy
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies/{{policyId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$.id" == {{policyId}}
jsonpath "$.name" == "Test Policy"
jsonpath "$.description" == "A test policy for tenant provider"
jsonpath "$.audience" == "policy-audience"
jsonpath "$.conditions" exists

# test missing required fields for policy
POST {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "description": "Missing name field"
}
HTTP 422

# test invalid tenant provider id for policy
POST {{domain}}/v1/tenants/{{tenantId}}/providers/invalid-provider-id/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "name": "Test Policy",
  "description": "A test policy",
  "audience": "policy-audience",
  "conditions": []
}
HTTP 404

# create second tenant provider policy
POST {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "name": "Second Policy",
  "description": "Another test policy",
  "audience": "second-audience",
  "conditions": [
    {
      "key": "sub",
      "operator": "stringLike",
      "value": "test-value"
    }
  ]
}
HTTP 201
[Captures]
secondPolicyId: jsonpath "$.id"

# list policies should now have 2 items
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 2

# delete first policy
DELETE {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies/{{policyId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 204

# verify first policy is deleted - get should return 404
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies/{{policyId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 404

# list policies should now have 1 item
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 1
jsonpath "$[0].id" == {{secondPolicyId}}

# delete second policy
DELETE {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies/{{secondPolicyId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 204

# list policies should be empty again
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}/policies
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

# create second tenant provider
POST {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "url": "https://auth0.example.com/.well-known/jwks.json",
  "audience": "second-audience",
  "fingerprints": ["FRxnBnVSiy64U7oHpkGOsNH0TBCoEZaT"],
  "earliestIssuanceTimeAllowed": 12
}
HTTP 201
[Captures]
secondTenantProviderId: jsonpath "$.id"

# list tenant providers should now have 2 items
GET {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 2

# delete first tenant provider
DELETE {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 204

# verify first tenant provider is deleted - get should return 404
GET {{domain}}/v1/tenants/{{tenantId}}/providers/{{tenantProviderId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 404

# list tenant providers should now have 1 item
GET {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 1
jsonpath "$[0].id" == {{secondTenantProviderId}}

# delete second tenant provider
DELETE {{domain}}/v1/tenants/{{tenantId}}/providers/{{secondTenantProviderId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 204

# list tenant providers should be empty again
GET {{domain}}/v1/tenants/{{tenantId}}/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

# clean up - delete the test tenant
DELETE {{domain}}/v1/tenants/{{tenantId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 204

# verify tenant is deleted
GET {{domain}}/v1/tenants/{{tenantId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 404

# list tenant should be empty
GET {{domain}}/v1/tenants
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

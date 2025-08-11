# test connection
GET http://localhost:3000
HTTP 200

# list tenants (should be empty initially)
GET {{domain}}/v1/tenants
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

# create tenant
POST {{domain}}/v1/tenants
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "name": "Test Tenant",
  "description": "A test tenant for e2e testing"
}
HTTP 201
[Captures]
tenantId: jsonpath "$.id"
[Asserts]
jsonpath "$.name" == "Test Tenant"
jsonpath "$.description" == "A test tenant for e2e testing"
jsonpath "$.id" exists

# list tenants (should contain the created tenant)
GET {{domain}}/v1/tenants
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 1
jsonpath "$[0].id" == {{tenantId}}
jsonpath "$[0].name" == "Test Tenant"
jsonpath "$[0].description" == "A test tenant for e2e testing"

# get specific tenant
GET {{domain}}/v1/tenants/{{tenantId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$.id" == {{tenantId}}
jsonpath "$.name" == "Test Tenant"
jsonpath "$.description" == "A test tenant for e2e testing"

# test missing required fields
POST {{domain}}/v1/tenants
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "description": "Missing name field"
}
HTTP 422

# delete tenant
DELETE {{domain}}/v1/tenants/{{tenantId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 204

# verify tenant is deleted - get should return 404
GET {{domain}}/v1/tenants/{{tenantId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 404

# list tenants (should be empty again after deletion)
GET {{domain}}/v1/tenants
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

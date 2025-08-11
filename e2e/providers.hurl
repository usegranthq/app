# test connection
GET http://localhost:3000
HTTP 200

# list providers (should be empty initially)
GET {{domain}}/v1/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

# create provider
POST {{domain}}/v1/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
Content-Type: application/json
{
  "name": "Test Provider",
  "description": "A test provider for e2e testing"
}
HTTP 201
[Captures]
providerId: jsonpath "$.id"
[Asserts]
jsonpath "$.name" == "Test Provider"
jsonpath "$.description" == "A test provider for e2e testing"
jsonpath "$.id" exists

# list providers (should contain the created provider)
GET {{domain}}/v1/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" count == 1
jsonpath "$[0].id" == {{providerId}}
jsonpath "$[0].name" == "Test Provider"
jsonpath "$[0].description" == "A test provider for e2e testing"

# get specific provider
GET {{domain}}/v1/providers/{{providerId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$.id" == {{providerId}}
jsonpath "$.name" == "Test Provider"
jsonpath "$.description" == "A test provider for e2e testing"

# delete provider
DELETE {{domain}}/v1/providers/{{providerId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 204

# verify provider is deleted - get should return 404
GET {{domain}}/v1/providers/{{providerId}}
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 404

# list providers (should be empty again after deletion)
GET {{domain}}/v1/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

# test connection
GET http://localhost:3000
HTTP 200

# return 401 for invalid token
GET {{domain}}/v1/providers
Authorization: Bearer invalid-token
X-Forwarded-Host: {{xForwardedHost}}
HTTP 401

# list providers (should be empty initially)
GET {{domain}}/v1/providers
Authorization: Bearer {{apiKey}}
X-Forwarded-Host: {{xForwardedHost}}
HTTP 200
[Asserts]
jsonpath "$" isEmpty

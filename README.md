# LogtoTest

Testing React/Express and Next with Logto authentication provider

## IMPORTANT

THIS WILL NOT WORK AS IS.
There are too many hard coded URLs, secrets, etc in the code. This repo is just for reference and can be made to work with manual setup.

## Setup

The steps to get the Express/React working are as follows

1. Start the logto server
2. Log into the logto server and setup the admin account
3. In logto navigate to API resources and create a new resource. The resource "API Identifier" will be the url of the express server. For instance "http://localhost:3000".
4. In logto navifate to the Applications page and create a new application. Chose "React" as the application type. Give it a name and description. Enter the Redirect URI as the url of the express app plus /callback. For instance "http://localhost:3003/callback". Enter the Post Sign-out Redirct URIs as the url of the react app home page. For example "http://localhost:3003"
5. In logto navigate to the Users page and create a new user. This will be the user you will use to log into the react app and API.
6. In logto customize the Sign-in experience and password policy as desired.
7. In the express app index.js file update the following variables with their correct values.
   - origin: The url of the react app. For example "http://localhost:3003"
   - createRemoteJWKSetURL: the url of the logto server plus "/oidc/jwks". For example "http://localhost:3001/oidc/jwks". Obtaining the correct value can be found in the logto interactive documentation.
   - issuer: the url of the logto server plus /oidc. For example "http://localhost:3001/oidc". Obtaining the correct value can be found in the logto interactive documentation.
   - audience: the url of the express server. For example "http://localhost:3000". This should match the API Identifier created in step 3.
8. In the react app App.js file update the following variables with their correct values.
   - endpoint: the url of the logto server. For example "http://localhost:3001". Obtaining the correct value can be found in the logto application properties.
   - appId: the application id of the react app. For example "60b3b3b2c9b3a0001b1f9b9c". Obtaining the correct value can be found in the logto application properties.
   - resources: An array containing the url of the express server. For example ["http://localhost:3000"]. This should match the API Identifier created in step 3.
   - signIn(): This should contain the url of the react app with the correct port plus /callback. For example "http://localhost:3003/callback".
   - signOut(): This should contain the url of the react app with the correct port. For example "http://localhost:3003".
   - fetch(): This should contain the url of the protected route on the express server. For example "http://localhost:3000/api/products".
   - getAccessToken(): This should contain the url of the express server. For example "http://localhost:3000". This defines the audience of the access token requested from logto.

## Notes

This example does not utilize RBAC (role based access conotrol) but it could be added easily using the logto interactive documentation.
The logto interactive documenation from within the app is more accurate than the documentation on the website.
This example does not use robust error handling or authentication logic. It is just an example of how to get basic jwt authentication working with logto.

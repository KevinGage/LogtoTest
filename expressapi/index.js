import express from "express";

import { createRemoteJWKSet, jwtVerify } from "jose";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:3003",
};
const port = 3000;

const app = express();

app.use(cors(corsOptions));

const extractBearerTokenFromHeaders = ({ authorization }) => {
  if (!authorization) {
    throw new Error("Authorization header is missing");
  }

  if (!authorization.startsWith("Bearer")) {
    throw new Error("Authorization header is not in the Bearer scheme");
  }

  return authorization.slice(7); // The length of 'Bearer ' is 7
};

export const verifyAuthFromRequest = async (req, res, next) => {
  // Extract the token
  const token = extractBearerTokenFromHeaders(req.headers);

  try {
    const { payload } = await jwtVerify(
      token, // The raw Bearer Token extracted from the request header
      createRemoteJWKSet(new URL("http://localhost:3001/oidc/jwks")), // generate a jwks using jwks_uri inquired from Logto server
      {
        // expected issuer of the token, should be issued by the Logto server
        issuer: "http://localhost:3001/oidc",
        // expected audience token, should be the resource indicator of the current API
        audience: "http://localhost:3000",
      }
    );

    // Sub is the user ID, used for user identification
    const { scope, sub } = payload;

    console.log(`User ${sub} has scopes ${scope}`);
  } catch (err) {
    next(err);
  }

  return next();
};

app.get("/", (req, res) => {
  res.end(`Hello World!`);
});

// Assuming you have a '/api/products' endpoint on your express server
app.get("/api/products", verifyAuthFromRequest, (req, res) => {
  console.log("protected resource requested");
  res.end("product info");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

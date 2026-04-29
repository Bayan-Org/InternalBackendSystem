import jwt, { type JwtHeader, type SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const setClient = (xsuaaUrl: string | undefined) => {
  return jwksClient({
    jwksUri: `${xsuaaUrl}/token_keys`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10 * 60 * 1000, // 10 menit
  });
};

const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
  const xsuaaUrl = process.env.BASE_AUTH_URL as string | undefined;
  const client = setClient(xsuaaUrl) as jwksClient.JwksClient;
  if (!header.kid) {
    return callback(new Error("No KID found in token header"));
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);

    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
};

export const verifyJwt = (token: string): Promise<any> => {
  const xsuaaUrl = process.env.BASE_AUTH_URL;
  const clientId = process.env.CLIENT_ID;

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: clientId,
        issuer: `${xsuaaUrl}/oauth/token`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }

        resolve(decoded);
      },
    );
  });
};

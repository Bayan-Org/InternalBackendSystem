import crypto from "crypto";

export const base64URLEncode = (str: any) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const sha256 = (buffer: crypto.BinaryLike) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

export const cryptoRandomBytes = crypto.randomBytes(32);

export const getBasicAuthHeader = (clientId: string, clientSecret: string) => {
  const credentials = `${clientId}:${clientSecret}`;
  const base64 = Buffer.from(credentials).toString("base64");
  return `Basic ${base64}`;
};

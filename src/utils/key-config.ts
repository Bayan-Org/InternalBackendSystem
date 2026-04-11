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

import {
  base64URLEncode,
  cryptoRandomBytes,
  sha256,
} from "../utils/key-config.js";

export const code_verifier = base64URLEncode(cryptoRandomBytes);
export const code_challenge = base64URLEncode(sha256(code_verifier));

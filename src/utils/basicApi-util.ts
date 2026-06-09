import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:3128");

/**
 * function_desc.
 *
 * @param param params_desc.
 * @returns return_desc.
 */
export const basicApiInstance = () => {
  const instance = axios.create({
    baseURL: process.env.BASE_APP_URL as string,
    timeout: 60000,
    httpsAgent: proxyAgent,
  });

  return instance;
};

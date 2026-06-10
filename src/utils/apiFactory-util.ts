import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

// const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:3128");

export const createApiInstance = (token: string) => {
  const instance = axios.create({
    baseURL: process.env.BASE_APP_URL as string,
    timeout: 60000,
    // httpsAgent: proxyAgent,
  });

  instance.interceptors.request.use((config) => {
    config.headers.Authorization = `${token}`;
    return config;
  });

  return instance;
};

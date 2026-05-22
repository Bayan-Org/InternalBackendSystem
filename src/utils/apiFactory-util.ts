import axios from "axios";

export const createApiInstance = (token: string) => {
  const instance = axios.create({
    baseURL: process.env.BASE_APP_URL as string,
    timeout: 60000,
  });

  instance.interceptors.request.use((config) => {
    config.headers.Authorization = `${token}`;
    return config;
  });

  return instance;
};

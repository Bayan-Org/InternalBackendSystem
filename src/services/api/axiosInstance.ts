import axios from "axios";
export const api = axios.create({
  baseURL: process.env.BASE_APP_URL as string,
  timeout: 60000,
});

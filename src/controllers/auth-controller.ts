import type { Response, Request } from "express";
import axios, { type AxiosRequestConfig } from "axios";
import { code_challenge, code_verifier } from "../configs/init-config.js";
import { getBasicAuthHeader } from "../utils/key-config.js";

export const loginHandler = async (req: Request, res: Response) => {
  const BASE_AUTH_URL = process.env.BASE_AUTH_URL;
  const CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const authURLPath = `${BASE_AUTH_URL}/oauth/authorize`;
  const authURLParams = `response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&code_challenge=${code_challenge}&code_challenge_method=S256&state=xyz123&scope=openid`;
  const authURL = `${authURLPath}?${authURLParams}`;

  try {
    return res.status(200).redirect(authURL);
  } catch (error) {
    res.json({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
};

export const callbackHandler = async (req: Request, res: Response) => {
  console.log("Code", req.query.code);
  
  const BASE_AUTH_URL = process.env.BASE_AUTH_URL;
  const CLIENT_ID = process.env.CLIENT_ID as string;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const CLIENT_SECRET = process.env.CLIENT_SECRET as string;

  const code = req.query.code;

  const tokenURLPath = `${BASE_AUTH_URL}/oauth/token`;
  
  //   Set request config
  const urlSearchParamsConf = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: code_verifier,
  } as any;

  const headersConf = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  
  try {
    const tokenResponse = await axios.post(
      tokenURLPath,
      new URLSearchParams(urlSearchParamsConf),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": getBasicAuthHeader(CLIENT_ID, CLIENT_SECRET)
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    return res.status(201).json({
      message: "Token received",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting token",
      error: error,
    });
  }
};

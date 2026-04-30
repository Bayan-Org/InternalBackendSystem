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
  console.log("Callback:", req);

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
          Authorization: getBasicAuthHeader(CLIENT_ID, CLIENT_SECRET),
        },
      },
    );
    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    return res.status(201).json({
      message: "Token received",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting token",
      error: error,
    });
  }
};

export const exchangeHandler = async (req: Request, res: Response) => {
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

  try {
    const tokenResponse = await axios.post(
      tokenURLPath,
      new URLSearchParams(urlSearchParamsConf),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: getBasicAuthHeader(CLIENT_ID, CLIENT_SECRET),
        },
      },
    );
    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    return res.status(201).json({
      message: "Token received",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting token",
      error: error,
    });
  }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const refresh_token = req.body?.refresh_token;

    if (!refresh_token) {
      return res.status(401).json({
        statusCode: 401,
        message: "Refresh token is missing",
      });
    }

    const BASE_AUTH_URL = process.env.BASE_AUTH_URL;

    const url = `${BASE_AUTH_URL}/oauth/token`;
    const urlSearchParamsConf = {
      grant_type: "refresh_token",
      refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    } as any;

    const response = await axios.post(
      url,
      new URLSearchParams(urlSearchParamsConf),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;
    return res.status(201).json({
      statusCode: 201,
      message: "Success refreshing token",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
      data: {
        message: "Session expired. Please login again.",
        action: "RELOGIN",
      },
    });
  }
};

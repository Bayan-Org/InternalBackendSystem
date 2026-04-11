import axios from "axios";
import type { Response, Request } from "express";

export const getProfileHandler = async (req: Request, res: Response) => {
  const accessToken = process.env.ACCESS_TOKEN;
  const BASE_APP_URL = process.env.BASE_APP_URL;

  const requestURL = `${BASE_APP_URL}/odata/v4/current-user/ZC_GET_CURRENT_USER`;
  try {
    const response = await axios.get(requestURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.status(201).json({
      message: "Success",
      statusCode: 201,
      response: response.data,
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      message: "Internal Server Error get profile",
      data: error,
    });
  }
};

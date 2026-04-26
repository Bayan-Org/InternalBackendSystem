import axios from "axios";
import type { Response, Request } from "express";

export const getMatchingProfile = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization || process.env.ACCESS_TOKEN;
  const BASE_APP_URL = process.env.BASE_APP_URL;

  const requestURL = `${BASE_APP_URL}/odata/v4/current-user/ZC_GET_CURRENT_USER`;
  try {
    const response = await axios.get(requestURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(`${new Date()} ----------- `, response.data.value[0].UserEmail);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.json({
      statusCode: 500,
      message: "Internal Server Error get profile",
      data: error,
    });
  }
};

export const getProfileHandler = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization || process.env.ACCESS_TOKEN;
  const BASE_APP_URL = process.env.BASE_APP_URL;

  const requestURL = `${BASE_APP_URL}/odata/v4/current-user/ZC_GET_CURRENT_USER`;
  try {
    const response = await axios.get(requestURL, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    res.setHeader("Content-Type", "application/json");

    console.log(
      `Profile Handler ${new Date()} ----------- `,
      response.data.value[0],
    );
    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      profile: {
        ...response.data.value[0],
        UserName: response.data.value[0].Bname,
      },
    });
  } catch (error) {
    console.log(`Profile Handler error ${new Date()} ----------- `, error);
    return res.json({
      statusCode: 500,
      message: "Internal Server Error get profile",
      data: error,
    });
  }
};

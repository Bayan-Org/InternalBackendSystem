import axios from "axios";
import type { Response, Request } from "express";
import {
  generateRandomGreatings,
  getInitiliazieDataReuse,
} from "../utils/index-util.js";
import { createApiInstance } from "../utils/apiFactory-util.js";

/**
 * function_desc.
 *
 * @param param params_desc.
 * @returns return_desc.
 */
export const initializationHandler = async (req: Request, res: Response) => {
  // --> Generate random greatings
  const greatingMessage = generateRandomGreatings();
};
export const getMatchingProfile = async (req: Request, res: Response) => {
  const accessToken =
    req.headers.authorization || (process.env.ACCESS_TOKEN as string);
  const BASE_APP_URL = process.env.BASE_APP_URL;

  const requestURL = `${BASE_APP_URL}/odata/v4/current-user/ZC_GET_CURRENT_USER`;
  try {
    const response = await createApiInstance(accessToken).get(requestURL);

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
  const accessToken =
    req.headers.authorization || (process.env.ACCESS_TOKEN as string);
  const BASE_APP_URL = process.env.BASE_APP_URL;

  const requestURL = `${BASE_APP_URL}/odata/v4/current-user/ZC_GET_CURRENT_USER`;
  try {
    const [response, totalData] = await Promise.all([
      createApiInstance(accessToken).get(requestURL, {
        headers: {
          Authorization: `${accessToken}`,
        },
      }),
      getInitiliazieDataReuse(accessToken),
    ]);

    // const response = await
    res.setHeader("Content-Type", "application/json");

    console.log(`Profile Handler ${new Date()} ----------- `);
    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      profile: {
        ...response.data.value[0],
        UserName: response.data.value[0].Bname,
      },
      greatings: generateRandomGreatings(),
      ...totalData,
    });
  } catch (error) {
    console.log(`Profile Handler error ----------- `, error);
    return res.status(401).json({
      statusCode: 401,
      message: "Internal Server Error get profile",
      data: error,
    });
  }
};

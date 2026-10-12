import axios from "axios";
import type { Response, Request } from "express";
import {
  constructODataEndpoint,
  generateRandomGreatings,
  getCurrentUser,
  getInitiliazieDataReuse,
  removeODataMetadata,
} from "../utils/index-util.js";
import { createApiInstance } from "../utils/apiFactory-util.js";
import type { IODataCurrentUserResult } from "../interface/odata-response.js";

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
  const accessToken = req.headers.authorization || process.env.ACCESS_TOKEN;

  try {
    const profile = await getCurrentUser(accessToken as string);

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Get Matching Profile Error:", error);

    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error get profile",
      data: error,
    });
  }
};

export const getProfileHandler = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization || process.env.ACCESS_TOKEN;

  try {
    const [profile, totalData] = await Promise.all([
      getCurrentUser(accessToken as string),
      getInitiliazieDataReuse(accessToken as string),
    ]);

    console.log(`Profile Handler ${new Date()} -----------`);

    return res.status(200).json({
      message: "Success",
      statusCode: 200,
      profile: {
        ...profile,
        UserName: profile.Bname,
      },
      greatings: generateRandomGreatings(),
      ...totalData,
    });
  } catch (error) {
    console.error("Profile Handler Error:", error);

    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error get profile",
      data: error,
    });
  }
};

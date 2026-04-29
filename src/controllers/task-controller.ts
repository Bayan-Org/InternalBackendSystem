import type { Response, Request } from "express";
import { createApiInstance } from "../utils/apiFactory-util.js";
import { generateQuery } from "../utils/index-util.js";

export const getTaskHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const selectedField = ["InstanceID", "TaskTitle", "CreatedByName"];
    const selectQuery = `$select=${generateQuery(selectedField)}`;
    const path = `/odata/v4/taskprocessing/TaskCollection?${selectQuery}`;
    const response = await api.get(path);

    return res.status(201).json({
      statusCode: 201,
      message: "Success",
      data: response.data,
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      message: "Internal Server Error get Task",
      data: error,
    });
  }
};

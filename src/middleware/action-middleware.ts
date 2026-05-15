import type { NextFunction, Request, Response } from "express";
import { createApiInstance } from "../utils/apiFactory-util.js";

export interface IPayloads {
  SAP__ORIGIN: string;
  InstanceID: string;
}

export const ApprovalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { Payloads } = req.body;

    // --> Validate approval transaction from body
    if (!Payloads || Payloads.items.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Items that will be process is missing",
      });
    }

    // --> Instance ID must be not initial
    const isInvalidSAPOrigin = Payloads.items.some(
      (i: IPayloads) =>
        i.SAP__ORIGIN === "" ||
        !i.SAP__ORIGIN ||
        i.InstanceID === "" ||
        !i.InstanceID,
    );
    if (isInvalidSAPOrigin) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    next();
  } catch (error: any) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message ?? "Some error occured",
      error,
    });
  }
};

export const TaskDetailMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { InstanceID, ReferenceDoc } = req.query;
    if (!InstanceID) {
      return res.status(404).json({
        statusCode: 404,
        message: `Instance ID is missing`,
      });
    }
    if (!ReferenceDoc) {
      return res.status(404).json({
        statusCode: 404,
        message: `Reference document is missing`,
      });
    }

    // --> Config api
    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/SingleTaskReference?$filter=InstanceID eq '${InstanceID}'`;
    const responses = await api.get(path);
    const response = responses.data.value[0];
    const TaskIndicator = response.TaskIndicator;
    res.locals.TaskIndicator = TaskIndicator;

    next();
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(400).json({
      statusCode: 400,
      message: "Internal Server Error get Task",
      data: error,
    });
  }
};

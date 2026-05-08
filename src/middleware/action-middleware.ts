import type { NextFunction, Request, Response } from "express";
import { createApiInstance } from "../utils/apiFactory-util.js";

export const ApprovalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // --> Validate approval transaction from body
    const taskIndicatorToProcess = req.body.TaskIndicator;
    if (!taskIndicatorToProcess) {
      return res.status(400).json({
        statusCode: 400,
        message: "Approval Transaction is missing",
      });
    }

    // --> Instance ID must be not initial
    const InstanceID = req.body.InstanceID;
    if (!InstanceID) {
      return res.status(400).json({
        statusCode: 400,
        message: "Instance ID is missing",
      });
    }

    // --> Validate approval transaction
    const taksIndicatorWhiteList = ["PurchaseRequisition", "PurchaseOrder"];
    const isValidTaskIndicator = taksIndicatorWhiteList.some(
      (e) => e == taskIndicatorToProcess,
    );
    if (!isValidTaskIndicator) {
      return res.status(400).json({
        statusCode: 400,
        message: "Unknown Approval Transaction",
      });
    }

    // --> Validate actual task indicator
    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/SingleTaskReference?$filter=InstanceID eq '${req.body.InstanceID}'`;
    const responses = await api.get(path);
    const response = responses.data.value[0];
    const reqPath = req.url;
    const splittedUrl = reqPath.substring(1, reqPath.length);
    if (
      splittedUrl === "rework" &&
      response.TaskIndicator !== "PurchaseRequisition"
    ) {
      return res.status(400).json({
        statusCode: 400,
        message: "Rework only available for Purchase Requisition task",
      });
    }

    // --> Validate current status of task from standard collection
    const instanceId = req.body.InstanceID;
    const filter = `(InstanceID eq '${instanceId}' and (Status eq 'READY' or Status eq 'RESERVED' or Status eq 'IN_PROGRESS' or Status eq 'EXECUTED'))`;
    const pathCollection = `/odata/v4/taskprocessing/TaskCollection?$filter=${encodeURIComponent(filter)}`;
    const respCollection = await api.get(pathCollection);
    if (respCollection.data.value.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: `Instance ID ${req.body.InstanceID} not found or already proceed`,
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Some error occured",
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

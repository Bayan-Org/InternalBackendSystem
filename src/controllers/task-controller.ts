import type { Response, Request } from "express";
import { createApiInstance } from "../utils/apiFactory-util.js";

export const getTaskDataHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/TaskData`;
    const response = await api.get(path);
    return res.status(200).json({
      statusCode: 200,
      message: "Success",
      data: response.data,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Internal Server Error get Task",
      data: error,
    });
  }
};

export const getTaskCollectionHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/TaskCollection`;
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

export const getTaskReferenceHandler = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization as string;
    const { InstanceID, ReferenceDoc } = req.query;
    const TaskIndicator = res.locals.TaskIndicator;
    const expandedEntity =
      TaskIndicator === "PurchaseRequisition"
        ? "to_PurchaseReqItem"
        : "to_PurchaseOrdItem";
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/TaskReference?$filter=ReferenceDoc eq '${ReferenceDoc}' and InstanceID eq '${InstanceID}'&$expand=${expandedEntity}`;
    const response = await api.get(path);

    let resp = response.data;
    resp.value[0][expandedEntity].sort(
      (a: any, b: any) => parseFloat(a.LineItem) - parseFloat(b.LineItem),
    );
    return res.status(201).json({
      statusCode: 201,
      message: "Success",
      data: resp,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error get Task",
      data: error,
    });
  }
};

export const actionHandler = async (req: Request, res: Response) => {
  const { Notes, InstanceID, SAP__Origin } = req.body;

  const reqPath = req.url;
  const splittedUrl = reqPath.substring(1, reqPath.length);

  try {
    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/Decision`;

    let decisionKey = "" as string | undefined;
    switch (splittedUrl) {
      case "rework":
        decisionKey = process.env.REWORK_DECISSION_KEY;
        break;
      case "reject":
        decisionKey = process.env.REJECT_DECISSION_KEY;
        break;
      default:
        decisionKey = process.env.APPROVE_DECISSION_KEY;
        break;
    }
    const response = await api.post(path, {
      InstanceID: InstanceID,
      DecisionKey: decisionKey,
      Comments: Notes,
      SAP__Origin: SAP__Origin,
    });
    return res.status(201).json({
      statusCode: 201,
      message: "Success",
      data: response.data,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message:
        "Unable to process the approval due to a document lock or unexpected issue. Please try again later.",
      data: error,
    });
  }
};

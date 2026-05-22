import type { Response, Request } from "express";
import { createApiInstance } from "../utils/apiFactory-util.js";
import type { IPayloads } from "../middleware/action-middleware.js";
import {
  encodedNotes,
  isEmptyAmount,
  isEmptyDate,
  parseAmount,
  unformatDate,
  unformatDateToOData,
} from "../utils/index-util.js";

export const getTaskDataHandler = async (req: Request, res: Response) => {
  try {
    const { Service, isFiltering, sortField, sortDirection } = req.query as any;

    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const page = Math.max(parseInt((req.query.page as any) ?? "1", 10), 1);
    const limit = Math.min(
      parseInt((req.query.limit as any) ?? "1", 10),
      100,
    ).toString();
    const skip = ((page - 1) * parseFloat(limit)) as any;

    const isSearching = req.query.search === "true" ? true : false;
    const params = new URLSearchParams({
      TaskIndicator: Service as string,
      skip: skip as string,
      limit: limit as string,
      sortField: sortField as string,
      sortDirection: sortDirection as string,
      isFiltering: isFiltering as string,
    });

    if (isSearching) {
      const query = req.query.query as string;
      params.append("search", isSearching as any);
      params.append("query", query as any);
    }

    if (isFiltering.toLowerCase() === "true") {
      const { amountFrom, amountTo, dateFrom, dateTo, currency } =
        req.query as any;
      const parsedAmountFrom = parseAmount(amountFrom).toString();
      const parsedDateFrom = unformatDateToOData(dateFrom) as string;

      const isEmptyAmountTo = isEmptyAmount(amountTo);
      const isEmptyAmountFrom = isEmptyAmount(amountFrom);

      const isEmptyDateFrom = isEmptyDate(dateFrom);
      const isEmptyDateTo = isEmptyDate(dateTo);

      const isFilteringByAmount = !isEmptyAmountTo || !isEmptyAmountFrom;
      const isFilteringByDate = !isEmptyDateFrom || !isEmptyDateTo;

      if (isFilteringByAmount) {
        params.append("filteringByAmount", "true" as any);
        params.append("amountFrom", parsedAmountFrom);

        if (!isEmptyAmountTo) {
          const parsedAmountTo = parseAmount(amountTo).toString();
          params.append("amountTo", parsedAmountTo);
        }
      }

      if (isFilteringByDate) {
        params.append("filteringByDate", "true" as any);
        params.append("dateFrom", parsedDateFrom);

        if (!isEmptyDateTo) {
          const parsedDateTo = unformatDateToOData(dateTo) as string;
          params.append("dateTo", parsedDateTo);
        }
      }

      if (currency !== "*") {
        params.append("currency", currency);
      }
    }

    console.log(params);

    const path = `/odata/v4/taskprocessing/TaskData?${params}`;
    const response = await api.get(path);
    return res.status(200).json({
      statusCode: 200,
      message: "Success",
      data: {
        value: response.data.value[0].value,
        meta: response.data.value[0].meta,
      },
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(400).json({
      statusCode: 400,
      message: "Error get Task",
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
    const { ReferenceDoc, isSearching, search } = req.query;
    const TaskIndicator = res.locals.TaskIndicator;
    const entity =
      TaskIndicator === "PurchaseRequisition"
        ? "PurchaseReqItems"
        : "PurchaseOrdItems";
    const service =
      TaskIndicator === "PurchaseOrder"
        ? "to_PurchaseOrdItem"
        : "to_PurchaseReqItem";
    const api = createApiInstance(accessToken!);
    const page = Math.max(parseInt((req.query.page as any) ?? "1", 10), 1);
    const limit = Math.min(
      parseInt((req.query.pageSize as any) ?? "1", 10),
      100,
    ).toString();
    const skip = ((page - 1) * parseFloat(limit)) as any;

    // --> Handle sorting
    const { sortField, sortDirection } = req.query;
    const sortingQuery = `$orderby=${sortField} ${sortDirection}`;

    // ===========================================
    // --> Begin Handle filter

    // --> Basic Filter
    const filterQueryList = [];
    const filterQueryBasic = `(ReferenceDoc eq '${ReferenceDoc}')`;
    filterQueryList.push(filterQueryBasic);

    // --> Searching
    if (isSearching === "true" && search) {
      const listField = [
        "LineItem",
        "StorageLocation",
        "StorageLocationDesc",
        "Material",
        "MaterialDesc",
      ]; // list of fields to search
      const filterQueryString = listField
        .map((i) => `contains(${i},'${search}') eq true`)
        .join(" or ");
      filterQueryList.push(`(${filterQueryString})`);
    }

    const filterQuery = `$filter=${filterQueryList.join(" and ")}`;

    // --> Limit
    const limitQuery = `$top=${limit}`;

    // --> Skip
    const skipQuery = `$skip=${skip}`;

    // --> Build query
    let params = `${filterQuery}&${sortingQuery}&${limitQuery}&${skipQuery}`;

    const path = `/odata/v4/taskprocessing/${entity}?${params}`;
    const response = await api.get(path);

    // --> get total
    const totalData = await api.get(
      `/odata/v4/taskprocessing/${entity}/$count?${filterQuery}&${sortingQuery}`,
    );

    let resp = response.data;
    return res.status(201).json({
      statusCode: 201,
      message: "Success",
      data: {
        value: [
          {
            [service]: [...resp.value],
          },
        ],
        meta: {
          skip: skip,
          limit: limit,
          total: totalData.data,
          hasMore: skip + [...resp.value].length < totalData.data,
        },
      },
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
  const { Payloads } = req.body;

  const reqPath = req.url;
  const splittedUrl = reqPath.substring(1, reqPath.length);

  try {
    const accessToken = req.headers.authorization as string;
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/BulkDecision`;

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

    const buildedPayload = Payloads.items.map((i: IPayloads) => ({
      InstanceID: i.InstanceID,
      DecisionKey: decisionKey,
      Comments: encodedNotes(Payloads.Notes),
      SAP__Origin: i.SAP__ORIGIN,
    }));

    const response = await api.post(path, {
      items: buildedPayload,
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Success",
      data: response.data,
    });
  } catch (error: any) {
    return res.status(400).json({
      statusCode: 400,
      message:
        "Unable to process the approval due to a document lock or unexpected issue. Please try again later.",
      data: error?.response?.data || error.message,
    });
  }
};

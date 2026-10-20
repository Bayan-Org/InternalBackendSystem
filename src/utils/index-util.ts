import type { AxiosInstance } from "axios";
import { greetings } from "../constants/greatings.js";
import { createApiInstance } from "./apiFactory-util.js";
import type {
  IApprovedData,
  IApproverData,
  IPurchaseReqHeader,
  IPurchaseReqHeaderResponse,
  ITaskReferencePath,
  ITaskReferenceResponsePath,
} from "../interface/index.js";

export const generateQuery = (arrayString: string[]) => {
  return arrayString.join(",");
};

export const encodedNotes = (note: string) => {
  return encodeURIComponent(note);
};

export const parseAmount = (value: string) => {
  return Number(value.replace(/,/g, ""));
};

export const unformatDate = (formattedDate: string): Date | null => {
  if (!formattedDate) return null;

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sept: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  } as any;

  const splitted = formattedDate.split(" ");

  if (splitted.length !== 3) {
    return null;
  }

  const [day, month, year] = splitted as any;

  const parsedDate = new Date(Number(year), months[month], Number(day));

  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const isEmptyAmount = (value?: string) => {
  return !value || value === "0" || value === "0.00";
};

export const isEmptyDate = (value?: string) => {
  return !value || value === "-";
};

export const isEmptyRefDoc = (value: string) => {
  return !value || value === "0";
};

export const unformatDateToOData = (
  formattedDate: string,
  endOfDay = false,
): string | null => {
  if (!formattedDate) return null;

  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sept: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  } as any;

  const splitted = formattedDate.split(" ");

  if (splitted.length !== 3) {
    return null;
  }

  const [day, month, year] = splitted as any;

  const parsedDate = new Date(Number(year), months[month], Number(day));

  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  const yyyy = parsedDate.getFullYear();
  const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const dd = String(parsedDate.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

export const getAssociationPath = (TaskIndicator: string) => {
  switch (TaskIndicator) {
    case "PurchaseRequisition":
      return "to_PurchaseReqHeader";
    default:
      return "to_PurchaseOrdHeader";
  }
};

/**
 * function_desc.
 *
 * @param param params_desc.
 * @returns return_desc.
 */
export const generateRandomGreatings = () => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

export const getInitiliazieDataReuse = async (accessToken: string) => {
  try {
    const api = createApiInstance(accessToken!);
    const path = `/odata/v4/taskprocessing/InitializeData`;
    const response = await api.get(path);
    const { totalData, totalPR, totalPO } = response.data.value[0];
    return {
      totalData: {
        totalData,
        totalPO,
        totalPR,
      },
    };
  } catch (error: any) {
    throw error.message || "Error initializing your data";
  }
};

export const mappingApproverData = (
  value: ITaskReferencePath,
): ITaskReferenceResponsePath => {
  const mapApprover = (
    header: IPurchaseReqHeader,
  ): IPurchaseReqHeaderResponse => {
    const { to_ApprovalStrategy, to_ApprovedHistory, ...headerData } = header;

    const strategy = to_ApprovalStrategy?.[0];
    const approvedHistory = to_ApprovedHistory ?? [];

    if (!strategy) {
      return {
        ...headerData,
        ApproverData: [],
      };
    }

    const levels = [
      { lvl: 1, code: strategy.Lvl1, data: strategy.to_ApprvrLvl1 },
      { lvl: 2, code: strategy.Lvl2, data: strategy.to_ApprvrLvl2 },
      { lvl: 3, code: strategy.Lvl3, data: strategy.to_ApprvrLvl3 },
      { lvl: 4, code: strategy.Lvl4, data: strategy.to_ApprvrLvl4 },
      { lvl: 5, code: strategy.Lvl5, data: strategy.to_ApprvrLvl5 },
    ];

    const ApproverData: IApproverData[] = levels
      .filter(({ code, data }) => Boolean(code && data?.length))
      .map(({ lvl, code, data }) => {
        const approved = approvedHistory.find(
          (history) => Number(history.ApprovedLevel) === lvl,
        );

        return {
          Lvl: lvl,
          ApprvrCode: code,
          ApprvDsc: data[0]?.ApprvrCodeDsc ?? "",
          IsApproved: Boolean(approved),
          ApprovedData: approved
            ? {
                ApprovedLevel: Number(approved.ApprovedLevel),
                ApprovedName: approved.ApprovedName,
                ApprovedTime: convertSapTimestampToDate(approved.ApprovedTime),
              }
            : null,
          Names: data.map((approver) => ({
            Name: approver.Fullname,
          })),
          IsCurrentApprover: lvl === header.ApproverLevel,
        };
      });

    return {
      ...headerData,
      ApproverData,
    };
  };

  return value.map((item) => ({
    ...item,
    PurchaseOrdHeader: mapApprover(item.PurchaseOrdHeader),
    PurchaseReqHeader: mapApprover(item.PurchaseReqHeader),
  }));
};

const convertSapTimestampToDate = (value?: string | null): string => {
  if (!value) return "";

  const match = value.match(/\/Date\((-?\d+)(?:[+-]\d{4})?\)\//);
  if (!match) return "";

  const date = new Date(Number(match[1]));
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

import type { AxiosInstance } from "axios";
import { greetings } from "../constants/greatings.js";
import { createApiInstance } from "./apiFactory-util.js";
import type {
  IODataEnpointConf,
  ODataResultsField,
} from "../interface/index.js";
import type {
  IODataCurrentUserEntity,
  IODataCurrentUserResult,
} from "../interface/odata-response.js";

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

export const constructODataEndpoint = ({
  service,
  entity,
  params,
}: IODataEnpointConf): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();

  return `/sap/opu/odata/sap/${entity}/${service}${
    queryString ? `?${queryString}` : ""
  }`;
};

export const removeODataMetadata = <T extends ODataResultsField>(
  entity: T,
): Omit<T, "__metadata"> => {
  const { __metadata, ...result } = entity;

  return result;
};

export const getCurrentUser = async (
  accessToken: string,
): Promise<IODataCurrentUserEntity> => {
  const path = constructODataEndpoint({
    entity: "zc_get_current_user_cds",
    service: "ZC_GET_CURRENT_USER",
    params: {
      $format: "json",
    },
  });

  const response = (await createApiInstance(accessToken).get("/", {
    params: {
      path,
    },
  })) as IODataCurrentUserResult;

  const currentUser = response.data.d.results[0];

  if (!currentUser) {
    throw new Error("Current user not found");
  }

  const cleanUserData = removeODataMetadata(
    currentUser,
  ) as IODataCurrentUserEntity;
  return cleanUserData;
};

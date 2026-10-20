export type SortDirection = "asc" | "desc";
export interface PendingApprovalDetailParams {
  InstanceID: string;
  ReferenceDoc: string;
  search?: string;
  isSearching: boolean;
  sortDirection?: SortDirection;
  sortField?: string;
  targetPage: number;
  pageSize: number;
  isFiltering: boolean;

  amountFrom?: string;
  amountTo?: string;
  currency?: string;

  unitPriceFrom?: string;
  unitPriceTo?: string;

  quantityFrom?: string;
  quantityTo?: string;

  unit?: string;

  TaskIndicator: string | undefined;
}

export interface IApprovalLevel {
  ApprvrCode: string;
  NumberID: string | number;
  ApprvrLvl: number;
  ApprvrCodeDsc: string;
  Bname: string;
  Fullname: string;
}

export interface IApprovalStrategy {
  Bstyp: string;
  Bsart: string;
  Partner: string;
  NameLast: string;
  NameFirst: string;
  Lvl1: string;
  Lvl2: string;
  Lvl3: string;
  Lvl4: string;
  Lvl5: string;
  to_ApprvrLvl1: IApprovalLevel[];
  to_ApprvrLvl2: IApprovalLevel[];
  to_ApprvrLvl3: IApprovalLevel[];
  to_ApprvrLvl4: IApprovalLevel[];
  to_ApprvrLvl5: IApprovalLevel[];
}

export type IApprovalStrategyPath = IApprovalStrategy[];

export interface IApproverName {
  Name: string;
}

export interface IApproverData {
  Lvl: number;
  ApprvrCode: string;
  ApprvDsc: string;
  Names: IApproverName[];
  IsCurrentApprover: boolean;
}

export interface IPurchaseReqHeader {
  ReferenceDoc: string;
  Plant: string;
  PlantDesc: string;
  Requisitioner: string;
  RequisitionerDesc: string;
  RequestedDate: string | null;
  Description: string;
  TotalAmmount: string;
  TotalAmountCurrency: string;
  ApproverLevel: number;
  ApproverData: IApproverData[];
  to_ApprovalStrategy: IApprovalStrategyPath;
  to_ApprovedHistory?: IApprovedHistory[];
}

export interface IPurchaseOrdHeader extends IPurchaseReqHeader {}

export interface ITaskReference {
  InstanceID: string;
  TaskDefinitionID: string;
  TaskTitle: string;
  CreatedByName: string;
  SAP__Origin: string;
  ReferenceDoc: string;
  TaskIndicator: string;
  PurchaseOrdHeader: IPurchaseOrdHeader;
  PurchaseReqHeader: IPurchaseReqHeader;
}

export type ITaskReferencePath = ITaskReference[];

export type IPurchaseReqHeaderResponse = Omit<
  IPurchaseReqHeader,
  "to_ApprovalStrategy"
>;

export type IPurchaseOrdHeaderResponse = Omit<
  IPurchaseOrdHeader,
  "to_ApprovalStrategy"
>;

export interface ITaskReferenceResponse extends Omit<
  ITaskReference,
  "PurchaseOrdHeader" | "PurchaseReqHeader"
> {
  PurchaseOrdHeader: IPurchaseOrdHeaderResponse;
  PurchaseReqHeader: IPurchaseReqHeaderResponse;
}

export type ITaskReferenceResponsePath = ITaskReferenceResponse[];

export interface IApprovedData {
  ApprovedLevel: number;
  ApprovedName: string;
  ApprovedTime: string;
}

export interface IApproverData {
  Lvl: number;
  ApprvrCode: string;
  ApprvDsc: string;
  IsApproved: boolean;
  ApprovedData: IApprovedData | null;
  Names: {
    Name: string;
  }[];
  IsCurrentApprover: boolean;
}

export interface IApprovedHistory {
  ReferenceDoc: string;
  ApprovedLevel: string;
  ApprovedName: string;
  ApprovedTime: string;
}

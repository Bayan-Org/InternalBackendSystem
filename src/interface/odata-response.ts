import type { IODataDefaultResp, ODataResultsField } from "./index.js";

export type IODataCurrentUserEntity = ODataResultsField & {
  AddressNumber: string;
  Username: string;
  PersonalNumber: string;
  UserEmail: string;
  UserAlias: string;
  Bname: string;
  Persnumber: string;
  Addrnumber: string;
  Kostl: string;
  StartMenu: string;
  Idadtype: string;
  Bpperson: string;
  Organization: string;
  Responsible: string;
  Techdesc: string;
  IdentityGuid: string;
  TemplateOrgtype: string;
  TemplateOrgaddr: string;
};

export type IODataCurrentUserResult =
  IODataDefaultResp<IODataCurrentUserEntity>;

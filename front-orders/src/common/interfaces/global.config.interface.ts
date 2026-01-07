export interface IGlobalDocumentsResponse {
  data: IGlobalDocuments;
}

export interface IGlobalDocuments {
  admin_contract: string;
  privacy_policy: string;
  terms_conditions: string;
}

export interface IConfigurationListResponse {
  data: IConfigurationList[];
}

export interface IConfigurationList {
  id: number;
  title: string;
  description: string;
  status: number;
}

export enum ConfigurationListEnum {
  DISCLAIMER = 'disclaimer',
  EMAIL = 'email',
  PHONE = 'phone',
}

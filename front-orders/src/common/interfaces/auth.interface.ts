import { IError } from '@/common/interfaces/error.interface';
import { ICollaborator, IUserLogin } from '@/common/interfaces/user.interface';

export interface IConfirmationResponse {
  data: boolean;
  error: IError;
}

export interface ILoginResponse {
  user: IUserLogin;
  token: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  data: IUserLogin;
  error: object | IError;
}

export interface IRegister {
  username: string;
  phone_number: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  accept_security_police: boolean;
  accept_terms_conditions: boolean;
}

export interface IVerify {
  email: string;
  code: string;
}

export interface IUpdatePasswordRegistration {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  securityHash: string;
  phone_number: string;
  phone_country: string;
  accept_terms_conditions: boolean;
  accept_data_treatment: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  channel_register?: string;
  transac_id?: string;
}

export interface IPreCustomerRegistration {
  id: string;
  name: string;
  lastname: string;
  email: string;
  username: string;
  email_verified: boolean;
  phone_number: string;
  document_type: string;
  number_document: string;
  status: number;
  customer_user_type: string;
  securityHash: string;
}

export interface IGenerateEmail {
  email: string;
  resend?: boolean;
}

export interface ICreatePassword {
  email: string;
  hash_security: string;
  password: string;
  passwordConfirmation: string;
}

export interface IRecoverGenerate {
  email: string;
  resend?: boolean;
}

export interface IRecoverValidateCode {
  code: string;
  email: string;
}

export interface IResetPassword {
  code: string;
  new_password: string;
  confirmation_password: string;
}

export interface IUserBlocked {
  id: number;
  email: string;
  time_max_blocked: string;
}

export interface IUserBlockedResponse {
  data: IUserBlocked;
  error: IError;
}

export interface IRegisterEmail {
  numIdentidad: string;
  tipoIdentidad: string;
  email: string;
}

export interface ISearchCollaborator {
  numIdentidad: string;
  tipoIdentidad: string;
}

export interface ISearchCollaboratorResponse {
  data: ICollaborator;
}

export interface ISendEmailValidationResponse {
  data: boolean;
}

export interface ITOCSessionManagerResponse {
  data: string;
}

export interface ITOCVerifyAccount {
  codFund: string;
  selfie: string;
  resend: boolean;
}

export interface FacephiCivilValidation {
  resend: boolean;
  sendCreatePassword: boolean;
  operation: string;
  platform: string;

  documentNumber: string;

  countryCode: string;
  bestImageTemplateRaw: string;
  imageFrontDocument: string;
  imageBackDocument: string;
  tokenOcr: string;
  bestImage: string;

  templateRaw: string;
  codFund: string;
  returnPII: boolean;

  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  channel_register?: string;
  transac_id?: string;
}

export interface FacephiNoAuthCivilValidation {
  origin: string;
  resend: boolean;
  sendCreatePassword: boolean;
  operation: string;
  platform: string;

  documentNumber: string;
  dni: string;

  countryCode: string;
  bestImageTemplateRaw: string;
  imageFrontDocument: string;
  imageBackDocument: string;
  tokenOcr: string;
  bestImage: string;

  templateRaw: string;
  codFund: string;
  returnPII: boolean;
}

export interface FacephiFaceVsReniec {
  origin: string;
  resend: boolean;
  sendCreatePassword: boolean;
  operation: string;
  platform: string;

  documentNumber: string;
  dni: string;

  countryCode: string;
  bestImageTemplateRaw: string;
  imageFrontDocument: string;
  imageBackDocument: string;
  tokenOcr: string;
  bestImage: string;

  templateRaw: string;
  codFund: string;
  returnPII: boolean;
}

export interface TOCFaceVsDocument {
  codFund: string;
  selfie: string;
  id_back: string;
  id_front: string;
  resend: boolean;
}

export interface ITOCRegisterValidation {
  dni: string;
  selfie: string;
  resend: boolean;
}

export interface ITOCFaceDocument {
  document: string;
  selfie: string;
  id_front: string;
  id_back: string;
}

export interface ITOCVerifyAccountResponse {
  data: ITOCResponse;
}

export interface ITOCResponse {
  toc_token: string;
  biometric_result: string;
  status: string;
}
export interface IUpdateEmailCustomer {
  id: string;
  email: string;
  code_unique_spectrum: string;
  number_document: string;
  type_document: string;
}

export type IUpdateEmailCustomerResponse = IConfirmationResponse;
export type ICreatePasswordResponse = IConfirmationResponse;
export type IVerifyResponse = IConfirmationResponse;
export type IRecoverGenerateResponse = IConfirmationResponse;
export type IResetPasswordResponse = IConfirmationResponse;

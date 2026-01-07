export interface ITypeParticipateResponse {
  data: ITypeParticipate;
  error: IErrorType;
}

export interface IPersonalInformationResponse {
  data: IProfileCustomer;
  error: IErrorType;
}

export interface IActivityCustomerResponse {
  data: IActivityCustomer;
  error: IErrorType;
}
export interface IHomeCustomerResponse {
  data: IHomeCustomer;
  error: IErrorType;
}

interface IGenericList<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type IGenderResponse = IGenericList<IGender>;
export type ICivilStatusResponse = IGenericList<ICivilStatus>;
export type IDocumentTypeResponse = IGenericList<IDocumentType>;
export type ICountryResponse = IGenericList<ICountry>;
export type INationalitiesResponse = IGenericList<INationalities>;
export type IInstructionGradeResponse = IGenericList<IInstructionGrade>;
export type ITypeWorkerResponse = IGenericList<ITypeWorker>;
export type IEntryDateResponse = IGenericList<IEntryDate>;
export type IDepartmentResponse = IGenericList<IDepartment>;
export type IDistrictResponse = IGenericList<IDistrict>;
export type IProvinceResponse = IGenericList<IProvince>;
export type IRegimeTypeResponse = IGenericList<IRegimeType>;
export type IBankResponse = IGenericList<ICollectorBank>;
export type ITypeAccountResponse = IGenericList<ITypeAccountCollector>;
export type IMoneyTypeResponse = IGenericList<IMoneyType>;

export interface IBusinessExecutiveResponse {
  data: IBusinessExecutiveData[];
  total: number;
  page: number;
  limit: number;
}

export interface IActivityCustomer {
  id?: number;
  customer_id?: string;
  type_worker_id: number;
  occupation: string;
  monthly_income: string;
  ruc: string;
  business_name: string;
  direction: string;
  entry_date_id: number;
}
export interface IHomeCustomer {
  id?: number;
  customer_id?: string;
  department_id: number;
  province_id: number;
  city?: string;
  district_id: number;
  district_text?: string;
  address: string;
  dpto: string;
  urb: string;
}

export interface IBusinessExecutiveData {
  id: number;
  name: string;
  lastname: string;
  fullname: string;
  email: string;
  is_principal: boolean;
  status: number;
}

export interface ITypeParticipate {
  id: number;
  customer_id: string;
  type_participate: string;
  certified_information_provided: boolean;
}

export interface IErrorType {
  message: string;
}

export interface IProfileCustomer {
  id?: number;
  name: string;
  lastname: string;
  surname?: string;
  middlename?: string;
  customer_id?: string;
  gender_id: number;
  civil_status_id: number;
  place_birth: number;
  birthdate: string;
  instruction_grade_id: number;
  nationality_id: number;
  document_type_id?: number;
  number_document?: string;
}

export interface ITypeParticipateItemResponse {
  data: ITypeParticipateItemData[];
  total: number;
  page: number;
  limit: number;
}

export interface IDocumentType {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface ICountry {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IRegimeType {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface ICollectorBank {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IMoneyType {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface ITypeAccountCollector {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IProvince {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IDistrict {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IDepartment {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IEntryDate {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IInstructionGrade {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface INationalities {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface IGender {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface ITypeWorker {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}
export interface ICivilStatus {
  id: number;
  title: string;
  description: string;
  code: string;
  status: number;
}

export interface ITypeParticipateItemData {
  id: number;
  title: string;
  description: string;
  code: string;
  default: boolean;
  order: number;
  status: number;
}

export interface IIdentifyCustomerResponse {
  data: IIdentifyCustomerData;
  error: IErrorType;
}
export interface ISpouseCustomerResponse {
  data: ISpouseCustomerData;
  error: IErrorType;
}

export interface IIdentifyCustomerData {
  id?: number;
  customer_id?: string;
  document_type_id: number;
  number_document: string;
  business_executive_id: number;
}

export interface ISpouseCustomerData {
  id?: number;
  customer_id?: string;
  regime_type_id: number;
  fullname?: string;
  nationality_id: number;
  type_document_id: number;
  document_number: string;
}

export interface IFinalBeneficiary {
  id: string;
  customer_id: string;
  date_format: string;
  name_holder: string;
  is_final_beneficiary: boolean;
  name_beneficiary: string;
  lastname_beneficiary: string;
  country_id: number;
  date_birth: string;
  nationality_id: number;
  document_type: string;
  document_number: string;
  nit: string;
  ruc: string;
  civil_status_id: number;
  name_spouse: string;
  lastname_spouse: string;
  document_type_spouse: string;
  document_number_spouse: string;
  regime_type_id: number;
  date_property_regime: string;
  legal_relationship: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_district_id: number;
  contact_province_id: number;
  contact_country_id: number;
  contact_postal_code: string;
  legal_position: string;
  date_first_fund: string;
  created_at: string;
  updated_at: string;
}

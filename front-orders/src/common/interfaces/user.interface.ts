export interface IUserLogin {
  document_type: string;
  number_document: string;
  id: string;
  email: string;
  lastname: string;
  middlename: string;
  surname: string;
  phone_number: string;
  name: string;
  roles: IRole[];
  password: string;
  status: number;
  username: string;
  email_verified: boolean;
  serie: ISerie;
  has_passed_year: boolean;
  customer_user_type: string;
  risk_profile_id: number;
  exist_spectrum: boolean;
  isSpoused: boolean;
  accept_data_treatment: boolean;
  data_treatment_reject_count: number;
}

export interface IFormStep {
  id: number;
  description: string;
  status: boolean;
  order: number;
  parent_id: number;
  payload: string;
}

export interface IRole {
  description: string;
  id: number;
  name: string;
  status: number;
  rolePermissions: IRolePermission[];
}

export interface IRolePermission {
  id: number;
  machine: string;
  name: string;
  group_name: string;
  state: number;
  url: string;
  method: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ISerie {
  id: number;
  name: string;
  codigo: string;
  status: number;
}

export interface ICollaborator {
  customer_user_type: string;
  number_document: string;
  document_type: string;
  phone_number: string | null;
  lastname: string;
  name: string;
  email: string;
}

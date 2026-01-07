export interface IBankAccountResponse {
  data: IBankAccount[];
  total: number;
  limit: number;
  page: number;
}

export interface IBankAccount {
  id: number;
  customer_id: string;
  money_type: string;
  account_number: string;
  account_type_id: number;
  cci: string;
  is_main: boolean;
  status: number;
  bank: IBank;
  account_type: IAccountType;
}

export interface IBank {
  id: number;
  description: string;
}

export interface IAccountType {
  id: number;
  description: string;
}

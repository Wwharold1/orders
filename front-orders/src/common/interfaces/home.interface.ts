import { IFund } from '@/common/interfaces/fund.interface';
import { IErrorType } from '@/common/interfaces/natural.client.interface';

export interface IListFundsByCustomerResponse {
  data: IListFundsByCustomer;
  error: IErrorType;
}

export interface IListFundsByCustomer {
  funds_serie: IFundsSerie[];
  funds: IListItemFund[];
}

export enum SuscriptionStatusEnum {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  APPROVED = 'APPROVED',
  ANNULLED = 'ANNULLED',
}

export interface IFundsSerie {
  fund_id: number;
  serie_id: number;
  cod_fund: string;
  cod_fund_serie: string;
  fund_description: string;
  serie_description: string;
  current_balance: number;
  installments_number: number;
  date_value: string;
  money_type: string;
  disabled: boolean;
  subscription_id?: number;
  status: SuscriptionStatusEnum;
  fund_spectrum: IFund;
}

export interface IListItemFund {
  cod_fund: string;
  fund_description: string;
  current_balance: number;
  money_type: string;
  disabled: boolean;
}

import { IError } from '@/common/interfaces/error.interface';

export interface IRescueDetailResponse {
  data: IRescueDetailData;
  error: IError;
}

export interface IRescueDetailData {
  current_balance: number;
  money_type: string;
  installments_quantity: number;
  minimum_rescue_amount: number;
  amount_partial_max_rescue: number;
  amount_minimum_permanence: number;
  can_partial_rescue: boolean;
  quote_value: boolean;
  commission_percentage_total: number;
  commission_percentage_partial: number;
  fund: IRescueFund;
  bank_accounts: IRescueBankAccount[];
}

export interface IRescueFund {
  cod_fund: string;
  cod_fund_serie: string;
  serie: string;
  fund_title: string;
}

export interface IRescueBankAccount {
  account_number: string;
  bank_name: string;
  account_type: string;
  cci: string;
  id: number;
  is_main: boolean;
  money_type: string;
  status: number;
}

export enum RescueTypeEnum {
  TOTAL = 'TOTAL',
  PARTIAL = 'PARTIAL',
}

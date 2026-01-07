import {
  PaymentMethodEnum,
  PaymentStatusEnum,
} from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { MoneyTypeEnum } from '@/modules/home/enum/money.type.enum';

interface IGenericList<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type IFundOriginResponse = IGenericList<IFundOrigin>;
export type ICollectorAccountResponse = IGenericList<ICollectorAccount>;
export interface IAmountMinInversionResponse {
  data: IAmountMinInversion;
}

export interface IAmountMinInversion {
  amount_min_inversion: number;
  moneda: string;
}

export interface IFundOrigin {
  id: number;
  description: string;
  code: string;
  status: number;
}

export interface ISubscription {
  id: number;
  amount: number;
  amount_min_inversion?: number;
  funds_origin_id: number;
  moneda?: string;
}

export interface ICollectorAccount {
  id: number;
  title: string;
  bank_id: number;
  account_type_id: number;
  moneda: string;
  cca: string;
  cci: string;
  ruc: string;
  razon_social: string;
  fund_id: number;
  logo_bank: string;
  status: number;
  bank: IBank;
  type_account: ITypeAccount;
}

export interface IBank {
  id: number;
  description: string;
  code: string;
  status: number;
}

export interface ITypeAccount {
  id: number;
  description: string;
  code: string;
  status: number;
}

export interface ISuscriptionPending {
  id: number;
  amount: number;
  moneda?: MoneyTypeEnum;
  fund_origin?: string;
  funds_origin_id: number;
  terms_and_conditions: boolean;
  origin_conditions: boolean;
  expired?: boolean;
  payment_status?: PaymentStatusEnum;
  payment_method?: PaymentMethodEnum;
  payment_token?: string;
}

export interface IHasPendingSuscriptionResponse {
  data: IHasPendingSuscription;
}
export interface IHasPendingSuscription {
  has_pending_suscription: boolean;
  pending_suscription: ISuscriptionPending;
}

export interface IFundSerie {
  fund_id?: string;
  serie_id?: string;
}

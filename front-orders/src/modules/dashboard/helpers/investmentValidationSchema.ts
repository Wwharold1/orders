import { any, boolean, number, object, optional, string, TypeOf } from 'zod';

export const createSubscriptionValidationSchema = object({
  suscription_id: number().optional(),
  amount: number(),
  money_type: string(),
  image: string(),
  terms_and_conditions: boolean(),
  fund_id: number(),
  funds_origin_id: number(),
  origin_conditions: boolean(),
  payment_method: string(),
  bank_id: number().optional(),
  payment_token: string().optional(),
  id: number().optional(),
  scheduled_rescue: any().optional(),
});

export const createPaymentValidationSchema = object({
  suscription_id: number(),
  operation_number: string(),
  collector_account_prudential_id: number(),
  file: any(),
  utm_source: optional(string()),
  utm_medium: optional(string()),
  utm_campaign: optional(string()),
  channel_register: optional(string()),
  transac_id: optional(string()),
});

export type TCreateSubscriptionForm = TypeOf<
  typeof createSubscriptionValidationSchema
>;
export type TCreatePaymentForm = TypeOf<typeof createPaymentValidationSchema>;

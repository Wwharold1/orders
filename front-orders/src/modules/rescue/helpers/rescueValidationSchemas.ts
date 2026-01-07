import { number, object, string, TypeOf } from 'zod';

export const createRescueValidationSchema = object({
  cod_fund: string(),
  image: string(),
  cod_fund_serie: string(),
  bank_account_id: number(),
  amount: string({
    required_error: 'El monto es requerido',
  }),
  installments_quantity: number(),
  commission_amount: number(),
  rescue_type: string(),
});

export type TCreateRescueForm = TypeOf<typeof createRescueValidationSchema>;

import { boolean, number, object, string, TypeOf } from 'zod';

export const createAccountValidationSchema = object({
  account_type_id: number(),
  money_type: string(),
  bank_id: number(),
  account_number: string().min(
    10,
    'Número de cuenta debe tener mínimo 10 caracteres'
  ),
  cci: string().min(20, 'CCI debe tener 20 caracteres'),
  is_main: boolean(),
});

export type TCreateAccountForm = TypeOf<typeof createAccountValidationSchema>;
export type TUpdateAccountForm = TypeOf<typeof createAccountValidationSchema>;

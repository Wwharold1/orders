import { number, object, string, TypeOf } from 'zod';

export const createOrderValidationSchema = object({
  orderNumber: string(),
  customer: string(),
  orderDate: string(),
  total: number(),
});

export const deleteOrderValidationSchema = object({
  Id: number(),
});

export type TCreateOrderForm = TypeOf<typeof createOrderValidationSchema>;
export type TUpdateOrderForm = TypeOf<typeof createOrderValidationSchema>;
export type TDeleteOrderForm = TypeOf<typeof deleteOrderValidationSchema>;
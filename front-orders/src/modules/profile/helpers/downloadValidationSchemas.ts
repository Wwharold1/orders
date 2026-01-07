import { any, object, TypeOf } from 'zod';

export const downloadEECCValidationSchema = object({
  fondo: any(),
});

export type TDownloadEECCForm = TypeOf<typeof downloadEECCValidationSchema>;

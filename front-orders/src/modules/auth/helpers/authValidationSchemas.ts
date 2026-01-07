import {
  boolean,
  intersection,
  literal,
  object,
  optional,
  string,
  TypeOf,
  z,
} from 'zod';

import { SpectrumDocumentType } from '@/common/enums';

export const recoverGenerateSchema = object({
  email: string()
    .min(1, 'Correo es requerido')
    .email('Correo inválido')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  resend: boolean().default(false),
});

export const documentValidationSchema = object({
  tipoIdentidad: string(),
  numIdentidad: string().min(1, 'Número de documento es requerido'),
}).superRefine((schema, ctx) => {
  if (
    schema.tipoIdentidad === SpectrumDocumentType.DNI &&
    schema.numIdentidad.length !== 8
  ) {
    ctx.addIssue({
      message: 'El DNI debe tener 8 caracteres',
      code: z.ZodIssueCode.custom,
    });
  }
  if (
    schema.tipoIdentidad === SpectrumDocumentType.CE &&
    schema.numIdentidad.length < 6
  ) {
    ctx.addIssue({
      message: 'El CE debe tener por lo menos 6 caracteres',
      code: z.ZodIssueCode.custom,
    });
  }
  if (
    schema.tipoIdentidad === SpectrumDocumentType.PASSPORT &&
    schema.numIdentidad.length < 6
  ) {
    ctx.addIssue({
      message: 'El pasaporte debe tener por lo menos 6 caracteres',
      code: z.ZodIssueCode.custom,
    });
  }
  if (
    schema.tipoIdentidad === SpectrumDocumentType.RUC &&
    schema.numIdentidad.length < 11
  ) {
    ctx.addIssue({
      message: 'El RUC debe tener por lo menos 11 caracteres',
      code: z.ZodIssueCode.custom,
    });
  }
});

export const validateRecoverSchema = object({
  code: string().min(1, 'Código es requerido'),
  email: string().min(1, 'Correo es requerido').email('Correo inválido'),
});

const passwordRegex =
  /^(?!.*?\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\\/!@#$%^&*(),.?"_\-;:{}~|+'[\]=<>]).{8,}$/;
export const resetPasswordSchema = object({
  code: string()
    .min(1, 'Código es requerido')
    .length(5, 'Código debe tener 5 caracteres.'),
  new_password: string()
    .min(1, 'Contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .regex(passwordRegex, 'Contraseña débil'),
  confirmation_password: string()
    .min(1, 'Confirmar contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .regex(passwordRegex, 'Contraseña débil'),
}).refine((data) => data.new_password === data.confirmation_password, {
  path: ['confirmation_password'],
  message: 'Contraseñas deben coincidir',
});

export const createPasswordSchema = object({
  email: string().min(1, 'Correo es requerido').email('Correo inválido'),
  hash_security: string().min(1, 'Correo es requerido'),
  password: string()
    .min(1, 'Contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .regex(passwordRegex, 'Contraseña débil'),
  passwordConfirmation: string()
    .min(1, 'Confirmar contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .regex(passwordRegex, 'Contraseña débil'),
  accept_terms_conditions: literal<boolean>(true),
  accept_data_treatment: boolean(),
  utm_source: optional(string()),
  utm_medium: optional(string()),
  utm_campaign: optional(string()),
  channel_register: optional(string()),
  transac_id: optional(string()),
}).refine((data) => data.password === data.passwordConfirmation, {
  path: ['passwordConfirmation'],
  message: 'Contraseñas deben coincidir',
});

export const loginValidationSchema = object({
  email: string().min(1, 'Correo es requerido').email('Correo inválido'),
  password: string({ required_error: 'Contraseña es requerida' })
    .min(1, 'Contraseña es requerida')
    .max(32, 'Contraseña debe ser menos que 32 caracteres'),
});

export const registerEmailValidationSchema = object({
  email: string()
    .min(1, 'Correo es requerido')
    .email('Correo inválido')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
});

export const verifyAccountValidationSchema = object({
  email: string().min(1, 'Correo es requerido').email('Correo inválido'),
  code: string()
    .min(1, 'Debe ingresar el código de verificación')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
});

export const updateEmailValidationSchema = object({
  id: string(),
  email: string().min(1, 'Correo es requerido').email('Correo inválido'),
  code_unique_spectrum: string().min(1, 'Código único es requerido'),
  type_document: string(),
  number_document: string().min(1, 'Número de documento es requerido'),
});
export const passwordValidationSchema = object({
  password: string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(passwordRegex, 'Contraseña débil'),
  password_confirmation: string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(passwordRegex, 'Contraseña débil'),
}).refine((data) => data.password === data.password_confirmation, {
  path: ['password_confirmation'],
  message: 'Contraseñas deben coincidir',
});

export const registrationValidationSchema = object({
  id: string(),
  name: string(),
  lastname: string(),
  username: string()
    .min(1, 'Nombre es requerido')
    .max(30, 'Nombre debe ser menos de 30 caracteres')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  email: string().min(1, 'Correo es requerido').email('Correo inválido'),
  securityHash: string(),
  phone_number: string()
    .min(1, 'Número de celular es requerido')
    .min(9, 'Debe tener 9 caracteres.')
    .refine((s) => !s.includes(' '), 'Por favor remueva los espacios en blanco')
    .refine(
      (value) => value.startsWith('9'),
      "Número de celular debe empezar con '9'"
    ),
  phone_country: string(),
  accept_terms_conditions: literal<boolean>(true),
  accept_data_treatment: boolean(),
  utm_source: optional(string()),
  utm_medium: optional(string()),
  utm_campaign: optional(string()),
  channel_register: optional(string()),
  transac_id: optional(string()),
});

export const passwordRegistrationValidationSchema = intersection(
  passwordValidationSchema,
  registrationValidationSchema
);

export const sendProspectValidationSchema1 = object({
  customer_fullname: string({
    required_error: 'Nombres completos es requerido',
  }).min(1, 'Nombres completos es requerido'),
  customer_email: string({
    required_error: 'Correo es requerido',
  })
    .min(1, 'Correo es requerido')
    .email('Correo inválido'),
  custoner_phone: string()
    .min(1, 'Número de celular es requerido')
    .min(9, 'Debe tener 9 caracteres.')
    .refine((s) => !s.includes(' '), 'Por favor remueva los espacios en blanco')
    .refine(
      (value) => value.startsWith('9'),
      "Número de celular debe empezar con '9'"
    ),
});

export const documentTypeValidationSchema = object({
  number_document: string({
    required_error: 'Número de documento es requerido',
  }).min(1, 'Número de documento es requerido'),
  document_type: string(),
}).superRefine((schema, ctx) => {
  if (
    schema.document_type === SpectrumDocumentType.PASSPORT &&
    schema.number_document.length < 8
  ) {
    ctx.addIssue({
      message: 'El pasaporte debe tener por lo menos 8 caracteres',
      code: z.ZodIssueCode.custom,
      path: ['number_document'],
    });
  }
  if (
    schema.document_type === SpectrumDocumentType.RUC &&
    schema.number_document.length < 11
  ) {
    ctx.addIssue({
      message: 'El RUC debe tener por lo menos 11 caracteres',
      code: z.ZodIssueCode.custom,
      path: ['number_document'],
    });
  }
});

export const sendProspectValidationSchema = intersection(
  sendProspectValidationSchema1,
  documentTypeValidationSchema
);

export type TLoginForm = TypeOf<typeof loginValidationSchema>;
export type TRecoverGenerateForm = TypeOf<typeof recoverGenerateSchema>;
export type TRecoverValidateForm = TypeOf<typeof validateRecoverSchema>;
export type TResetPasswordForm = TypeOf<typeof resetPasswordSchema>;
export type TVerifyForm = TypeOf<typeof verifyAccountValidationSchema>;
export type TDocumentValidationForm = TypeOf<typeof documentValidationSchema>;
export type TRegisterEmailForm = TypeOf<typeof registerEmailValidationSchema>;
export type TCreatePasswordForm = TypeOf<typeof createPasswordSchema>;
export type TUpdateEmailForm = TypeOf<typeof updateEmailValidationSchema>;
export type TSendProspectForm = TypeOf<typeof sendProspectValidationSchema>;
export type TPasswordRegistrationForm = TypeOf<
  typeof passwordRegistrationValidationSchema
>;

import { intersection, object, string, TypeOf } from 'zod';

export const passwordValidationSchema = object({
  password: string({
    required_error: 'Contraseña es requerida',
  }).min(1, 'Contraseña es requerida'),
});

export const emailValidationSchema = object({
  email: string({
    required_error: 'Correo es requerido',
  }).min(1, 'Correo es requerido'),
});

export const phoneNumberValidationSchema = object({
  phone_number: string({
    required_error: 'Número de celular es requerido',
  }).min(1, 'Número de celular es requerido'),
});

export const profileUpdateEmailValidationSchema = object({
  email: string({
    required_error: 'Correo es requerido',
  }).min(1, 'Correo es requerido'),
  code: string().min(1, 'Código es requerido'),
});

export const profileUpdatePhoneValidationSchema = object({
  phone_number: string({
    required_error: 'Número de celular es requerido',
  }).min(1, 'Número de celular es requerido'),
  code: string().min(1, 'Código es requerido'),
});

export const currentPasswordValidationSchema = object({
  new_password: string().min(8, 'Mínimo 8 caracteres'),
  confirmation_password: string().min(8, 'Mínimo 8 caracteres'),
}).refine((data) => data.new_password === data.confirmation_password, {
  path: ['confirmation_password'],
  message: 'Contraseñas deben coincidir',
});
export const confirmPasswordValidationSchema = object({
  password_current: string(),
});
export const updatePasswordValidationSchema = intersection(
  currentPasswordValidationSchema,
  confirmPasswordValidationSchema
);

export const updateUsernameValidationSchema = object({
  username: string({
    required_error: 'Nombre es requerido',
  })
    .min(1, 'Nombre es requerido')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
});

export type TPasswordValidationForm = TypeOf<typeof passwordValidationSchema>;
export type TPhoneValidationForm = TypeOf<typeof phoneNumberValidationSchema>;
export type TEmailValidationForm = TypeOf<typeof emailValidationSchema>;
export type TUpdateUsernameForm = TypeOf<typeof updateUsernameValidationSchema>;
export type TProfileUpdateEmailForm = TypeOf<
  typeof profileUpdateEmailValidationSchema
>;
export type TProfileUpdatePhoneForm = TypeOf<
  typeof profileUpdatePhoneValidationSchema
>;
export type TUpdatePasswordForm = TypeOf<typeof updatePasswordValidationSchema>;

import { any, boolean, number, object, string, TypeOf, z } from 'zod';

import { SpectrumDocumentType } from '@/common/enums';

export const typeParticipateValidationSchema = object({
  type_participate_item_id: number(),
  certified_information_provided: boolean().default(false),
});

export const personalInformationValidationSchema = object({
  name: string()
    .min(1, 'Primer nombre es obligatorio.')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  lastname: string()
    .min(1, 'Segundo apellido es obligatorio.')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  middlename: string()
    .optional()
    .refine((s) => {
      if (s) return !s.startsWith(' ') && !s.endsWith(' ');
      return true;
    }, 'Por favor remueva los espacios en blanco'),
  surname: string()
    .min(1, 'Primer apellido es obligatorio.')
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  gender_id: number().min(1, 'Debe seleccionar un género.'),
  civil_status_id: number().min(1, 'Debe seleccionar un estado civil.'),
  birthdate: string().min(1, 'Debe ingresar su fecha de nacimiento.'),
  place_birth: number().min(1, 'Debe seleccionar un lugar de nacimiento.'),
  instruction_grade_id: number().min(
    1,
    'Debe seleccionar su grado de instrucción.'
  ),
  nationality_id: number().min(1, 'Debe seleccionar su nacionalidad.'),
});

export const countryValidationSchema = object({
  place_birth: string().min(1, 'Debe seleccionar un lugar de nacimiento.'),
});

export const activityClientValidationSchema = z.object({
  type_worker_id: z.number(),
  occupation: z
    .string()
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  monthly_income: z.string(),
  business_name: z
    .string()
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  position: z
    .string()
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  entry_date_id: z.number(),
});

export const homeClientValidationSchema = z.object({
  department_id: z.number(),
  province_id: z.number(),
  city: z.string(),
  district_id: z.number(),
  district_text: z.string(),
  address: z
    .string()
    .refine(
      (s) => !s.startsWith(' ') && !s.endsWith(' '),
      'Por favor remueva los espacios en blanco'
    ),
  dpto: z.string(),
  urb: z.string(),
});

export const spouseClientValidationSchema = z.object({
  regime_type_id: z.number(),
  name: z.string(),
  lastname: z.string(),
  nationality_id: z.number(),
  type_document_id: z.any(),
  document_number: z.string(),
});

export const preSpouseClientValidationSchema = z
  .object({
    regime_type_id: z.number(),
    name: z.string(),
    lastname: z.string(),
    middlename: z.string().optional(),
    surname: z.string(),
    nationality_id: z.number(),
    type_document_id: z.any(),
    document_number: z.string(),
  })
  .superRefine((schema, ctx) => {
    if (
      schema.type_document_id === SpectrumDocumentType.DNI &&
      schema.document_number.length !== 7
    ) {
      ctx.addIssue({
        message: 'El número de documento debe tener 8 caracteres',
        code: z.ZodIssueCode.custom,
      });
    } else {
      ctx.addIssue({
        message: 'El número de documento debe tener por lo menos 8 caracteres',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const preFinalBeneficiaryClientValidationSchema = z
  .object({
    customer_id: z.string(),
    date_format: z.string(),
    name_holder: z.string(),
    is_final_beneficiary: z.boolean(),
    name_beneficiary: z.string(),
    lastname_beneficiary: z.string(),
    country_id: z.number(),
    date_birth: z.string(),
    nationality_id: z.number(),
    document_type: z.string(),
    document_type_id: z.string().optional(),
    document_number: z.string(),
    nit: z.string(),
    ruc: z.string(),
    civil_status_id: z.number(),
    name_spouse: z.string().optional(),
    lastname_spouse: z.string().optional(),
    document_type_spouse: z.string().optional(),
    document_type_spouse_id: z.string().optional(),
    document_number_spouse: z.string().optional(),
    regime_type_id: z.number().optional(),
    date_property_regime: z.string().optional(),
    legal_relationship: z.string(),
    contact_email: z.string().default('email-default@gmail.com'),
    contact_phone: z.string().default('999999999'),
    contact_address: z.string().default('direccion'),
    contact_department_id: z.number().optional(),
    contact_district_id: z.number().default(535),
    contact_province_id: z.number().default(51),
    contact_country_id: z.number().default(6),
    contact_postal_code: z.string().default('12312'),
    image: z.string().default('default'),
    legal_position: z.string(),
  })
  .superRefine((schema, ctx) => {
    if (
      schema.document_type === SpectrumDocumentType.DNI &&
      schema.document_number.length !== 8
    ) {
      ctx.addIssue({
        message: 'El número de documento debe tener 8 caracteres',
        code: z.ZodIssueCode.custom,
      });
    } else if (
      schema.document_type_spouse === SpectrumDocumentType.DNI &&
      schema.document_number.length !== 8
    ) {
      ctx.addIssue({
        message: 'El número de documento debe tener 8 caracteres',
        code: z.ZodIssueCode.custom,
      });
    } else if (
      !schema.contact_email.match(
        new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$')
      )
    ) {
      ctx.addIssue({
        message: 'El correo eletrónico es incorrecto',
        code: z.ZodIssueCode.custom,
      });
    } else {
      ctx.addIssue({
        message: 'Error',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const identifyCustomerValidationSchema = object({
  document_type_id: any(),
  number_document: string({
    required_error: 'El número de documento es requerido',
  }),
  business_executive_id: any(),
}).superRefine((schema, ctx) => {
  if (
    schema.document_type_id === SpectrumDocumentType.DNI &&
    schema.number_document.length !== 7
  ) {
    ctx.addIssue({
      message: 'El número de documento debe tener 8 caracteres',
      code: z.ZodIssueCode.custom,
    });
  } else {
    ctx.addIssue({
      message: 'El número de documento debe tener por lo menos 8 caracteres',
      code: z.ZodIssueCode.custom,
    });
  }
});

export type TTypeParticipateForm = TypeOf<
  typeof typeParticipateValidationSchema
>;

export type TIdentifyCustomerForm = TypeOf<
  typeof identifyCustomerValidationSchema
>;

export type TPersonalInformationForm = TypeOf<
  typeof personalInformationValidationSchema
>;

export type TCountryForm = TypeOf<typeof countryValidationSchema>;
export type TActivityClientForm = TypeOf<typeof activityClientValidationSchema>;
export type THomeClientForm = TypeOf<typeof homeClientValidationSchema>;
export type TSpouseClientForm = TypeOf<typeof spouseClientValidationSchema>;
export type TPreSpouseClientForm = TypeOf<
  typeof preSpouseClientValidationSchema
>;
export type TFinalBeneficiaryForm = TypeOf<
  typeof preFinalBeneficiaryClientValidationSchema
>;

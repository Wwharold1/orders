import { FacialStateEnum } from '@/modules/auth/helpers/registerSteps';

export const IdentityTitleEnum = {
  [FacialStateEnum.INITIAL_VALIDATION]: 'Validación de identidad',
  [FacialStateEnum.VALIDATION_UNSUCCESS]: 'Validación de identidad no exitosa',
  [FacialStateEnum.VALIDATION_SUCCESS]: '¡Validación exitosa!',
  [FacialStateEnum.LIMIT_SHIPMENTS_FACIAL]: 'Parece que hubo un problema',
  [FacialStateEnum.LIMIT_SHIPMENTS]: 'Parece que hubo un problema',
};

import {
  IconAccount,
  IconDelete,
  IconHome,
  IconLogout,
  IconMovement,
  IconPerson,
  IconSupport,
} from '@/common/components/icons';
import { ISidebarSchema } from '@/common/interfaces';

export enum ContextSplashEnum {
  AUTH = 'AUTH',
  AUTH_EMAIL_VERIFIED = 'AUTH_EMAIL_VERIFIED',
  AUTH_REGISTER_COMPLETED = 'AUTH_REGISTER_COMPLETED',
  AUTH_RECOVERY_COMPLETED = 'AUTH_RECOVERY_COMPLETED',
  AUTH_PROSPECT_COMPLETED = 'AUTH_PROSPECT_COMPLETED',
  TYPE_PARTICIPATE_COMPLETED = 'TYPE_PARTICIPATE_COMPLETED',
  NATURAL_PERSON_PEP_COMPLETED = 'NATURAL_PERSON_PEP_COMPLETED',
  IDENTITY_VALIDATION_LIMIT = 'IDENTITY_VALIDATION_LIMIT',
  IDENTITY_VALIDATION_FIRST_SUCCESS = 'IDENTITY_VALIDATION_FIRST_SUCCESS',
  IDENTITY_VALIDATION_SUCCESS = 'IDENTITY_VALIDATION_SUCCESS',
  IDENTITY_VALIDATION_SUCCESS_RESCUE = 'IDENTITY_VALIDATION_SUCCESS_RESCUE',
  CREATE_PAYMENT_SUCCESS = 'CREATE_PAYMENT_SUCCESS',
  FAILED_AML = 'FAILED_AML',
  ANUALLY_UPDATED = 'ANUALLY_UPDATED',

  BANK_ACCOUNT_CREATED = 'BANK_ACCOUNT_CREATED',
  RESCUE_CREATED = 'RESCUE_CREATED',

  PROFILE_UPDATED = 'PROFILE_UPDATED',
  ANUALLY_PROFILE_UPDATED = 'ANUALLY_PROFILE_UPDATED',
  PROFILE_EMAIL_VERIFIED = 'PROFILE_EMAIL_VERIFIED',
  PROFILE_PHONE_VERIFIED = 'PROFILE_PHONE_VERIFIED',
  PROFILE_PASSWORD_UPDATED = 'PROFILE_PASSWORD_UPDATED',
  PROFILE_CHANGED_RISK = 'PROFILE_CHANGED_RISK',
  PROFILE_FINAL_BENFICIARY = 'PROFILE_FINAL_BENFICIARY',
}

export enum ContextSidebarEnum {
  HOME = 'HOME',
  ACCOUNTS = 'ACCOUNTS',
  MOVEMENTS = 'MOVEMENTS',
  PROFILE = 'PROFILE',
}

export enum ContextBottomSidebarEnum {
  SUPPORT = 'SUPPORT',
  LOGOUT = 'LOGOUT',
  DELETE = 'DELETE',
}

export const SidebarOptions: ISidebarSchema[] = [
  {
    title: 'Inicio',
    type: ContextSidebarEnum.HOME,
    icon: IconHome,
  }
];

export const BottomSidebarOptions: ISidebarSchema[] = [
  {
    title: 'Cerrar sesión',
    type: ContextBottomSidebarEnum.LOGOUT,
    icon: IconLogout,
  },
];

export enum HeightEnum {
  MD = 720,
}

export enum MediaQueryEnum {
  XS = 490,
  SM = 640,
  MD = 768,
  LG = 1024,
  LGXL = 1100,
  XL = 1400,
}

export enum MediaQueryHeightEnum {
  SM = 650,
  SMD = 700,
  MD = 800,
}

export enum DevicePixelRatioEnum {
  NORMAL = 2,
  SM_ZOOM = 2.5,
}

export interface ITabs {
  id: number;
  title: string;
}

export const RescueTabs: ITabs[] = [
  {
    id: 0,
    title: 'Detalle',
  },
  {
    id: 1,
    title: 'Cuenta',
  },
];

export const InvestmentTabs: ITabs[] = [
  {
    id: 0,
    title: 'Detalle',
  },
  {
    id: 1,
    title: 'Banco',
  },
  {
    id: 2,
    title: 'Constancia',
  },
];

export const OrderTabs: ITabs[] = [
  {
    id: 0,
    title: 'Detalle',
  },
];


export const ContextTabs: ITabs[] = [
  {
    id: 0,
    title: 'Documento',
  },
  {
    id: 1,
    title: 'Identificación',
  },
  {
    id: 2,
    title: 'Actividad',
  },
  {
    id: 3,
    title: 'Residencia',
  },
  {
    id: 4,
    title: 'PEP',
  },
  {
    id: 5,
    title: 'Beneficiario final',
  },
  {
    id: 6,
    title: 'Validación',
  },
];

export const CivilStatusTabs: ITabs[] = [
  {
    id: 4,
    title: 'Cónyuge',
  },
  {
    id: 5,
    title: 'PEP',
  },
  {
    id: 6,
    title: 'Validación',
  },
];
export const ChangeRiskTabs: ITabs[] = [
  {
    id: 0,
    title: 'Beneficiario final',
  },
  {
    id: 1,
    title: 'Validación',
  },
];

export const ChangeFinalBeneficiaryTabs: ITabs[] = [
  {
    id: 0,
    title: 'Seleccionar',
  },
  {
    id: 1,
    title: 'Validación',
  },
];

export enum MonthlyIncomeEnum {
  LESS_THAN_10 = 'LESS_THAN_10',
  LESS_THAN_15 = 'LESS_THAN_15',
  LESS_THAN_20 = 'LESS_THAN_20',
  LESS_THAN_25 = 'LESS_THAN_25',
  LESS_THAN_30 = 'LESS_THAN_30',
  MORE_THAN_30 = 'MORE_THAN_30',
}

interface IMonthlyIncome {
  key: MonthlyIncomeEnum;
  title: string;
}

export const MonthlyIncomeData: IMonthlyIncome[] = [
  {
    key: MonthlyIncomeEnum.LESS_THAN_10,
    title: 'Hasta S/ 10,000',
  },
  {
    key: MonthlyIncomeEnum.LESS_THAN_15,
    title: 'De S/ 10,001 a S/ 15,000',
  },
  {
    key: MonthlyIncomeEnum.LESS_THAN_20,
    title: 'De S/ 15,001 a S/ 20,000',
  },
  {
    key: MonthlyIncomeEnum.LESS_THAN_25,
    title: 'De S/ 20,001 a S/ 25,000',
  },
  {
    key: MonthlyIncomeEnum.LESS_THAN_30,
    title: 'De S/ 25,001 a S/ 30,000',
  },
  {
    key: MonthlyIncomeEnum.MORE_THAN_30,
    title: 'Más de S/ 30,000',
  },
];

export enum DeviceTypeEnum {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

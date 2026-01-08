import {
  IconHome,
  IconLogout,
} from '@/common/components/icons';
import { ISidebarSchema } from '@/common/interfaces';

export enum ContextSplashEnum {
  AUTH = 'AUTH',
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

export enum DeviceTypeEnum {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}


import { SVGProps } from 'react';

import {
  IconDeleteBank,
  IconEdit,
  IconStarOutline,
  IconVisibility,
} from '@/common/components/icons/accounts';
import { IconVisibilityHidden } from '@/common/components/icons/accounts/IconVisibilityHidden';

export enum BankAccountMenuEnum {
  SHOW_BANK_DATA = 'SHOW_BANK_DATA',
  HIDE_BANK_DATA = 'HIDE_BANK_DATA',
  EDIT_BANK_ACCOUNT = 'EDIT_BANK_ACCOUNT',
  DELETE_BANK_ACCOUNT = 'DELETE_BANK_ACCOUNT',
  SET_MAIN_ACCOUNT = 'SET_MAIN_ACCOUNT',
}

interface IBankAccountMenu {
  type: BankAccountMenuEnum;
  title: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const BankAccountMenuOptions: IBankAccountMenu[] = [
  {
    type: BankAccountMenuEnum.HIDE_BANK_DATA,
    title: 'Ocultar datos',
    icon: IconVisibilityHidden,
  },
  {
    type: BankAccountMenuEnum.SHOW_BANK_DATA,
    title: 'Mostrar datos',
    icon: IconVisibility,
  },
  {
    type: BankAccountMenuEnum.EDIT_BANK_ACCOUNT,
    title: 'Editar',
    icon: IconEdit,
  },
  {
    type: BankAccountMenuEnum.DELETE_BANK_ACCOUNT,
    title: 'Eliminar',
    icon: IconDeleteBank,
  },
  {
    type: BankAccountMenuEnum.SET_MAIN_ACCOUNT,
    title: 'Elegir como principal',
    icon: IconStarOutline,
  },
];

export enum BankAccountFormEnum {
  UPDATE_BANK_ACCOUNT = 'UPDATE_BANK_ACCOUNT',
}

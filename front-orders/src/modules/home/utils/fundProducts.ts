import { SVGProps } from 'react';

import {
  IconBagFund,
  IconLanguage,
  IconMoneySymbol,
  IconSavings,
} from '@/common/components/icons/dashboard';

export interface IFundProductBg {
  codFund: string;
  from: string;
  to: string;
  gradient: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const FundProductBg: IFundProductBg[] = [
  {
    codFund: '001',
    from: '#A36FD7',
    to: '#654993',
    icon: IconBagFund,
    gradient: '#BA93E190',
  },
  {
    codFund: '002',
    from: '#CF70AF',
    to: '#B762A7',
    icon: IconLanguage,
    gradient: '#DB94C390',
  },
  {
    codFund: '003',
    from: '#41A5A4',
    to: '#018786',
    icon: IconSavings,
    gradient: '#80C3C290',
  },
  {
    codFund: '004',
    from: '#408AD7',
    to: '#0269A6',
    icon: IconMoneySymbol,
    gradient: '#3A9BCE90',
  },
  {
    codFund: '005',
    from: '#408AD7',
    to: '#0269A6',
    icon: IconMoneySymbol,
    gradient: '#3A9BCE90',
  },
  {
    codFund: '006',
    from: '#C87137',
    to: '#BA6825',
    icon: IconMoneySymbol,
    gradient: '#C8713790',
  },
];

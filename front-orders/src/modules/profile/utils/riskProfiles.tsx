import { SVGProps } from 'react';

import IconBulb from '@/common/components/icons/riskProfile/IconBulb';
import IconPig from '@/common/components/icons/riskProfile/IconPig';
import IconRocket from '@/common/components/icons/riskProfile/IconRocket';

export interface IRiskProfilesBg {
  name: 'Conservador' | 'Moderado' | 'Arriesgado';
  from: string;
  to: string;
  gradient: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const RiskProfilesBg: IRiskProfilesBg[] = [
  {
    name: 'Conservador',
    from: '#41A5A4',
    to: '#018786',
    icon: IconPig,
    gradient: '#BA93E190',
  },
  {
    name: 'Moderado',
    from: '#408AD7',
    to: '#0269A6',
    icon: IconBulb,
    gradient: '#DB94C390',
  },
  {
    name: 'Arriesgado',
    from: '#A36FD7',
    to: '#654993',
    icon: IconRocket,
    gradient: '#80C3C290',
  },
];

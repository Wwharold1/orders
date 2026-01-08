import { SVGProps } from 'react';

import {
  ContextBottomSidebarEnum,
  ContextSidebarEnum,
  ContextSplashEnum,
} from '@/common/enums';

export interface ISplashSchema {
  show: boolean;
  type: ContextSplashEnum;
}

export interface ISidebarSchema {
  title:
    | 'Inicio'
    | 'Cuentas'
    | 'Ordenes'
    | 'Movimientos'
    | 'Perfil'
    | 'Contactar a soporte'
    | 'Cerrar sesión'
    | 'Eliminar cuenta';
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  type: ContextSidebarEnum | ContextBottomSidebarEnum;
}

export interface ICanDelete {
  canBeDeleted: boolean;
  message: string;
  requestDate: string | null;
}

export interface IRequestDelete {
  status: boolean;
  message: string;
}

import { MotionValue, PanInfo } from 'framer-motion';

export type CarouselProps = {
  children: React.ReactNode;
  renderArrowLeft?: (args: {
    handlePrev: () => void;
    activeIndex: number;
  }) => React.ReactNode;
  renderArrowRight?: (args: {
    handleNext: () => void;
    activeIndex: number;
  }) => React.ReactNode;
  renderDots?: (args: Omit<DotProps, 'length'>) => React.ReactNode;
  autoPlay: boolean;
  interval: number;
  loop: boolean;
};

export type ArrowProps = {
  onClick: () => void;
  left?: boolean;
  children: React.ReactNode;
};

export type SliderProps = {
  x: MotionValue<number>;
  i: number;
  children: React.ReactNode;
  onDragEnd: (e: Event, dragProps: PanInfo) => void;
  totalSliders: number;
};

export type DotProps = {
  length: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export type CarouselRef = {
  handleNext: () => void;
  handlePrev: () => void;
  setIndex: (index: number) => void;
};

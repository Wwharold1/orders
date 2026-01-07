/* eslint-disable @typescript-eslint/no-explicit-any */
// import Swiper core and required modules
import { FC } from 'react';
import { A11y, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { MediaQueryEnum } from '@/common/enums';
import useMediaQuery from '@/common/hooks/useMediaQuery';

interface IProps {
  items: number;
  onlyOne?: boolean;
  investment?: boolean;
  investmentXL?: boolean;
  children: React.ReactNode;
  spaceBetween?: number;
  allWidth?: boolean;
}

export const Carousel: FC<IProps> = ({
  children,
  items,
  onlyOne,
  investment,
  investmentXL,
  spaceBetween,
  allWidth,
}) => {
  const isSmDown = useMediaQuery(MediaQueryEnum.SM);
  const isXSDown = useMediaQuery(MediaQueryEnum.XS);

  return (
    <Swiper
      modules={[Pagination, Scrollbar, A11y]}
      slidesPerView={
        investmentXL && items === 2
          ? 2.05
          : investmentXL
          ? 2.4
          : investment && items === 1
          ? 1.03
          : investment
          ? 1.1
          : onlyOne
          ? 1
          : items === 1
          ? 1
          : isXSDown
          ? 1.1
          : isSmDown
          ? 1.5
          : 2
      }
      slidesOffsetAfter={allWidth && items !== 1 ? 20 : 0}
      spaceBetween={investment && items !== 1 ? 20 : spaceBetween ?? 0}
      pagination={{ clickable: true }}
    >
      {children}
    </Swiper>
  );
};

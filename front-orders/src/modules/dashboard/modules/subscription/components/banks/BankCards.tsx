import React, { FC } from 'react';
import { SwiperSlide } from 'swiper/react';

import { Carousel } from '@/common/components/Carousel';
import { MediaQueryEnum } from '@/common/enums';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { ICollectorAccount } from '@/common/interfaces/subscription.interface';
import { BankCard } from '@/modules/dashboard/modules/subscription/components/banks/BankCard';

interface IProps {
  banks: ICollectorAccount[] | undefined;
  loading: boolean;
}

export const BankCards: FC<IProps> = ({ banks, loading }) => {
  const isMdUp = useMediaQuery(MediaQueryEnum.MD);

  return (
    <>
      {isMdUp && !loading && banks ? (
        <Carousel onlyOne items={banks?.length}>
          {banks.map((bank, index, current) => {
            return (
              <SwiperSlide className='pt-4' key={index + 2}>
                <BankCard
                  items={current?.length}
                  collector={bank}
                  key={index + 2}
                />
              </SwiperSlide>
            );
          })}
        </Carousel>
      ) : !isMdUp && !loading && banks ? (
        <div className='grid grid-cols-12 gap-6'>
          {banks.map((bank, index) => {
            return <BankCard collector={bank} key={index} />;
          })}
        </div>
      ) : !isMdUp ? (
        <div className='grid grid-cols-12 gap-6'>
          {[1, 2, 3].map((bank, index) => {
            return <BankCard loading key={index} />;
          })}
        </div>
      ) : (
        <Carousel items={3}>
          {[1, 2, 3].map((fund, index) => {
            return (
              <SwiperSlide key={index + 2}>
                <BankCard loading key={index + 2} />
              </SwiperSlide>
            );
          })}
        </Carousel>
      )}
    </>
  );
};

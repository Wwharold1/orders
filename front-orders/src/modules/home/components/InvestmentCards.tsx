import React, { FC } from 'react';
import { SwiperSlide } from 'swiper/react';

import { Carousel } from '@/common/components/Carousel';
import { MediaQueryEnum } from '@/common/enums';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { IListOrderResponse } from '@/common/interfaces';
import { InvestmentSerieCard } from '@/modules/home/components/InvestmentSerieCard';

interface IProps {
  listOrdersData: IListOrderResponse;
}

export const InvestmentCards: FC<IProps> = ({ listOrdersData }) => {
  const isLgUp = useMediaQuery(MediaQueryEnum.LG);

  return (
    <>
      <div className='pl-3 lg:pl-10'>
        <div className='no-scrollbar col-span-12 md:col-span-6 md:max-h-[800px] md:overflow-auto lg:col-span-8 lg:max-h-full lg:overflow-hidden '>
          {isLgUp ? (
            <Carousel
              allWidth
              investment
              onlyOne
              items={2}
            >
              {listOrdersData.data.map((fund, index) => {
                return (
                  <SwiperSlide key={index + 2}>
                    {/* <InvestmentSerieCard fundItem={fund} key={index} /> */}
                  </SwiperSlide>
                );
              })}
            </Carousel>
          ) : (
            <Carousel
              spaceBetween={20}
              investmentXL
              allWidth={listOrdersData.data?.length >= 2}
              items={listOrdersData.data?.length}
            >
              {listOrdersData.data.map((orden, index) => {
                return (
                  <SwiperSlide key={index + 2}>
                    <InvestmentSerieCard ordenItem={orden} key={index} />
                  </SwiperSlide>
                );
              })}
            </Carousel>
          )}
        </div>
      </div>

      {/* <div className='pl-3 lg:px-10'>
        <div className='mt-3 pl-1 md:pl-0'>
          <div className='flex items-center space-x-2'>
            <h3 className='text-xl font-bold text-primary-900'>
              Mis inversiones{' '}
            </h3>
          </div>
          <p className='text-sm text-neutral-500'>
            Detalle de tus inversiones por fondo
          </p>
        </div>

        <div className='mt-6 md:pr-3'>
          {isLgUp ? (
            <Carousel
              allWidth
              investment
              onlyOne
              items={listFundsData.funds_serie?.length}
            >
              {listFundsData.funds_serie.map((fund, index) => {
                return (
                  <div
                    key={index + 2}
                    className='no-scrollbar col-span-12 pr-3 md:col-span-6 md:max-h-[800px] md:overflow-auto md:pr-10 lg:col-span-8 lg:max-h-full lg:overflow-hidden lg:pr-16'
                  >
                    <SwiperSlide>
                      <InvestmentCard fundItem={fund} key={index} />
                    </SwiperSlide>
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <div className='grid grid-cols-12 gap-4'>
              {listFundsData.funds_serie.map((fund, index) => {
                return <InvestmentCard fundItem={fund} key={index} />;
              })}
            </div>
          )}
        </div>
      </div> */}
    </>
  );
};

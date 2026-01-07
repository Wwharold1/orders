/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { SwiperSlide } from 'swiper/react';

import { Carousel } from '@/common/components/Carousel';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import { useAppSelector } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { useFunds } from '@/modules/dashboard/hooks/useFunds';
import { ProductCard } from '@/modules/home/components/ProductCard';

interface IProps {
  withPDR: boolean;
}

export const ProductCards: FC<IProps> = () => {
  const {
    queries: { fundsQuery, profileFundQuery },
  } = useFunds();
  const isMdUp = useMediaQuery(MediaQueryEnum.MD);
  const { recommendedFunds } = useAppSelector((state) => state.subscription);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const router = useRouter();
  const currentRisk = useAppSelector((state) => state.riskProfile);

  const loadingFundsQuery =
    (fundsQuery.isLoading || fundsQuery.isFetching) && !fundsQuery.isError;
  const loadingProfileQuery =
    (profileFundQuery.isLoading || profileFundQuery.isFetching) &&
    !profileFundQuery.isError;
  const loading = loadingProfileQuery || loadingFundsQuery;

  const withPDR =
    !!currentUser?.risk_profile_id || currentRisk.customer_risk
      ? 'risk_profile_id' in currentRisk.customer_risk!
        ? !!currentRisk.customer_risk?.risk_profile_id
        : !!currentRisk.customer_risk?.id
      : false;

  return (
    <div>
      <div className='mb-6 mt-10 pl-1 md:pl-0'>
        <div className='flex items-center space-x-2'>
          <h3 className='text-xl font-bold text-primary-900'>
            {withPDR ? 'Productos recomendados' : 'Nuestros productos'}
          </h3>
          {withPDR && (
            <a
              onClick={() =>
                router.push(ContextRoutesEnum.PRODUCTS_RECOMMENDED)
              }
              className='cursor-pointer text-xl font-bold leading-none text-[#0066CC]'
            >
              Ver más
            </a>
          )}
        </div>
        <p className='text-sm text-neutral-500'>
          {withPDR
            ? 'Fondos Mutuos según tu perfil de tolerancia al riesgo'
            : 'Fondos Mutuos que tenemos para ti'}
        </p>
      </div>

      {!loading && isMdUp ? (
        <Carousel
          items={
            fundsQuery.data?.filter((fund) => {
              if (withPDR) {
                return recommendedFunds.map((e) => e.id).includes(fund.id);
              }
              return fund;
            }).length!
          }
          spaceBetween={30}
          investment
        >
          {fundsQuery.data
            ?.filter((fund) => {
              if (withPDR) {
                return recommendedFunds.map((e) => e.id).includes(fund.id);
              }
              return fund;
            })
            .map((fund, index, current) => {
              return (
                <SwiperSlide key={index + 2}>
                  <ProductCard
                    items={current?.length}
                    fund={fund}
                    key={index + 2}
                  />
                </SwiperSlide>
              );
            })}
        </Carousel>
      ) : !loading && !isMdUp ? (
        <div className='grid grid-cols-12 gap-4'>
          {/* <div className='flex items-center justify-center md:flex-wrap md:items-start md:justify-start'> */}
          {fundsQuery.data
            ?.filter((fund) => {
              if (withPDR) {
                return recommendedFunds.map((e) => e.id).includes(fund.id);
              }
              return fund;
            })
            .map((fund, index) => {
              return <ProductCard fund={fund} key={index + 2} />;
            })}
        </div>
      ) : !isMdUp ? (
        <div className='grid grid-cols-12 gap-4'>
          {[1, 2, 3, 4].map((fund, index) => {
            return <ProductCard loading={loading} key={index + 2} />;
          })}
        </div>
      ) : (
        <Carousel spaceBetween={30} investment items={4}>
          {[1, 2, 3, 4].map((fund, index) => {
            return (
              <SwiperSlide key={index + 2}>
                <ProductCard key={index + 2} />
              </SwiperSlide>
            );
          })}
        </Carousel>
      )}
    </div>
  );
};

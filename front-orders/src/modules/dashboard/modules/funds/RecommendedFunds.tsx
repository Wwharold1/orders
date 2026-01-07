/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SwiperSlide } from 'swiper/react';

import { Carousel } from '@/common/components/Carousel';
import { MediaQueryEnum } from '@/common/enums';
import { useAppSelector } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { useFunds } from '@/modules/dashboard/hooks/useFunds';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { CardDisclaimer } from '@/modules/home/components/CardDisclaimer';
import { ProductCard } from '@/modules/home/components/ProductCard';

export const RecommendedFunds = () => {
  const {
    queries: { fundsQuery, profileFundQuery },
  } = useFunds();
  const isMdUp = useMediaQuery(MediaQueryEnum.LG);
  const { recommendedFunds } = useAppSelector((state) => state.subscription);
  const router = useRouter();

  const {
    state: { hasPDR },
  } = useRiskProfile(false);

  const loadingFundsQuery =
    (fundsQuery.isLoading || fundsQuery.isFetching) && !fundsQuery.isError;
  const loadingProfileQuery =
    (profileFundQuery.isLoading || profileFundQuery.isFetching) &&
    !profileFundQuery.isError;
  const loading = loadingProfileQuery || loadingFundsQuery;

  useEffect(() => {
    !hasPDR && router.back();
  }, []);

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout>
        <div>
          <div className='text-white'>
            <h1 className='text-xl font-bold'>Fondos Mutuos recomendados</h1>
            <p className='text-sm'>
              Te recomendamos estos fondos de acuerdo a tu perfil de tolerancia
              al riesgo.
            </p>
          </div>
          <div className='mt-6'>
            {!loading && isMdUp ? (
              <Carousel
                items={
                  fundsQuery.data?.filter((fund) => {
                    return recommendedFunds.map((e) => e.id).includes(fund.id);
                  }).length!
                }
                spaceBetween={30}
                investment
              >
                {fundsQuery.data
                  ?.filter((fund) => {
                    return recommendedFunds.map((e) => e.id).includes(fund.id);
                  })
                  .map((fund, index, current) => {
                    return (
                      <SwiperSlide key={index + 2}>
                        <ProductCard
                          items={current.length}
                          fund={fund}
                          key={index + 2}
                        />
                      </SwiperSlide>
                    );
                  })}
              </Carousel>
            ) : !loading && !isMdUp ? (
              <div className='grid grid-cols-12 gap-4'>
                {fundsQuery.data
                  ?.filter((fund) => {
                    return recommendedFunds.map((e) => e.id).includes(fund.id);
                  })
                  .map((fund, index) => {
                    return <ProductCard fund={fund} key={index + 2} />;
                  })}
              </div>
            ) : !isMdUp ? (
              <div className='grid grid-cols-12 gap-4'>
                {[1, 2, 3].map((fund, index) => {
                  return <ProductCard loading={loading} key={index + 2} />;
                })}
              </div>
            ) : (
              <Carousel spaceBetween={30} investment items={2}>
                {[1, 2].map((fund, index) => {
                  return (
                    <SwiperSlide key={index + 2}>
                      <ProductCard key={index + 2} />
                    </SwiperSlide>
                  );
                })}
              </Carousel>
            )}
          </div>
          <div className='mt-6 text-primary-900 md:mt-10'>
            <h1 className='text-xl font-bold'>Otros fondos</h1>
            <p className='text-sm text-neutral-500'>
              También puedes explorar otros fondos que tenemos para ti.
            </p>
          </div>
          <div className='mt-6'>
            {!loading && isMdUp ? (
              <Carousel
                items={
                  fundsQuery.data?.filter((fund) => {
                    return !recommendedFunds.map((e) => e.id).includes(fund.id);
                  }).length!
                }
              >
                {fundsQuery.data
                  ?.filter((fund) => {
                    return !recommendedFunds.map((e) => e.id).includes(fund.id);
                  })
                  .map((fund, index, current) => {
                    return (
                      <SwiperSlide key={index + 2}>
                        <ProductCard
                          items={current.length}
                          fund={fund}
                          key={index + 2}
                        />
                      </SwiperSlide>
                    );
                  })}
              </Carousel>
            ) : !loading && !isMdUp ? (
              <div className='grid grid-cols-12 gap-4'>
                {fundsQuery.data
                  ?.filter((fund) => {
                    return !recommendedFunds.map((e) => e.id).includes(fund.id);
                  })
                  .map((fund, index) => {
                    return <ProductCard fund={fund} key={index + 2} />;
                  })}
              </div>
            ) : !isMdUp ? (
              <div className='grid grid-cols-12 gap-4'>
                {[1, 2, 3].map((fund, index) => {
                  return <ProductCard loading={loading} key={index + 2} />;
                })}
              </div>
            ) : (
              <Carousel items={2}>
                {[1, 2].map((fund, index) => {
                  return (
                    <SwiperSlide key={index + 2}>
                      <ProductCard key={index + 2} />
                    </SwiperSlide>
                  );
                })}
              </Carousel>
            )}
          </div>
        </div>
        <CardDisclaimer withPDR={true} />
      </DashboardLayout>
    </div>
  );
};

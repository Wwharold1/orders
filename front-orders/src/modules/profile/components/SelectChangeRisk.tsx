import { useQuery } from '@tanstack/react-query';
import React, { FC } from 'react';
import { SwiperSlide } from 'swiper/react';

import { Button } from '@/common/components';
import { Carousel } from '@/common/components/Carousel';
import { MediaQueryEnum } from '@/common/enums';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { IProfilesRisk } from '@/common/interfaces';
import { setChangeRiskTab } from '@/modules/dashboard/slice/riskProfileSlice';
import { RiskCard } from '@/modules/profile/components/RiskCard';
import { RiskProfileService } from '@/services/RiskProfileService';

interface IProps {
  setOpenModalCancel: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
}

export const SelectChangeRisk: FC<IProps> = ({ setOpenModalCancel }) => {
  const dispatch = useAppDispatch();
  const { customer_risk, selectedCustomerRisk } = useAppSelector(
    (state) => state.riskProfile
  );
  const { currentUser } = useAppSelector((state) => state.session);
  const { data, isLoading } = useQuery<IProfilesRisk[]>(
    ['profile-risk-list'],
    () => RiskProfileService().getRiskProfile()
  );
  const isMdUp = useMediaQuery(MediaQueryEnum.MD);

  return (
    <div className='pb-6'>
      <div className='bg-white py-10 pb-5'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Cambiar tu perfil
        </p>
        <p className='mt-6 text-primary-900'>
          Selecciona otro perfil para cambiar el actual.
        </p>
      </div>
      <div>
        {isMdUp && !isLoading && data ? (
          <Carousel onlyOne items={data.length}>
            {data.map((profile_risk, index) => {
              return (
                <SwiperSlide className='pt-4' key={index + 2}>
                  <RiskCard profile_risk={profile_risk} key={index} />
                </SwiperSlide>
              );
            })}
          </Carousel>
        ) : !isMdUp && !isLoading && data ? (
          <div className='grid grid-cols-12 gap-6'>
            {data?.map((profile_risk, index) => {
              return <RiskCard profile_risk={profile_risk} key={index} />;
            })}
          </div>
        ) : !isMdUp ? (
          <div className='grid grid-cols-12 gap-6'>
            {[1, 2, 3].map((bank, index) => {
              return <RiskCard loading key={index} />;
            })}
          </div>
        ) : (
          <Carousel items={3}>
            {[1, 2, 3].map((fund, index) => {
              return (
                <SwiperSlide key={index + 2}>
                  <RiskCard loading key={index + 2} />
                </SwiperSlide>
              );
            })}
          </Carousel>
        )}
      </div>
      <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
        <Button
          title='Cancelar'
          alternative
          noBorder
          handleClick={() => setOpenModalCancel(true)}
          className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:w-auto md:self-auto'
        />
        <Button
          className='w-4/5 self-center md:w-auto'
          type='submit'
          iconEnd='/icons/ArrowRight.svg'
          title='Siguiente'
          disabled={
            currentUser?.risk_profile_id === selectedCustomerRisk?.id ||
            customer_risk?.id === selectedCustomerRisk?.id
          }
          handleClick={() => dispatch(setChangeRiskTab(1))}
        />
      </div>
    </div>
  );
};

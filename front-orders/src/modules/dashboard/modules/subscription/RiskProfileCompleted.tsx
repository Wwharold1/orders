/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@/common/components';
import { IconStar } from '@/common/components/icons/dashboard/IconStar';
import { ContextRoutesEnum, ContextSidebarEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useIsomorphicLayoutEffect,
  useStateCallback,
} from '@/common/hooks';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { RiskProfileOriginEnum } from '@/modules/dashboard/enums/risk-profile-origin.enum';
import { setIsFromOpenYourAccount } from '@/modules/dashboard/slice/riskProfileSlice';
import { RiskProfilesBg } from '@/modules/profile/utils/riskProfiles';
import { setSidebar } from '@/redux/common/layoutSlice';

export const RiskProfileCompleted = () => {
  const [_riskProfileOrigin, setRiskProfileOrigin] = useStateCallback<
    RiskProfileOriginEnum | undefined
  >(undefined);
  const dispatch = useAppDispatch();
  const { customer_risk } = useAppSelector((state) => state.riskProfile);
  const isFromOpenYourAccount = useAppSelector(
    (state) => state.riskProfile.isFromOpenYourAccount
  );
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (router.query.redirect)
      setRiskProfileOrigin(router.query.redirect as RiskProfileOriginEnum);
  }, []);

  const RiskProfile = RiskProfilesBg.find(
    (fundbg) =>
      fundbg.name ===
      ('customer_risk_profile' in customer_risk!
        ? customer_risk?.customer_risk_profile
        : customer_risk?.name)
  )!;

  const existInSpectrum = async () => {
    if (isFromOpenYourAccount) {
      router.push(ContextRoutesEnum.SUBSCRIPTION_TYPE_PARTICIPATE);
      dispatch(setIsFromOpenYourAccount(false));
      return;
    }
    router.push(ContextRoutesEnum.DASHBOARD);
    dispatch(setSidebar(ContextSidebarEnum.HOME));
  };

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout routeBack={() => router.push('/dashboard')}>
        <div className='w-full rounded-lg bg-white p-2'>
          <div className='relative'>
            <div
              style={{
                backgroundImage: `linear-gradient(147deg, ${RiskProfile?.from}, ${RiskProfile?.to})`,
              }}
              className='h-20 rounded  md:h-24'
            ></div>
            <div className='absolute -bottom-16 left-1/2 grid -translate-x-1/2 place-content-center rounded-full bg-white p-2 md:-bottom-10 md:left-6 md:translate-x-0'>
              <RiskProfile.icon className='scale-110' />
            </div>
            <div className='absolute right-6 top-1/2 grid -translate-y-1/2 place-content-center rounded-lg bg-white/20 p-2.5'>
              <IconStar fill='#FFFFFF' className='scale-150' />
            </div>
          </div>
          <div className='p-7'>
            <div className='mt-14 flex flex-col items-center text-primary-900 md:mt-6 md:block'>
              <p className='text-xl font-bold'>
                {'customer_risk_profile' in customer_risk!
                  ? customer_risk?.customer_risk_profile.toUpperCase()
                  : customer_risk?.name.toUpperCase()}{' '}
              </p>
              <p className='font-bold text-neutral-400'>
                {customer_risk?.subtitle.toUpperCase()}
              </p>
            </div>

            <div className='mt-5 hidden md:block'>
              <Button
                handleClick={() => existInSpectrum()}
                className='md:px-12'
                title='Continuar'
              />
            </div>
            <div className='mt-5 h-0.5 bg-neutral-100'></div>
            <div className='mt-5 text-primary-900'>
              <p className='mb-2 text-base font-bold'>Sobre este perfil</p>
              {customer_risk?.detail}
            </div>

            <div className='mt-5 flex md:hidden'>
              <Button
                className='w-full md:px-12'
                handleClick={() => existInSpectrum()}
                title='Continuar'
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

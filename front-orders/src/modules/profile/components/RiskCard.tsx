/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import React, { FC } from 'react';

import { IconStar } from '@/common/components/icons/dashboard';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { IProfilesRisk } from '@/common/interfaces';
import { setSelectedCustomerRisk } from '@/modules/dashboard/slice/riskProfileSlice';
import { RiskProfilesBg } from '@/modules/profile/utils/riskProfiles';

interface IProps {
  profile_risk?: IProfilesRisk;
  loading?: boolean;
}

export const RiskCard: FC<IProps> = ({ profile_risk, loading }) => {
  const dispatch = useAppDispatch();
  const selectedCustomerRisk = useAppSelector(
    (state) => state.riskProfile.selectedCustomerRisk
  );

  const RiskProfile = RiskProfilesBg.find(
    (fundbg) => fundbg.name === (profile_risk && profile_risk.name)
  )!;

  return (
    <>
      {loading && !profile_risk ? (
        <div className='col-span-12 mb-12 mr-2 animate-pulse rounded-lg border border-neutral-100 p-2 pb-6 md:col-span-4 md:mb-0 md:mr-0'>
          <div className='relative bg-neutral-50/80 p-8'>
            <div className='absolute -bottom-20 left-1/2 grid -translate-x-1/2 place-content-center rounded-full bg-white p-2 md:-bottom-16'>
              <div className='mt-6 h-20 w-20 rounded-full bg-neutral-200'></div>
            </div>
          </div>
          <div className='mx-4 mt-20 flex flex-col space-y-4'>
            <div className='flex flex-col items-center'>
              <div className='h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-4/12 rounded-full bg-neutral-200 md:w-4/12'></div>
            </div>
            <div className='mt-5 h-0.5 bg-neutral-100'></div>
            <div className='pb-10'>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-3 h-3 w-full rounded-full bg-neutral-200'></div>
              <div className='mt-1 h-3 w-full rounded-full bg-neutral-200'></div>
              <div className='mt-1 h-3 w-8/12 rounded-full bg-neutral-200'></div>
            </div>
          </div>
        </div>
      ) : (
        !loading &&
        profile_risk && (
          <div
            onClick={() => dispatch(setSelectedCustomerRisk(profile_risk))}
            className={clsx(
              'relative order-2 col-span-12 mb-12 mr-4 w-full cursor-pointer rounded-lg border-[1.5px] bg-white p-2 pb-6 md:order-1 md:col-span-4 md:mb-0 md:mr-0',
              selectedCustomerRisk?.id === profile_risk.id
                ? 'border-primary-400'
                : 'border-neutral-100'
            )}
          >
            <div className='relative'>
              <div
                style={{
                  backgroundImage: `linear-gradient(147deg, ${RiskProfile?.from}, ${RiskProfile?.to})`,
                }}
                className='h-20 rounded md:h-20'
              ></div>
              <div className='absolute -bottom-16 left-1/2 grid -translate-x-1/2 place-content-center rounded-full bg-white p-2 md:-bottom-16'>
                <RiskProfile.icon className='scale-110' />
              </div>
              {selectedCustomerRisk?.id === profile_risk.id ? (
                <div className='absolute right-6 top-3 grid place-content-center rounded-lg bg-white/20 p-2.5'>
                  <IconStar fill='#FFFFFF' className='scale-150' />
                </div>
              ) : (
                <div className='absolute right-6 top-3 grid place-content-center rounded-lg p-2.5'>
                  <IconStar className='scale-150' fill='#FFFFFF40' />
                </div>
              )}
            </div>
            <div className='p-7'>
              <div className='mt-14 flex flex-col items-center text-center text-primary-900 md:mt-14 md:block'>
                <p className='text-xl font-bold'>
                  {profile_risk.name.toUpperCase()}
                </p>
                <p className='font-bold text-neutral-400'>
                  {profile_risk.subtitle.toUpperCase()}
                </p>
              </div>
              <div className='mt-5 h-0.5 bg-neutral-100'></div>
              <div className='mt-5 text-primary-900'>
                <p className='mb-2 text-base font-bold'>Sobre el perfil</p>
                {profile_risk.detail}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect } from 'react';

import { Button } from '@/common/components';
import { IconRecommended } from '@/common/components/icons/products/IconRecommended';
import { GeneralStatusEnum } from '@/common/enums';
import {
  useAppSelector,
  useStateCallback,
  useWindowSize,
} from '@/common/hooks';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';

export const FundRecommended = () => {
  const sidebarOpened = useAppSelector((state) => state.layout.sidebarOpened);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const [showBadge, setShowBadge] = useStateCallback<boolean>(false);
  const { height } = useWindowSize();

  const { onHandleInvestment } = useRiskProfile(false);

  const { status } = currentUser || {};
  const isSuspended = status === GeneralStatusEnum.SUSPENDED;

  useLayoutEffect(() => {
    setShowBadge(false);
    setTimeout(() => {
      setShowBadge(true);
    }, 300);
  }, [sidebarOpened, height]);

  return (
    <>
      {showBadge ? (
        <div className='relative mb-3 flex flex-1 flex-col rounded-lg'>
          <IconRecommended className='absolute h-[105%] w-full rounded-lg ' />

          <div className='z-10 flex flex-col items-start justify-start space-y-5 rounded-lg px-10 pb-0 pl-6 pt-5'>
            <div className='rounded bg-white p-1.5 text-[11px] font-bold leading-none text-primary-700'>
              INVIERTE HOY
            </div>
            <p className='text-[22px] font-bold text-white'>
              Cumple tus objetivos con este Fondo Mutuo
            </p>
            <p className='text-base text-white'>
              Invierte ahora en este fondo recomendado para tu perfil de
              tolerancia al riesgo y alcanza tus metas de ahorro e inversión.{' '}
            </p>
            <div className='flex w-full items-center justify-center'>
              <Button
                title='Quiero invertir'
                alternative
                handleClick={() => {
                  onHandleInvestment(true);
                }}
                className='w-[70%]'
                disabled={isSuspended}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full animate-pulse rounded-[4px] bg-white bg-gradient-to-br p-3 text-white'>
          <div className='flex justify-between'>
            <div className='w-20 rounded-lg bg-neutral-200 p-4'></div>
          </div>

          <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
            <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
            <div className='mt-1 h-4 w-5/12 rounded-full bg-neutral-200'></div>
          </h6>
          <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
            <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
            <div className='mt-1 h-4 w-11/12 rounded-full bg-neutral-200'></div>
            <div className='mt-1 h-4 w-5/12 rounded-full bg-neutral-200'></div>
          </h6>
          <div className='py-3 pt-2'>
            <div className='mt-4 h-8 w-full rounded-full bg-neutral-200'></div>
          </div>
        </div>
      )}
    </>
  );
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';

import { IconHide } from '@/common/components/icons/dashboard/IconHide';
import { IconPasswordClosed } from '@/common/components/icons/dashboard/IconPasswordClosed';
import { IconInsights } from '@/common/components/icons/products/IconInsights';
import { convertAmount } from '@/common/helper';
import { useAppSelector, useStatePersist } from '@/common/hooks';
import { SpectrumMoneyTypeConverted } from '@/modules/home/enum/money.type.enum';

export const FundInvestment = () => {
  const subscriptionSlice = useAppSelector((state) => state.subscription);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const [showPassword, setShowPassword] = useStatePersist<boolean>(
    true,
    'detail-fund-' + subscriptionSlice.currentFund?.codFund
  );

  const currentFundSerie = subscriptionSlice.subscriptions?.funds_serie.find(
    (subscription) =>
      subscription.fund_id === subscriptionSlice.currentFund?.id &&
      subscription.serie_id === currentUser?.serie.id
  );

  // const currentInvestments = subscriptionSlice.subscriptions?.funds.find(
  //   (subscription) =>
  //     subscription.cod_fund === subscriptionSlice.currentFund?.codFund
  // );

  return (
    <>
      <div className='relative h-full rounded-lg bg-white px-6'>
        <div className='flex flex-col py-8 pb-6'>
          <div
            className='absolute flex h-6 cursor-pointer items-center space-x-1 self-end'
            onClick={() => setShowPassword(!showPassword)}
          >
            <div className='mb-0.5 scale-75'>
              {!showPassword ? (
                <IconPasswordClosed className='scale-95' fill='#0066CC' />
              ) : (
                <IconHide fill='#0066CC' />
              )}
            </div>
            <p className='font-bold leading-none text-prudential-500'>
              {showPassword ? 'Mostrar valores' : 'Ocultar valores'}
            </p>
          </div>
          <p className='mt-8 text-xl font-bold leading-none text-primary-900'>
            Resumen de inversión
          </p>
        </div>
        <div>
          <div className='flex items-center space-x-2'>
            <div className='rounded bg-[#BA93E1] p-1'>
              <IconInsights className='opacity-30' />
            </div>
            <p className='text-sm font-bold uppercase leading-[14px]  tracking-[0.14px] text-neutral-500'>
              Saldo actual
            </p>
          </div>
          <div className='mt-3'>
            <p className='text-2xl font-bold text-primary-900'>
              {SpectrumMoneyTypeConverted[
                currentFundSerie?.money_type as keyof typeof SpectrumMoneyTypeConverted
              ] + ' '}
              {showPassword
                ? '••••'
                : convertAmount(currentFundSerie?.current_balance ?? 0)}
            </p>
          </div>
        </div>
        {/* <div className='mt-10 pb-6'>
          <div className='flex items-center space-x-2'>
            <div className='rounded bg-[#56B2BD] p-1'>
              <IconPayments />
            </div>
            <p className='text-sm font-bold uppercase leading-[14px]  tracking-[0.14px] text-neutral-500'>
              Monto invertido{' '}
            </p>
          </div>
          <div className='mt-3'>
            <p className='text-2xl font-bold text-primary-900'>
              {SpectrumMoneyTypeConverted[
                currentInvestments?.money_type as keyof typeof SpectrumMoneyTypeConverted
              ] + ' '}
              {showPassword
                ? '••••'
                : convertAmount(currentInvestments!.current_balance!)}
            </p>
          </div>
        </div> */}
      </div>
    </>
  );
};

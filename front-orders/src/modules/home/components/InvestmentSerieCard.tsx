/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';

import { Button, Modal } from '@/common/components';
import { IconHide } from '@/common/components/icons/dashboard/IconHide';
import { IconPasswordClosed } from '@/common/components/icons/dashboard/IconPasswordClosed';
import IconInfo from '@/common/components/icons/utils/IconInfo';
import { Tooltip } from '@/common/components/Tooltip';
import { ContextRoutesEnum, ContextSplashEnum } from '@/common/enums';
import { convertAmount } from '@/common/helper';
import {
  useAppDispatch,
  useAppSelector,
  useStatePersist,
} from '@/common/hooks';
import { getDDMMYYYYFormat } from '@/common/utils/convert-date';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { SubscriptionFormEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setCurrentFund } from '@/modules/dashboard/slice/subscriptionSlice';
import { SpectrumConverted } from '@/modules/home/enum/money.type.enum';
import { FundProductBg } from '@/modules/home/utils/fundProducts';
import { setSplash } from '@/redux/common/layoutSlice';
import { IOrder } from '@/common/interfaces';

interface IProps {
  ordenItem: IOrder;
}

export const InvestmentSerieCard: FC<IProps> = ({ ordenItem }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.session.currentUser);

  const onHandleClickInvest = () => {
   
  };

  return (
    <div className='relative col-span-12 mb-10 flex flex-col rounded-t-2xl border-b-[10px] border-[#0066CC] bg-white p-4 px-5 pb-2 pt-10 md:col-span-6 md:mb-10 md:mr-0 md:p-4 md:pt-4'>
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${10}, ${50})`,
        }}
        className='relative hidden self-start rounded-[4px] p-1 text-white md:block'
      >
        <svg
          className='absolute right-0 top-0 w-full'
          width='100%'
          height='100%'
          viewBox='0 0 352 129'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M85.809 51.6909C53.2128 42.2386 15.0213 55.6294 0 63.5064V129H632V-25.9835C600.455 -20.5765 573.658 -21.9786 568.589 6.25821C564.454 29.2883 564.27 45.7097 542.302 50.5159C520.215 55.3478 507.377 27.0853 485.221 6.25821C467.496 -10.4035 437.644 11.2778 426.628 18.2201C407.1 30.3026 362.708 3.94054 343.47 -16.782C316 -46.3714 279.875 -49.0777 252.591 -16.782C225.308 15.5138 198.246 -10.9642 164.26 6.25821C130.275 23.4806 126.554 63.5064 85.809 51.6909Z'
            fill={`url(#12)`}
          />
          <defs>
            <linearGradient
              x1='316'
              y1='-40'
              x2='316'
              y2='129'
              gradientUnits='userSpaceOnUse'
            >
              {/* <stop stopColor={Fund?.gradient} stopOpacity='0.5' /> */}
              {/* <stop offset='1' stopColor={Fund?.gradient} stopOpacity='0' /> */}
            </linearGradient>
          </defs>
        </svg>
        <div className='relative flex justify-between overflow-hidden'></div>
      </div>
      <div>
        <h1 className='mt-4 text-lg font-bold text-primary-900'>
          <div className='hidden md:block'>{ordenItem.orderDate}</div>
          <div className='block md:hidden'>
            {(
              <>{ordenItem.orderNumber}</>
            )}
          </div>
        </h1>
        <p className='mt-1 text-primary-900 md:mt-6'>
          {ordenItem.customer }
        </p>
        <div className='mt-4 flex items-center space-x-1'>
          <p className='text-sm font-bold text-neutral-300'>SALDO ACTUAL</p>
          <Tooltip
            ButtonIcon={IconInfo}
            content='Suscripciones - Rescates + Rentabilidad'
            title='Saldo actual'
          />
        </div>
        <div className='relative mt-1 inline-flex space-x-1 md:mt-1.5'>
          <p className='relative h-10 text-2xl font-bold leading-none text-primary-900 md:text-[28px]'>
            {/* {SpectrumConverted[
              fundItem.money_type as keyof typeof SpectrumConverted
            ] + ' '}
            {showPassword ? convertAmount(fundItem.current_balance) : '****'} */}
            asdasdas
          </p>
        </div>
      </div>
      <div className='mt-2 flex items-center space-x-1'>
        <p className='text-sm font-bold text-neutral-300'>
          {`${new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }).format(ordenItem.id)} cuotas`}
        </p>
      </div>
      <div className='mt-2 flex items-center space-x-1'>
        <p className='text-sm font-bold text-neutral-300'>FECHA VALOR</p>
        <Tooltip
          ButtonIcon={IconInfo}
          content={getDDMMYYYYFormat(ordenItem.orderDate)}
          title='Fecha valor'
        />
      </div>
      <div className='flex items-start gap-2 rounded bg-[#F6F0FB] p-2'>
        <Image
          src='/icons/infoCard.svg'
          alt='info money transfer'
          width={20}
          height={20}
          className='mt-1 md:mt-0.5'
        />
        <span className='mt-1 text-sm font-semibold text-[#A36FD7]'>
          En caso cuente con operaciones pendientes, el monto será actualizado
          una vez que la operación haya sido procesada
        </span>
      </div>
    </div>
  );
};

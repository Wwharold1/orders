/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import React, { FC } from 'react';

import { IconHide } from '@/common/components/icons/dashboard/IconHide';
import { IconPasswordClosed } from '@/common/components/icons/dashboard/IconPasswordClosed';
import { convertAmount } from '@/common/helper';
import { useStatePersist } from '@/common/hooks';
import { IListItemFund } from '@/common/interfaces';
import { SpectrumConverted } from '@/modules/home/enum/money.type.enum';

interface IProps {
  fundItem: IListItemFund;
}

export const InvestmentCard: FC<IProps> = ({ fundItem }) => {
  const [showPassword, setShowPassword] = useStatePersist<boolean>(
    true,
    'investment-item-' + fundItem.cod_fund + '-' + fundItem.money_type
  );

  return (
    <div
      className={clsx(
        'col-span-12 mb-10 flex grow flex-col rounded-t bg-white  px-4 py-6 md:col-span-4 md:mb-0 ',
        fundItem.disabled && 'opacity-60'
      )}
    >
      <div>
        <p className='text-sm font-bold text-neutral-300'>MONTO INVERTIDO</p>
      </div>
      <div className='relative mt-1 inline-flex space-x-2 md:mt-1.5'>
        <div className='relative text-[28px] font-bold text-primary-900'>
          {SpectrumConverted[
            fundItem.money_type as keyof typeof SpectrumConverted
          ] + ' '}
          {showPassword ? convertAmount(fundItem.current_balance) : '****'}
          <div
            className={clsx(
              'absolute -right-12 -top-0 z-10 grid cursor-pointer place-content-center rounded-full p-2 hover:bg-gray-100 md:top-0'
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IconPasswordClosed className='scale-95' fill='#B8BFC3' />
            ) : (
              <IconHide fill='#B8BFC3' />
            )}
          </div>
        </div>
      </div>

      <h1 className='mt-4 hidden text-sm font-bold text-teal-terciary sm:block'>
        {fundItem.fund_description.toUpperCase()}
      </h1>
      <h1 className='mt-4 block text-sm font-bold text-teal-terciary sm:hidden'>
        {fundItem.fund_description
          .split(' ')
          .slice(0, fundItem.fund_description.split(' ').length - 1)
          .join(' ')
          .toUpperCase()}
        <br />
        {fundItem.fund_description
          .split(' ')
          [fundItem.fund_description.split(' ').length - 1].toUpperCase()}
      </h1>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { FC } from 'react';

import { useAppSelector } from '@/common/hooks';
import { IProfileFundsByCustomerData } from '@/common/interfaces/profile.interface';
import { FundProductBg } from '@/modules/home/utils/fundProducts';

interface IProps {
  fund: IProfileFundsByCustomerData;
}

export const AssociateProduct: FC<IProps> = ({ fund }) => {
  const { funds } = useAppSelector((state) => state.subscription);
  const Fund = FundProductBg.find(
    (fundbg) => fundbg.codFund === funds.find((e) => e.id === fund.id)?.codFund
  )!;
  return (
    <div
      onClick={() => window.open(fund.info_url, '_blank')}
      className='col-span-12 cursor-pointer rounded-lg bg-white p-4 pb-6 shadow-md md:col-span-4'
    >
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${Fund?.from}, ${Fund?.to})`,
        }}
        className='relative max-w-fit rounded-[4px] p-1.5 text-white'
      ></div>
      <p className='mt-4 text-lg font-bold leading-none'>{fund.title}</p>
    </div>
  );
};

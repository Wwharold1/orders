import clsx from 'clsx';
import React from 'react';

import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { ICollectorAccount } from '@/common/interfaces';
import { setCurrentCollector } from '@/modules/dashboard/slice/subscriptionSlice';

interface IProps {
  banks: ICollectorAccount[] | undefined;
  isLoading: boolean;
}

export const BankSmallCards = ({ banks, isLoading }: IProps) => {
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-8 lg:flex'>
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        banks?.map((bank) => <BankCard key={bank.bank_id} collector={bank} />)
      )}
    </div>
  );
};

interface IBankCardProps {
  collector?: ICollectorAccount;
}

const BankCard = ({ collector }: IBankCardProps) => {
  const dispatch = useAppDispatch();
  const { currentCollector } = useAppSelector((state) => state.subscription);

  return (
    <>
      {collector && (
        <div className='flex min-w-[100px] cursor-pointer items-center gap-2'>
          <div
            className='flex w-full items-center space-x-2 rounded-l'
            onClick={() => dispatch(setCurrentCollector(collector))}
          >
            <div
              className={clsx(
                'relative cursor-pointer rounded-full border-2 bg-white p-[7px]',
                currentCollector?.id === collector.id
                  ? 'border-[#0066CC]'
                  : 'border-neutral-200'
              )}
            >
              {currentCollector?.id === collector.id && (
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-[3.5px]'></div>
              )}
            </div>
            <label htmlFor={collector.bank.code}>
              <img
                className='cursor-pointer'
                style={{ maxHeight: '25px', width: 'auto' }}
                src={collector.logo_bank}
                alt={collector.bank.description}
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
};

const SkeletonLoading = () => (
  <>
    <div className='flex items-center gap-2'>
      <div className='h-4 w-4 animate-pulse rounded-full bg-gray-300'></div>
      <div className='h-8 w-32 animate-pulse rounded bg-gray-300'></div>
    </div>
    <div className='flex items-center gap-2'>
      <div className='h-4 w-4 animate-pulse rounded-full bg-gray-300'></div>
      <div className='h-8 w-32 animate-pulse rounded bg-gray-300'></div>
    </div>
    <div className='flex items-center gap-2'>
      <div className='h-4 w-4 animate-pulse rounded-full bg-gray-300'></div>
      <div className='h-8 w-32 animate-pulse rounded bg-gray-300'></div>
    </div>
  </>
);

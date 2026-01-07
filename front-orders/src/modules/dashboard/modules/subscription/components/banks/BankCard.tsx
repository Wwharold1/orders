import clsx from 'clsx';
import React, { FC } from 'react';

import { notifyInfo } from '@/common/components';
import { IconCheckCircle } from '@/common/components/icons/subscription/IconCheckCircle';
import { IconContentCopy } from '@/common/components/icons/subscription/IconContentCopy';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { ICollectorAccount } from '@/common/interfaces/subscription.interface';
import { setCurrentCollector } from '@/modules/dashboard/slice/subscriptionSlice';

interface IProps {
  collector?: ICollectorAccount;
  items?: number;
  loading?: boolean;
}

export const BankCard: FC<IProps> = ({ collector, loading }) => {
  const dispatch = useAppDispatch();
  const { currentCollector } = useAppSelector((state) => state.subscription);

  const isSelected = collector ? currentCollector?.id === collector.id : null;

  return (
    <>
      {loading && !collector ? (
        <div
          className={clsx(
            'col-span-12 mb-12 mr-2 animate-pulse rounded-lg border border-neutral-100 p-2 pb-6 md:mb-0 md:mr-0 lg:col-span-6'
          )}
        >
          <div className='bg-neutral-50/80 p-4'>
            <div className='h-6 w-3/12 rounded-lg bg-neutral-200 md:w-3/12'></div>

            <div className='mt-6 h-4 w-6/12 rounded-full bg-neutral-200 md:w-6/12'></div>
          </div>
          <div className='mx-4 mt-6 flex flex-col space-y-4'>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
            </div>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-2/12 rounded-full bg-neutral-200 md:w-2/12'></div>
            </div>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-5/12 rounded-full bg-neutral-200 md:w-5/12'></div>
            </div>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-8/12 rounded-full bg-neutral-200 md:w-8/12'></div>
            </div>
          </div>
        </div>
      ) : (
        !loading &&
        collector && (
          <div
            className={clsx(
              'relative col-span-12 mb-12 mr-4 cursor-pointer rounded-lg border-[1.5px] p-2 pb-6 md:mb-0 md:mr-0 lg:col-span-6',
              isSelected ? 'border-primary-400' : 'border-neutral-100'
            )}
            onClick={() => dispatch(setCurrentCollector(collector))}
          >
            {isSelected && (
              <IconCheckCircle className='absolute -right-5 -top-5 z-30 md:z-20' />
            )}
            <div className='bg-neutral-50/80 p-4'>
              <img
                style={{ maxHeight: '25px', width: 'auto' }}
                src={collector.logo_bank}
                alt={collector.bank.description}
              />
              <p className='mt-4 font-bold text-neutral-400'>
                {collector.bank.description.toUpperCase()}
              </p>
            </div>
            <div className='mx-4 mt-6 flex flex-col space-y-4'>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>
                  TIPO DE CUENTA
                </h1>
                <p className='text-lg font-bold text-primary-900'>
                  {collector.type_account.description}
                </p>
              </div>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>MONEDA</h1>
                <p className='text-lg font-bold text-primary-900'>
                  {collector.moneda}
                </p>
              </div>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>
                  NÚMERO DE CUENTA
                </h1>
                <div className='relative inline-flex'>
                  <p className='relative text-lg font-bold text-primary-900'>
                    {collector.cca}
                  </p>
                  <div
                    className={clsx(
                      'absolute -right-10 -top-1 z-10 grid cursor-pointer place-content-center rounded-full p-2 hover:bg-gray-100 '
                    )}
                    onClick={() => {
                      navigator.clipboard.writeText(collector.cca);
                      notifyInfo({
                        subtitle: '¡Los datos se copiaron!',
                      });
                    }}
                  >
                    <IconContentCopy />
                  </div>
                </div>
              </div>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>
                  NÚMERO DE CCI
                </h1>
                <div className='relative inline-flex'>
                  <p className='relative text-lg font-bold text-primary-900'>
                    {collector.cci}
                  </p>
                  <div
                    className={clsx(
                      'absolute -right-10 -top-1 z-10 grid cursor-pointer place-content-center rounded-full p-2 hover:bg-gray-100 '
                    )}
                    onClick={() => {
                      navigator.clipboard.writeText(collector.cci);
                      notifyInfo({
                        subtitle: '¡Los datos se copiaron!',
                      });
                    }}
                  >
                    <IconContentCopy />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export enum BankWidthEnum {
  '00000025' = 132,
  '00000021' = 95,
  '00000419' = 132,
}

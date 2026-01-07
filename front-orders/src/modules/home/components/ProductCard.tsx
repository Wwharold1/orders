/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { IconStar } from '@/common/components/icons/dashboard/IconStar';
import { ContextRoutesEnum } from '@/common/enums';
import { firstLetterUppercase } from '@/common/helper';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { IFund } from '@/common/interfaces';
import { setCurrentFund } from '@/modules/dashboard/slice/subscriptionSlice';
import { FundProductBg } from '@/modules/home/utils/fundProducts';

interface IProps {
  fund?: IFund;
  loading?: boolean;
  items?: number;
}

export const ProductCard: FC<IProps> = ({ fund, loading }) => {
  const { recommendedFunds } = useAppSelector((state) => state.subscription);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // const currentUser = useAppSelector((state) => state.session.currentUser);
  // const currentRisk = useAppSelector((state) => state.riskProfile);

  const { funds } = useAppSelector((state) => state.subscription);

  const Fund = FundProductBg.find(
    (fundbg) => fundbg.codFund === (fund && fund.codFund)
  )!;
  const imageCard =
    funds.find((item: IFund) => item.codFund === fund?.codFund)?.imageCard ??
    null;
  // const hasPDR =
  //   !!currentUser?.risk_profile_id || currentRisk.customer_risk
  //     ? 'risk_profile_id' in currentRisk.customer_risk!
  //       ? !!currentRisk.customer_risk?.risk_profile_id
  //       : !!currentRisk.customer_risk?.id
  //     : false;

  return (
    <div
      onClick={() => {
        if (!loading && fund) {
          dispatch(setCurrentFund(fund));
          router.push(ContextRoutesEnum.PRODUCTS_FUND_DETAIL);
        }
      }}
      className={clsx(
        ' mb-10 flex grow cursor-pointer rounded-lg bg-white p-1 md:col-span-4 '
      )}
    >
      {!loading && fund ? (
        <div className='w-full'>
          {Fund && (
            <div
              style={{
                backgroundImage: `url(${imageCard})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                height: '150px',
              }}
              className='relative w-full rounded-[4px] p-3 text-white'
            >
              <div className='relative flex justify-between overflow-hidden'>
                {recommendedFunds.map((e) => e.id).includes(fund.id) && (
                  <div className='grid h-5 place-content-center rounded-lg bg-white/20 p-1.5 py-3'>
                    <IconStar fill='#FFFFFF' />
                  </div>
                )}
              </div>

              <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
                <div className='hidden md:block'>
                  {fund.title
                    .split(' ')
                    .slice(0, fund.title.split(' ').length - 1)
                    .join(' ')}
                  <br />
                  {fund.title.split(' ')[fund.title.split(' ').length - 1]}
                </div>
                <div className='block md:hidden'>
                  {fund.title.length > 40 ? (
                    <>{fund.title}</>
                  ) : (
                    <>
                      {fund.title
                        .split(' ')
                        .slice(0, fund.title.split(' ').length - 1)
                        .join(' ')}
                      <br />
                      {fund.title.split(' ')[fund.title.split(' ').length - 1]}
                    </>
                  )}
                </div>
              </h6>
              <p>{fund.structure.sub_description}</p>
            </div>
          )}
          <div className='px-3 py-6'>
            <div className='flex items-center justify-end'>
              <div
                className='flex h-4 min-w-min items-center justify-center rounded p-2 py-3 pb-2.5 text-sm leading-none'
                style={{
                  color: fund.structure?.riskLevel.color,
                  backgroundColor: fund.structure?.riskLevel.color + '20',
                }}
              >
                <p>{firstLetterUppercase(fund.structure?.riskLevel.name)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full animate-pulse rounded-[4px] bg-gradient-to-br p-3 text-white'>
          <div className='flex justify-between'>
            <div className='rounded-full bg-neutral-200 p-4'></div>
            <div className='rounded-full bg-neutral-200 p-4'></div>
          </div>

          <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
            <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
            <div className='mt-1 h-5 w-5/12 rounded-full bg-neutral-200'></div>
          </h6>
          <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
          <div className='py-3 pt-2'>
            <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
            <div className='mt-1 flex justify-between'>
              <div className='h-5 w-5/12 rounded-full bg-neutral-200'></div>
              <div className='h-4 w-2/12 rounded-full bg-neutral-200'></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

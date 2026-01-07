/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import React from 'react';

import { Accordion } from '@/common/components/Accordion';
import { useAppSelector } from '@/common/hooks';

export const FundBenchmarkMonth = () => {
  const { currentFund } = useAppSelector((state) => state.subscription);

  const BenchmarkContent = () => {
    return (
      <>
        {currentFund?.structure.performance.monthCards.map((e, index) => {
          return (
            <div key={index} className='grid h-full grid-cols-2 gap-1 pb-1'>
              <p className='flex items-center justify-center bg-primary-50 p-2.5 text-center font-bold'>
                {e.year}
              </p>
              {Number(e.total) ? (
                <p className='flex items-center justify-center bg-[#E2F4FF40] p-2.5 text-center'>
                  {Number(e.total).toFixed(2)} %
                </p>
              ) : (
                <p className='flex items-center justify-center bg-[#E2F4FF40] p-2.5 text-center italic text-primary-300'>
                  Sin información
                </p>
              )}
            </div>
          );
        })}
      </>
    );
  };

  // Rendimiento BenchmarkContent
  return (
    <>
      <div
        className={clsx(
          'hidden h-full rounded-lg bg-white px-6 py-8 text-primary-900',
          'flex-col md:flex'
        )}
      >
        <p className='mb-6 text-xl font-bold leading-none text-primary-900'>
          {currentFund?.structure.performance.monthTitle}
        </p>
        {BenchmarkContent()}
      </div>
      <div className='sm:block md:hidden'>
        <Accordion title={currentFund!.structure.performance.monthTitle}>
          <div className='flex w-full flex-col space-y-1 bg-white px-6 py-8'>
            {BenchmarkContent()}
          </div>
        </Accordion>
      </div>
    </>
  );
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import React from 'react';

import { Accordion } from '@/common/components/Accordion';
import { useAppSelector } from '@/common/hooks';

export const FundResults = () => {
  const { currentFund } = useAppSelector((state) => state.subscription);

  const BenchmarkContent = () => {
    return (
      <>
        {currentFund?.structure.results.data.map((data, index) => {
          return (
            <div key={index} className='grid h-full grid-cols-2 gap-1 pb-1'>
              <p className='flex items-center justify-center bg-primary-50 p-2.5 text-center font-bold'>
                {data.description.trim()}
              </p>

              {Number(data.total) ? (
                <p className='flex items-center justify-center bg-[#E2F4FF40] py-2.5 text-center'>
                  {Number(data.total).toFixed(2)} %
                </p>
              ) : (
                <p className='flex items-center justify-center bg-[#E2F4FF40] py-2.5 text-center italic text-primary-300'>
                  Sin información
                </p>
              )}
            </div>
          );
        })}
      </>
    );
  };

  // Rendimientos
  return (
    <>
      <div
        className={clsx(
          'mt-0 hidden rounded-lg bg-white px-6 py-8 text-primary-900',
          'h-full flex-col md:flex'
        )}
      >
        <p className='mb-6 text-xl font-bold leading-none text-primary-900'>
          {currentFund?.structure.results.title}
        </p>
        {BenchmarkContent()}
      </div>
      <div className='sm:block md:hidden'>
        <Accordion title={currentFund!.structure.results.title}>
          <div className='flex w-full flex-col space-y-1 bg-white px-6 py-8'>
            {BenchmarkContent()}
          </div>
        </Accordion>
      </div>
    </>
  );
};

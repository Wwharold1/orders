/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react';

import { Accordion } from '@/common/components/Accordion';
import { LineChart } from '@/common/components/charts/LineChart';
import { useAppSelector } from '@/common/hooks';

export const FundBenchmarkYears = () => {
  const { currentFund } = useAppSelector((state) => state.subscription);

  const labels = [...currentFund!.structure.performance.data]
    .sort((a, b) => Number(a.year) - Number(b.year))
    .map((e) => e.year);

  const dataLineChart = [...currentFund!.structure.performance.data]
    .sort((a, b) => Number(a.year) - Number(b.year))
    .map((e) => Number(e.total));

  return (
    <>
      <div className='hidden h-full w-full rounded-lg bg-white px-6 pb-6 md:block'>
        <div className='py-8 pb-6'>
          <p className='text-xl font-bold leading-none text-primary-900'>
            {currentFund?.structure.performance.title}
          </p>
          {/* <small className='text-sm leading-none text-gray-500'>
            {currentFund?.structure.performance.description}
          </small> */}
        </div>
        <div
          className=''
          style={{
            height: '50vh',
            maxHeight: '60vh',
            width: '99%',
          }}
        >
          <LineChart labels={labels} chartData={dataLineChart!} />
        </div>
      </div>
      <div className='md:hidden'>
        <Accordion title={currentFund!.structure.performance.title}>
          <div className='rounded-lg px-6 pb-6'>
            <div className='h-60 w-full'>
              <LineChart
                gradientPower={200}
                labels={labels}
                chartData={dataLineChart!}
              />
            </div>
          </div>
        </Accordion>
      </div>
    </>
  );
};

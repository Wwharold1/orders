/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react';

import { Accordion } from '@/common/components/Accordion';
import { DoughnutChart } from '@/common/components/charts/DoughnutChart';
import { useAppSelector } from '@/common/hooks';
import { IFund } from '@/common/interfaces';

interface Props {
  isBriefcaseVisibility: boolean;
  isInvStrategyVisibility: boolean;
}

export const FundStrategy = ({
  isBriefcaseVisibility,
  isInvStrategyVisibility,
}: Props) => {
  const { currentFund } = useAppSelector((state) => state.subscription);
  const investment = generateData(currentFund!, 'investmentStrategy');
  const briefcase = generateData(currentFund!, 'briefcase');
  const legalInformation =
    currentFund?.structure.investmentStrategy.legalInformation;

  const FundContent = () => {
    return (
      <>
        <div className='w-full text-primary-900'>
          <section className='grid grid-cols-1 gap-6 pb-6 xl:grid-cols-2'>
            {isInvStrategyVisibility && (
              <figure
                className={`${
                  isBriefcaseVisibility ? 'col-span-1' : 'col-span-2'
                }`}
              >
                <div className='text-center'>
                  <p className='font-bold' style={{ fontSize: '18px' }}>
                    {currentFund?.structure.investmentStrategy.strategyTitle}
                  </p>
                </div>
                <DoughnutChart
                  labels={investment.labels!}
                  chartData={investment.values!}
                  colors={investment.colors!}
                  sum={investment.sum!}
                />
              </figure>
            )}
            {isBriefcaseVisibility && (
              <figure
                className={`border-l-0 border-t-2 border-t-neutral-100 pt-4 xl:border-t-0 xl:border-l-neutral-100 xl:pt-0 ${
                  isInvStrategyVisibility
                    ? 'col-span-1 xl:border-l-2'
                    : 'col-span-2 xl:border-l-0'
                } `}
              >
                <div className='text-center'>
                  <p className='font-bold' style={{ fontSize: '18px' }}>
                    {currentFund?.structure.briefcase.title}
                  </p>
                </div>
                <DoughnutChart
                  labels={briefcase.labels!}
                  chartData={briefcase.values!}
                  colors={briefcase.colors!}
                  sum={briefcase.sum!}
                />
              </figure>
            )}
          </section>

          <div className='mb-6 h-0.5 w-full bg-neutral-100'></div>

          <p className='text-justify text-xs leading-normal text-neutral-500'>
            <>
              {legalInformation &&
              legalInformation.includes('www.prudentialsaf.com.pe') ? (
                <>
                  {legalInformation
                    .split(/(www\.prudentialsaf\.com\.pe)/)
                    .map((text, index) => {
                      if (text === 'www.prudentialsaf.com.pe') {
                        return (
                          <a
                            href='https://www.prudentialsaf.com.pe'
                            key={index}
                            className='text-blue-500 '
                          >
                            {text}
                          </a>
                        );
                      } else {
                        return text;
                      }
                    })}
                </>
              ) : (
                legalInformation
              )}
            </>
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      {isBriefcaseVisibility || isInvStrategyVisibility ? (
        <>
          <div className='hidden rounded-lg bg-white px-6 pb-8 md:block'>
            <div className='py-8 pb-6'>
              <p className='text-xl font-bold leading-none text-primary-900'>
                {currentFund?.structure.investmentStrategy.graphicTitle}
              </p>
            </div>
            {FundContent()}
          </div>

          <div className='md:hidden'>
            <Accordion
              title={currentFund!.structure.investmentStrategy.graphicTitle}
            >
              <div className='rounded-lg px-3 pb-6'>
                {/* <p className='mt-3 text-sm text-neutral-500'>
                    {currentFund?.structure.performance.description}
                  </p> */}

                {FundContent()}
              </div>
            </Accordion>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const generateData = (
  currentFund: IFund,
  property: 'investmentStrategy' | 'briefcase'
) => {
  const labels = currentFund?.structure[property].data.map((e) => e.name);
  const values = currentFund?.structure[property].data.map((e) =>
    Number(e.graphicValue)
  );
  const sum = values?.reduce((acc, el) => acc + el);
  const colors = currentFund?.structure[property].data.map((e) => e.color);

  return {
    labels,
    values,
    sum,
    colors,
  };
};

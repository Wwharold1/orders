/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';

import { Accordion } from '@/common/components/Accordion';
import { SpectrumSerieEnum } from '@/common/enums/spectrum-customer.enum';
import { useAppSelector } from '@/common/hooks';
import { fundDistributiveFundEnum } from '@/modules/dashboard/modules/subscription/enum/distributiveFund.enum';
interface Props {
  selectedTab: number;
}
export const FundFeatures: React.FC<Props> = ({ selectedTab }) => {
  const { currentUser } = useAppSelector((state) => state.session);
  const { currentFund } = useAppSelector((state) => state.subscription);
  const isDistributiva =
    currentFund?.codFund === fundDistributiveFundEnum.codFund;

  const FeatureContent = () => {
    return (
      <>
        <>
          {currentFund?.structure.content.features.data.map(
            (features, index) => {
              const value = isDistributiva
                ? features[selectedTab === 0 ? 'description' : 'habitat']
                : features[
                    currentUser?.serie.codigo === SpectrumSerieEnum.A
                      ? 'description'
                      : 'habitat'
                  ];

              return (
                <div key={index} className='mt-2'>
                  <div className='grid grid-cols-12 text-sm'>
                    <p
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? '#F8F9F966' : 'white',
                      }}
                      className='col-span-6 px-6 py-5 font-bold leading-none text-neutral-300'
                    >
                      {features.title.toUpperCase()}
                    </p>
                    <p
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? '#F8F9F966' : 'white',
                      }}
                      className='col-span-6 px-6 py-5 leading-none text-primary-900'
                    >
                      {value}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </>
        {currentFund?.structure.content.features.data.map((features, index) => {
          return (
            <div key={index} className='mt-2'>
              <div className='grid grid-cols-12 text-sm'>
                <p
                  style={{
                    backgroundColor: index % 2 === 0 ? '#F8F9F966' : 'white',
                  }}
                  className='col-span-6 px-6 py-5 font-bold leading-none text-neutral-300'
                >
                  {features.title.toUpperCase()}
                </p>
                <p
                  style={{
                    backgroundColor: index % 2 === 0 ? '#F8F9F966' : 'white',
                  }}
                  className='col-span-6 px-6 py-5 leading-none text-primary-900'
                >
                  {
                    features[
                      currentUser?.serie.codigo === SpectrumSerieEnum.A
                        ? 'description'
                        : 'habitat'
                    ]
                  }
                </p>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className='hidden rounded-lg bg-white pb-2 md:block'>
        <div className='border-b border-neutral-50 px-6 py-8 pb-3'>
          <p className='text-xl font-bold text-primary-900'>
            {currentFund?.structure.content.features.title}{' '}
          </p>
        </div>
        {FeatureContent()}
      </div>
      <div className='md:hidden'>
        <Accordion title={currentFund!.structure.content.features.title}>
          {FeatureContent()}
        </Accordion>
      </div>
    </>
  );
};

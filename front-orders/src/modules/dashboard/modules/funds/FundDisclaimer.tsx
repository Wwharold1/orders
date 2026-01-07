/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';

import { useAppSelector } from '@/common/hooks';

export const FundDisclaimer = () => {
  const { currentFund } = useAppSelector((state) => state.subscription);

  return (
    <div className='rounded-lg bg-white px-6 pb-6'>
      <div className='py-8 pb-6'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          {currentFund?.structure.content.disclaimerTitle}
        </p>
      </div>
      <p className='text-left text-neutral-500'>
        <>
          {currentFund!.structure.content.disclaimer &&
          currentFund!.structure.content.disclaimer.includes(
            'www.prudentialsaf.com.pe'
          ) ? (
            <>
              {currentFund!.structure.content.disclaimer
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
            currentFund!.structure.content.disclaimer
          )}
        </>
      </p>
    </div>
  );
};

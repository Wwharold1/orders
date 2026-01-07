/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';

import { IconDocument } from '@/common/components/icons/products/IconDocument';
import { useAppSelector } from '@/common/hooks';

export const FundDescription = () => {
  const { currentFund } = useAppSelector((state) => state.subscription);

  return (
    <>
      <div className='h-full rounded-lg bg-white px-6'>
        <div className='py-8 pb-6'>
          <p className='text-xl font-bold leading-none text-primary-900'>
            {currentFund?.structure?.riskLevel.informationTitle}
          </p>
        </div>
        <div className=' text-primary-900'>
          <p className='text-sm'>
            <>
              {currentFund?.structure.description &&
              currentFund?.structure.description.includes(
                'www.prudentialsaf.com.pe'
              ) ? (
                <>
                  {currentFund?.structure.description
                    .split(/(www\.prudentialsaf\.com\.pe)/)
                    .map((text, index) => {
                      if (text === 'www.prudentialsaf.com.pe') {
                        return (
                          <a
                            href='https://www.prudentialsaf.com.pe'
                            key={index}
                            className='text-blue-500'
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
                currentFund?.structure.description
              )}
            </>
          </p>
        </div>
        <a
          href={currentFund?.structure.content.document}
          target='_blank'
          className='inline-flex cursor-pointer items-center justify-start space-x-1.5 py-8'
        >
          <p className='font-bold leading-none text-[#0066CC]'>
            Ver documentos informativos
          </p>
          <IconDocument className='mb-1' />
        </a>
      </div>
    </>
  );
};

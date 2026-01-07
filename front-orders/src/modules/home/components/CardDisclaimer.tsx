import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { FC } from 'react';

import { Card } from '@/common/components';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { IConfigurationListResponse } from '@/common/interfaces';
import { setConfiguration } from '@/redux/common/globalSlice';
import { GlobalService } from '@/services';

interface IProps {
  withPDR: boolean;
}

export const CardDisclaimer: FC<IProps> = ({ withPDR }) => {
  const disclaimer = useAppSelector((state) => state.global.disclaimer);

  const dispatch = useAppDispatch();

  const { isLoading, isFetching, isError } =
    useQuery<IConfigurationListResponse>(
      ['configuration-list'],
      () => GlobalService().configurationList(),
      {
        staleTime: 60000,
        refetchOnWindowFocus: false,
        onSuccess: ({ data }) => {
          dispatch(setConfiguration(data));
        },
      }
    );

  const loadingDisclaimer = (isLoading || isFetching) && !isError;

  return (
    <div className={clsx('mb-8', withPDR && 'mt-8 md:mt-20')}>
      {loadingDisclaimer ? (
        <div className='relative flex flex-col items-start rounded-xl bg-white px-6 py-6 text-primary-900 lg:pr-16'>
          <div className='h-full w-full animate-pulse'>
            <p className='mb-3 h-4 w-2/12 rounded-full bg-neutral-200 text-lg font-bold md:text-xl'></p>
            <div className='flex h-full w-full flex-col space-y-1'>
              <p className='h-4 w-full rounded-full bg-neutral-200 text-lg font-bold md:text-xl'></p>
              <p className='h-4 w-full rounded-full bg-neutral-200 text-lg font-bold md:text-xl'></p>
              <p className='h-4 w-full rounded-full bg-neutral-200 text-lg font-bold md:text-xl'></p>
              <p className='h-4 w-6/12 rounded-full bg-neutral-200 text-lg font-bold md:text-xl'></p>
            </div>
          </div>
        </div>
      ) : (
        <Card
          title='Disclaimer'
          content={
            disclaimer && disclaimer.includes('www.prudentialsaf.com.pe') ? (
              <>
                {disclaimer
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
              disclaimer
            )
          }
          size={1}
          contentColor='text-neutral-500'
        />
      )}
    </div>
  );
};

export const prudentialUrl = ({
  text,
  bolded,
}: {
  text: string;
  bolded: string;
}) => {
  const parts = text.split(bolded);

  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index <= parts.length - 1 && (
            <a
              href={bolded.replace('www.', 'https://')}
              target='_blank'
              className='cursor-pointer text-primary-500'
            >
              {' ' + bolded}
            </a>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

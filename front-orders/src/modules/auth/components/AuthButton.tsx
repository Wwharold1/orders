/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

import { Spinner } from '@/common/components/Spinner';

interface IProps {
  disabled?: any;
  loader?: boolean;
  link?: string;
  title?: string;
  customFunction?: any;
  onlySubButton?: boolean;
  subButton?: boolean;
  subButtonText?: string;
  subButtonExtraText?: string;
  subButtonLink?: string;
  subButtonDisabled?: any;
  subButtonCustomFunction?: any;
  subButtonLoader?: boolean;
  largeText?: boolean;
  iconEnd?: string;
  iconStart?: string;
  alternative?: boolean;
  grouped?: boolean;
}

export const AuthButton: FC<IProps> = ({
  disabled,
  loader,
  title,
  onlySubButton = false,
  subButton,
  subButtonExtraText,
  subButtonText,
  subButtonLink,
  subButtonDisabled,
  link,
  customFunction,
  subButtonCustomFunction,
  subButtonLoader,
  largeText = false,
  iconEnd,
  iconStart,
  alternative,
  grouped,
}) => {
  return (
    <div
      className={clsx(
        'mt-10 flex flex-col items-center justify-end space-y-5 self-center justify-self-end ',
        !grouped && 'grow'
      )}
    >
      {link ? (
        <Link
          href={link}
          className={clsx(
            disabled ? 'bg-prudential-500/50' : 'bg-prudential-500',
            largeText ? 'px-10' : 'px-20',
            'group relative flex items-center justify-center  rounded-full  py-2.5 text-[16px] font-semibold text-white focus-visible:outline  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 md:px-36'
          )}
        >
          {loader && <Spinner />}
          <p>{title}</p>
        </Link>
      ) : (
        !onlySubButton && (
          <button
            type={customFunction ? 'button' : 'submit'}
            className={clsx(
              disabled ? 'bg-prudential-500/50' : 'bg-prudential-500',
              largeText ? 'px-10' : 'px-20',
              alternative &&
              '!border-2 !border-prudential-500 !bg-white !text-prudential-500',
              'group relative flex items-center justify-center rounded-full py-2.5 pb-2 text-[16px] font-semibold text-white focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:px-28 md:px-36'
            )}
            onClick={() => customFunction && customFunction()}
            disabled={disabled}
          >
            {iconStart && (
              <Image
                src={iconStart}
                className='mb-0.5 mr-3'
                alt='check'
                width={14}
                height={14}
              />
            )}
            {loader && <Spinner />}
            <p>{title}</p>
            {iconEnd && (
              <Image
                src={iconEnd}
                className='mb-0.5 ml-3'
                alt='check'
                width={14}
                height={14}
              />
            )}
          </button>
        )
      )}
      {subButton && subButtonLink && (
        <div className='text-[16px] font-bold leading-6'>
          <span className='text-[#222729]'>{subButtonExtraText}</span>

          <React.Fragment>
            <Link
              href=''
              className='ml-2 cursor-pointer text-prudential-500'
            >
              {subButtonText}
            </Link>
          </React.Fragment>
        </div>
      )}
      {subButton && subButtonCustomFunction && (
        <div className='flex items-center text-[16px] font-bold leading-6'>
          {subButtonLoader && <Spinner />}

          <a
            onClick={() => subButtonCustomFunction()}
            className={clsx(
              subButtonDisabled
                ? 'pointer-events-none  text-blue-300'
                : 'cursor-pointer text-prudential-500'
            )}
          >
            Volver a enviar
          </a>
        </div>
      )}
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC } from 'react';

import { Spinner } from '@/common/components/Spinner';

interface IProps {
  disabled?: boolean;
  alternative?: boolean;
  title: string;
  className?: string;
  handleClick?: any;
  noBorder?: boolean;
  loader?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  iconEnd?: string;
  iconStart?: string;
}

export const Button: FC<IProps> = ({
  disabled,
  alternative,
  title,
  className,
  handleClick,
  noBorder,
  loader,
  type,
  iconEnd,
  iconStart,
}) => {
  return (
    <button
      type={type ?? 'button'}
      className={clsx(
        disabled ? 'bg-prudential-500/50' : 'bg-prudential-500',
        alternative && '!bg-white !text-prudential-500 !ring-prudential-500',
        noBorder && '!outline-none !ring-0',
        alternative && !noBorder && '!ring-2',
        'group relative flex items-center justify-center rounded-full px-10 py-2.5 pb-2 text-[16px] font-semibold text-white focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-[98%] md:px-10',
        className
      )}
      onClick={handleClick}
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
  );
};

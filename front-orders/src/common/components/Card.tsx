/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import React, { FC, SVGProps } from 'react';

import { Button } from '@/common/components/Button';

interface IProps {
  title: string;
  content: string | JSX.Element;
  buttonTitle?: string;
  size?: 1 | 2;
  IconEnd?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  classNameIcon?: string;
  contentColor?: string;
  buttonHandleClick?: any;
  className?: string;
  buttonClassName?: string;
  buttonDisabled?: boolean;
}

export const Card: FC<IProps> = ({
  title,
  content,
  IconEnd,
  buttonTitle,
  size,
  contentColor,
  buttonHandleClick,
  className,
  classNameIcon,
  buttonClassName,
  buttonDisabled,
}) => {
  return (
    <div
      className={clsx(
        'relative flex flex-col items-start rounded-xl bg-white px-4 pt-6 text-primary-900 md:px-6 lg:pr-16',
        HeighCardEnum[(size ?? 2) as keyof typeof HeighCardEnum] as string,
        className
      )}
    >
      <p
        className={clsx(
          `text-lg font-bold md:text-xl`,
          MarginBottomEnum[
            (size ?? 2) as keyof typeof MarginBottomEnum
          ] as string
        )}
      >
        {title}
      </p>
      <p
        className={clsx(
          'mb-3 text-base font-light md:mb-0',
          contentColor ?? ''
        )}
      >
        {content}
      </p>
      {buttonTitle && (
        <div
          className={clsx(
            'mt-3 flex grow flex-col items-end md:mt-6',
            size === 1 && 'md:!mt-5'
          )}
        >
          <Button
            className={buttonClassName}
            handleClick={buttonHandleClick}
            title={buttonTitle}
            disabled={buttonDisabled}
          />
        </div>
      )}
      {IconEnd && (
        <div
          className={clsx(
            'absolute -bottom-[30px] right-0 scale-50 md:bottom-0 md:right-6 md:scale-100',
            classNameIcon
          )}
        >
          <IconEnd />
        </div>
      )}
    </div>
  );
};

const MarginBottomEnum = {
  2: 'mb-6 md:mb-3',
  1: 'mb-3 md:mb-3',
};
const HeighCardEnum = {
  2: 'h-48 md:h-56',
  1: 'pb-6',
};

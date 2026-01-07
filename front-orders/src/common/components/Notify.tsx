/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import { MdOutlineClose, MdOutlineWarningAmber } from 'react-icons/md';

import { IconConfirmed } from '@/common/components/icons/utils/IconConfirmed';

interface IProps {
  title?: string;
  subtitle?: string;
  bolded?: string;
  Icon?: IconType;
  IconComponent?: any;
  extended?: any;
}

export const notifyError = ({ title, subtitle, bolded, Icon }: IProps) =>
  toast.custom(
    (t) => {
      return (
        <Transition
          appear
          show={t.visible}
          className={clsx(
            'flex w-full transform rounded border border-terciary-300 bg-[#FFF5F5] p-4 pb-2.5 shadow-lg',
            subtitle && subtitle.trim().length < 50 ? 'md:w-1/2' : 'md:w-4/6'
          )}
          enter='transition-all duration-150'
          enterFrom='opacity-0 scale-50'
          enterTo='opacity-100 scale-100'
          leave='transition-all duration-150'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-75'
        >
          {Icon ? (
            <Icon size={20} className='mb-1 text-terciary-900' />
          ) : (
            <MdOutlineWarningAmber
              size={20}
              className='mb-1 text-terciary-900'
            />
          )}
          <div className='ml-4 flex w-full cursor-default flex-col items-start justify-center'>
            <h1 className='text-base font-bold leading-none tracking-wider text-terciary-900'>
              {title}
            </h1>
            {subtitle && (
              <p
                className={clsx(
                  'text-sm font-medium leading-relaxed tracking-wider text-terciary-900',
                  title && 'mt-1'
                )}
              >
                {bolded ? (
                  <BoldedText text={subtitle} bolded={bolded} />
                ) : (
                  subtitle
                )}
              </p>
            )}
          </div>
          <div
            className='absolute right-3 top-3 cursor-pointer text-lg'
            onClick={() => toast.dismiss(t.id)}
          >
            <MdOutlineClose size={20} className='text-terciary-300' />
          </div>
        </Transition>
      );
    },
    { id: 'error-notification', position: 'top-center', duration: 3000 }
  );

export const notifyInfo = ({
  title,
  subtitle,
  bolded,
  Icon,
  IconComponent,
  extended,
}: IProps) =>
  toast.custom(
    (t) => (
      <Transition
        appear
        show={t.visible}
        className={clsx(
          'flex w-full transform rounded border border-[#007BC3] bg-[#F6FCFF] p-4 pb-2.5 shadow-lg',
          subtitle && subtitle.trim().length < 50 ? 'md:w-1/2' : 'md:w-4/6'
        )}
        enter='transition-all duration-150'
        enterFrom='opacity-0 scale-50'
        enterTo='opacity-100 scale-100'
        leave='transition-all duration-150'
        leaveFrom='opacity-100 scale-100'
        leaveTo='opacity-0 scale-75'
      >
        {IconComponent ? (
          <>{IconComponent}</>
        ) : Icon ? (
          <Icon size={20} className='mb-1 text-primary-500' />
        ) : (
          <IconConfirmed className='mb-1' />
        )}
        <div className='ml-4 flex w-full cursor-default flex-col items-start justify-center'>
          {title && (
            <h1 className='text-base font-bold leading-none tracking-wider text-primary-500'>
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              className={clsx(
                'font-medium leading-none tracking-wider text-primary-500',
                title && 'mt-1 text-sm'
              )}
            >
              {bolded ? (
                <BoldedText text={subtitle} bolded={bolded} />
              ) : (
                subtitle
              )}
            </p>
          )}
          <div>{extended}</div>
        </div>{' '}
        <div
          className='absolute right-3 top-3 cursor-pointer text-lg'
          onClick={() => toast.dismiss(t.id)}
        >
          <MdOutlineClose size={20} className='text-[#007BC3]' />
        </div>
      </Transition>
    ),
    { id: 'info-notification', position: 'top-center', duration: 3000 }
  );

const BoldedText = ({ text, bolded }: { text: string; bolded: string }) => {
  const parts = text.split(bolded);

  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index <= parts.length - 1 && (
            <span className='font-bold text-terciary-900'>{' ' + bolded}</span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

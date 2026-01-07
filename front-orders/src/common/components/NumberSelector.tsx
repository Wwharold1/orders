/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import React, { FC } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { IconAdd } from '@/common/components/icons/movements/IconAdd';
import { IconRemove } from '@/common/components/icons/movements/IconRemove';

interface IProps {
  label?: string;
  name: string;
  icon?: string;
  iconError?: string;
  type: string;
  placeholder?: string;
  size?: 1 | 2 | 3 | 4;
  top?: string;
  left?: string;
  width?: number;
  formRegister: UseFormRegister<any>;
  error: FieldErrors<any>;
  max?: number;
  unscale?: boolean;
  form?: any;
  centered?: boolean;
  noPadding?: boolean;
  noWhiteSpace?: boolean;
  isLoading?: boolean;
}

export const NumberSelector: FC<IProps> = ({
  max,
  name,
  formRegister,
  form,
}) => {
  return (
    <>
      <div className='flex w-full items-center space-x-2'>
        <div
          onClick={() =>
            Number(form.getValues(name)) !== 0 &&
            form.setValue(name, Number(form.getValues(name)) - 1)
          }
          className='grid h-10 w-10 cursor-pointer place-content-center rounded-full bg-prudential-500 p-2'
        >
          <IconRemove className='scale-150' fill='white' />
        </div>
        <div className='relative inline-flex w-[70%] flex-col lg:w-auto'>
          <input
            type='text'
            max={max || 300}
            id={name}
            placeholder='00'
            className={clsx(
              'border-neutral-300 focus:border-primary-500',
              'border-primary-500',
              'relative mt-0 w-full border-0 border-b bg-neutral-50 pb-2 text-center font-medium text-neutral-800 placeholder-neutral-400 caret-primary-500 outline-none ring-0 focus:outline-none focus:ring-0',
              '!pl-3 pb-[16px] pt-[18px]'
            )}
            {...formRegister(name, {
              onChange(e) {
                if (e.target.value.match(/[0-9]*$/)) {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }
              },
            })}
            onWheel={(event) => event.currentTarget.blur()}
            autoComplete='off'
          />
          {form.formState.errors[name] && (
            <span className='absolute -bottom-6 left-1/2 mt-1.5 flex min-w-max -translate-x-1/2 flex-col text-center text-xs text-secondary-900'>
              {form.formState.errors[name].message}
            </span>
          )}
        </div>
        <div
          onClick={() =>
            Number(form.getValues(name)) !== max &&
            form.setValue(name, Number(form.getValues(name)) + 1)
          }
          className='grid h-10 w-10 cursor-pointer place-content-center rounded-full bg-prudential-500 p-2'
        >
          <IconAdd className='scale-150' fill='white' />
        </div>{' '}
      </div>
    </>
  );
};

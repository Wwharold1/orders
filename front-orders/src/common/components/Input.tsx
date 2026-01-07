/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

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
  disabled?: boolean;
}

export function Input({
  label,
  name,
  type,
  icon,
  iconError,
  placeholder,
  size,
  width,
  top,
  left,
  formRegister,
  error,
  max,
  unscale = false,
  form,
  centered,
  noPadding,
  noWhiteSpace,
  isLoading,
  disabled,
}: IProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [customType, setCustomType] = useState<string>(
    type === 'date' ? 'text' : type
  );

  const [maxLength, setMaxLength] = useState<number>(max || 300);

  const now = new Date(),
    minDate = now.toISOString().substring(0, 10);
  return (
    <React.Fragment>
      <label className='text-base font-bold text-primary-900' htmlFor={name}>
        {label}
      </label>
      <div className='group relative w-full'>
        {icon && (
          <Image
            className={clsx(
              top ??
                (TopSizeEnum[
                  (size ?? 1) as keyof typeof TopSizeEnum
                ] as string),
              left ??
                (LeftSizeEnum[
                  (size ?? 1) as keyof typeof LeftSizeEnum
                ] as string),
              'absolute z-10'
            )}
            src={
              iconError ? (error[name] || error[''] ? iconError : icon) : icon
            }
            alt={`${name} icon`}
            width={
              width
                ? width
                : IconSizeEnum[(size ?? 1) as keyof typeof IconSizeEnum]
            }
            height={20}
          />
        )}
        {type === 'password' && (
          <div
            className={clsx(
              'absolute right-1 z-10 grid cursor-pointer place-content-center rounded-full p-2 hover:bg-gray-100 ',
              !showPassword ? 'top-3.5' : 'top-[12.5px]'
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={
                !showPassword && error[name]
                  ? '/icons/hideError.svg'
                  : showPassword && error[name]
                  ? '/icons/passwordClosedError.svg'
                  : !showPassword
                  ? '/icons/hide.svg'
                  : '/icons/passwordClosed.svg'
              }
              alt={`${name} icon`}
              width={20}
              height={20}
            />
          </div>
        )}
        {type === 'date' && (
          <div
            className={clsx(
              'calendar-active pointer-events-none absolute right-2 z-10 grid cursor-pointer place-content-center rounded-full bg-transparent p-2 hover:bg-gray-100 ',
              'top-[12.5px]'
            )}
          >
            <Image
              src='/icons/calendar.svg'
              alt={`${name} icon`}
              width={20}
              height={20}
            />
          </div>
        )}
        {isLoading ? (
          <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
            <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
          </div>
        ) : (
          <>
            <input
              type={
                showPassword
                  ? 'text'
                  : type === 'number'
                  ? 'text'
                  : type === 'alphanumeric'
                  ? 'text'
                  : customType ?? type
              }
              onWheel={(event) => event.currentTarget.blur()}
              maxLength={maxLength}
              disabled={disabled}
              id={name}
              className={clsx(
                !(error[name] || error[''])
                  ? 'border-neutral-300 focus:border-primary-500'
                  : 'border-secondary-900 focus:border-secondary-900',
                icon ? 'pl-10' : 'pl-0',
                unscale && 'md:scale-105',
                form.watch(name) && 'border-primary-500',
                'relative mt-0 w-full border-0 border-b bg-neutral-50 pb-2 font-medium text-neutral-800 placeholder-neutral-400 caret-primary-500 outline-none ring-0 focus:outline-none focus:ring-0',
                !centered ? 'pt-[24px]' : '!pl-3 pb-[16px] pt-[18px]',
                noPadding && '!pl-3',
                disabled && 'pointer-events-none opacity-50'
              )}
              autoComplete='off'
              max={type === 'date' ? minDate : undefined}
              {...formRegister(name, {
                onChange: (e) => {
                  if (type === 'number') {
                    if (e.target.value.match(/[0-9]*$/)) {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }
                  }
                  if (type === 'alphanumeric') {
                    // match alphanumeric and remove the non alphanumeric characters
                    if (e.target.value.match(/[a-zA-Z0-9]*$/)) {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z0-9]/g,
                        ''
                      );
                    }
                  }
                  if (type === 'money') {
                    if (e.target.value.match(/[0-9.]*$/)) {
                      if (
                        e.target.value.startsWith('0') &&
                        e.target.value.split('')[1] !== '.'
                      ) {
                        e.target.value = e.target.value.substring(0, 1);
                      }
                      if (e.target.value.startsWith('.')) {
                        e.target.value = e.target.value.replaceAll('.', '');
                      }

                      if (
                        e.target.value
                          .split('')
                          .filter((e: string) => e === '.').length > 1
                      ) {
                        e.target.value = e.target.value.replace(
                          /.([^.]*)$/,
                          '' + '$1'
                        );
                        if (e.target.value.split('.').length > 1) {
                          while (e.target.value.split('.')[1].length > 2) {
                            e.target.value = e.target.value.substring(
                              0,
                              e.target.value.length - 1
                            );
                          }
                        }
                      }

                      if (e.target.value.split('.').length > 1) {
                        if (
                          e.target.value
                            .split('.')
                            .filter((e: any) => e !== '')[1]
                        ) {
                          while (
                            e.target.value
                              .split('.')
                              .filter((e: any) => e !== '')[1].length > 2
                          ) {
                            e.target.value = e.target.value.substring(
                              0,
                              e.target.value.length - 1
                            );
                          }
                        }
                      }

                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                    }
                  }
                  if (max) {
                    const maxLength =
                      e.target.value.includes('.') && type === 'money'
                        ? max + 3
                        : max;
                    setMaxLength(maxLength);
                    if (e.target.value.length > maxLength) {
                      e.target.value = e.target.value.slice(
                        0,
                        e.target.value.length - 1
                      );
                    }
                  }
                  if (noWhiteSpace) {
                    if (e.target.value.includes(' ')) {
                      e.target.value = e.target.value.replaceAll(' ', '');
                    }
                  }
                },
                onBlur: () => {
                  if (type === 'date') {
                    form.watch(name) === '' && setCustomType('text');
                  }
                },
              })}
              onFocus={() => type === 'date' && setCustomType('date')}
            />
            {placeholder && (
              <label
                className={clsx(
                  'pointer-events-none absolute left-0 top-0.5 flex h-full transform items-center pl-10 text-base text-neutral-400 transition-all ease-out group-focus-within:h-1/2 group-focus-within:text-xs group-focus-within:text-prudential-500 peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-0 peer-valid:text-xs',
                  form.watch(name) && '!h-1/2 text-xs text-prudential-500',
                  noPadding && '!pl-3',
                  disabled && 'pointer-events-none opacity-50',
                  (error[name] || error['']) &&
                    '!text-secondary-900 group-focus-within:!text-secondary-900'
                )}
              >
                {placeholder}
              </label>
            )}
          </>
        )}
      </div>
      {(error[name] || error['']) && (
        <span className='mt-1 flex flex-col text-xs text-secondary-900'>
          {error[name]?.message as string}
          {error[name]?.message && <br />}
          {error['']?.message as string}
        </span>
      )}
    </React.Fragment>
  );
}

const IconSizeEnum = {
  4: 22,
  3: 20,
  2: 18,
  1: 16,
};

const TopSizeEnum = {
  4: 'top-[22px]',
  3: 'top-5',
  2: 'top-4',
  1: 'top-3',
};

const LeftSizeEnum = {
  4: 'left-2.5',
  3: 'left-2.5',
  2: 'left-3',
  1: 'left-2.5',
};

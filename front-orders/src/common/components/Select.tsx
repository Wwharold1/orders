/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC, Fragment, useMemo } from 'react';
import CountryFlag from 'react-country-flag';

import { countryCodesMapping } from '@/common/helper/countryCodes';

interface IProps {
  name: string;
  form: any;
  list: any[];
  placeholder: string;
  onChange: any;
  keySearchValue: string;
  keySecondSearchValue?: string;
  keyDisplay: string;
  keyValue: string;
  keySearchCondition: string;
  country?: boolean;
  disabled?: boolean;
}

export const Select: FC<IProps> = ({
  name,
  form,
  list,
  placeholder,
  keyValue,
  onChange,
  keySearchCondition,
  keySearchValue,
  keySecondSearchValue,
  disabled,
  country,
  keyDisplay,
}) => {
  const options = useMemo(() => {
    return list.map((item, index: number) => {
      const countryCode =
        countryCodesMapping[item[keyValue] as keyof typeof countryCodesMapping];

      return (
        <Listbox.Option
          className={clsx(
            'text-md cursor-pointer p-3 hover:bg-neutral-200 md:text-lg',
            country && '!text-sm md:!text-sm'
          )}
          key={index}
          value={item[keyValue]}
        >
          <CountryFlag
            countryCode={countryCode}
            svg
            className='mr-2'
            style={{ width: '25px', height: 'auto' }}
          />
          <span>{countryCode}</span>
        </Listbox.Option>
      );
    });
  }, []);

  const getValues = () => {
    if (!form.getValues(name) || !list.length) return '';
    const targetSearchValue = getTarget(keySearchValue);
    let targetSecondSearchValue = '';

    if (!targetSearchValue) {
      form.setValue(name, 0);
      return '';
    }

    if (keySecondSearchValue) {
      const targetRaw = getTarget(keySecondSearchValue);
      targetSecondSearchValue = targetRaw ? ` - ${targetRaw}` : '';
    }

    return targetSearchValue + targetSecondSearchValue;
  };

  const getTarget = (searched: string): string => {
    if (!searched) return '';
    const target =
      list.find((o) => o[keySearchCondition] === form.getValues(name))?.[
        searched!
      ] ?? 0;

    if (target === 0) return '';
    return target;
  };

  return (
    <Listbox
      disabled={disabled ?? false}
      as='div'
      className='w-full'
      onChange={onChange}
    >
      <Listbox.Button
        className={
          country
            ? clsx(
                'flex h-auto w-full items-center border-b border-primary-500 p-3 text-sm'
              )
            : clsx(
                form.getValues(name)
                  ? list.length
                    ? 'text-primary-900'
                    : 'text-neutral-400'
                  : 'text-neutral-400',
                form.getValues(name)
                  ? list.length
                    ? 'border-primary-500'
                    : 'border-neutral-300'
                  : 'border-neutral-300',
                'relative h-[57px] w-full border-b bg-neutral-50 p-2.5 pb-[8px] pt-[24px] text-left ',
                disabled && 'pointer-events-none opacity-50'
              )
        }
      >
        <Image
          src='/icons/chevronDown.svg'
          alt='chevron downs'
          className={clsx(
            'absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer',
            country && '!right-3'
          )}
          width={14}
          height={20}
        />
        {country ? (
          <CountryFlag
            countryCode={
              countryCodesMapping[
                form.getValues(name) as keyof typeof countryCodesMapping
              ]
            }
            svg
            className='mb-0.5 mr-2'
            style={{ width: '25px', height: 'auto' }}
          />
        ) : (
          <>{getValues()}</>
        )}
        {placeholder && !country && (
          <label
            className={clsx(
              'pointer-events-none absolute left-0 top-0.5 flex h-full transform items-center p-2.5 text-base text-neutral-400 transition-all ease-out group-focus-within:h-1/2 group-focus-within:text-xs group-focus-within:text-prudential-500 peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-0 peer-valid:text-xs',
              form.watch(name) && '!h-1/2 text-xs text-primary-500'
            )}
          >
            {placeholder}
          </label>
        )}
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Listbox.Options className='absolute z-30 h-60 w-full overflow-y-auto rounded-md bg-white'>
          {list &&
            !country &&
            list.map((item, index: number) => (
              <Listbox.Option
                className={clsx(
                  'text-md cursor-pointer p-3 hover:bg-neutral-200 md:text-lg'
                )}
                key={index}
                value={item[keyValue]}
              >
                {item[keyDisplay]}
              </Listbox.Option>
            ))}

          {list && country && <>{options}</>}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};

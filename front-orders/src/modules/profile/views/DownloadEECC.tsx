/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';

import { Button, notifyError, Spinner } from '@/common/components';
import { useStateCallback } from '@/common/hooks';
import { IFundByUser, IFundPeriod } from '@/common/interfaces';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { MonthDownloadCard } from '@/modules/profile/components/MonthDownloadCard';
import { useDownloadEECC } from '@/modules/profile/hooks/useDownloadEECC';

export const DownloadEECC = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useStateCallback<boolean>(false);
  const [periods, setPeriods] = useStateCallback<IFundPeriod[]>([]);
  const { queries, forms } = useDownloadEECC();
  const resultQuery = queries.fundByUserQuery.data?.payload.data;

  useEffect(() => {
    if (resultQuery && resultQuery.length === 0) {
      setError('Por el momento, no cuentas con Estados de Cuenta');
    } else {
      setError('');
    }
  }, [resultQuery]);
  const handleOnChange = () => {
    if (resultQuery) {
      const fund = forms.downloadEECCForm.watch('fondo');

      setPeriods(
        resultQuery.find(
          (e: IFundByUser) =>
            e.fundData.codFondo === fund.codFondo &&
            e.fundData.codFondoSerie === fund.codFondoSerie
        )?.fundPeriods ?? [],
        (newPeriod) => {
          !newPeriod.length &&
            notifyError({
              subtitle:
                'Por el momento, no cuentas con Estados de Cuenta en este fondo.',
            });
          if (!newPeriod.length) {
            setError(
              'Por el momento, no cuentas con Estados de Cuenta en este fondo.'
            );
          } else {
            setError('');
          }
        }
      );
    }
  };

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout>
        <form className='relative rounded-lg bg-white px-6 py-8 shadow-md'>
          <p className='text-xl font-bold leading-none text-primary-900'>
            Estado de Cuenta{' '}
          </p>
          <p className='mt-4 text-primary-900'>
            Selecciona el Fondo Mutuo sobre el cual quieres consultar.{' '}
          </p>
          <div className='relative mt-3 w-full md:w-1/2'>
            {queries.fundByUserQuery.isLoading ? (
              <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                  <Spinner />
                </div>
              </div>
            ) : (
              <>
                {[1].map((_, index) => {
                  const name = 'fondo';
                  const list = resultQuery.map((e: IFundByUser) => e.fundData)
                    ? resultQuery.map((e: IFundByUser) => {
                        const fund = e.fundData;
                        if (!fund.descripFondo.includes(fund.descripFondoSerie))
                          fund.descripFondo += ' - ' + fund.descripFondoSerie;

                        return e.fundData;
                      })
                    : [];

                  const placeholder = 'Fondo Mutuo';
                  const form = forms.downloadEECCForm;
                  const keyDisplay = 'descripFondo';

                  return (
                    <Listbox
                      as='div'
                      onChange={(fondo: string) => {
                        setIsLoading(true, () => {
                          setTimeout(() => {
                            setIsLoading(false);
                            forms.downloadEECCForm.setValue('fondo', fondo);
                            handleOnChange();
                          }, 1000);
                        });
                      }}
                      key={index}
                    >
                      <Listbox.Button
                        className={clsx(
                          forms.downloadEECCForm.getValues(name)
                            ? list.length
                              ? 'text-primary-900'
                              : 'text-neutral-400'
                            : 'text-neutral-400',
                          forms.downloadEECCForm.getValues(name)
                            ? list.length
                              ? 'border-primary-500'
                              : 'border-neutral-300'
                            : 'border-neutral-300',
                          'relative h-[57px] w-full border-b bg-neutral-50 p-2.5 pb-[8px] pt-[24px] text-left ',
                          error === '' ? '' : 'pointer-events-none'
                        )}
                      >
                        <Image
                          src='/icons/chevronDown.svg'
                          alt='chevron downs'
                          className='absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer'
                          width={14}
                          height={20}
                        />
                        {form.getValues(name) &&
                          form.getValues(name).descripFondo}
                        {placeholder && (
                          <label
                            className={clsx(
                              'pointer-events-none absolute left-0 top-0.5 flex h-full transform items-center p-2.5 text-base text-neutral-400 transition-all ease-out group-focus-within:h-1/2 group-focus-within:text-xs group-focus-within:text-prudential-500 peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-0 peer-valid:text-xs',
                              form.watch(name) &&
                                '!h-1/2 text-xs text-primary-500'
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
                            list.map((item: any, index: number) => (
                              <Listbox.Option
                                className='text-md cursor-pointer p-3 hover:bg-neutral-200 md:text-lg'
                                key={index}
                                value={item}
                              >
                                {item[keyDisplay]}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Transition>
                    </Listbox>
                  );
                })}
              </>
            )}
          </div>
          <span className='ml-1 mt-1 flex flex-col text-xs text-secondary-900'>
            {error}
          </span>
          {isLoading && (
            <div className='mt-12 flex items-center bg-white bg-opacity-90'>
              <Spinner />
              <p className='font-bold leading-none text-primary-500'>
                Cargando Estados de Cuenta...
              </p>
            </div>
          )}

          {queries.fundByUserQuery.isSuccess && !!periods.length && (
            <>
              <p className='mt-12 text-primary-900'>
                Selecciona el mes del fondo{' '}
                <span className='font-bold'>
                  {forms.downloadEECCForm.watch('fondo').descripFondo}{' '}
                </span>{' '}
                que deseas descargar.{' '}
              </p>
              <div className='mt-6 flex w-full flex-col space-y-2.5 md:w-1/2'>
                {periods.map((fundPeriod: IFundPeriod, index: number) => {
                  return (
                    <MonthDownloadCard
                      index={index}
                      period={fundPeriod}
                      currentFund={forms.downloadEECCForm.watch('fondo')}
                      key={index}
                    />
                  );
                })}
              </div>
            </>
          )}

          <div className='absolute left-0 mb-12 mt-48 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:mt-16 md:flex-row md:space-y-0'>
            <Button
              title='Volver'
              alternative
              noBorder
              handleClick={() => router.back()}
              className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
            />
          </div>
        </form>
      </DashboardLayout>
    </div>
  );
};

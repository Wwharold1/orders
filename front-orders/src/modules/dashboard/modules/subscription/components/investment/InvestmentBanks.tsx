/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { FC } from 'react';

import { Button } from '@/common/components';
import { IconReceipt } from '@/common/components/icons/subscription/IconReceipt';
import { IconDangerFill } from '@/common/components/icons/utils/IconDangerFill';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { ICollectorAccountResponse } from '@/common/interfaces/subscription.interface';
import { useInvestment } from '@/modules/dashboard/hooks/useInvestment';
import { BankCards } from '@/modules/dashboard/modules/subscription/components/banks/BankCards';
import { MoneyTypeConversionEnum } from '@/modules/dashboard/modules/subscription/enum/investment.enum';
import { TabInvestmentSubscriptionEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setInvestmentTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { setCurrentCollector } from '@/modules/dashboard/slice/subscriptionSlice';
import { InvestmentService } from '@/services/InvestmentService';

interface IProps {
  modal: (state: boolean, cb?: ((state: boolean) => void) | undefined) => void;
}

export const InvestmentBanks: FC<IProps> = ({ modal }) => {
  const { forms } = useInvestment();
  const dispatch = useAppDispatch();
  const currentSubscription = useAppSelector(
    (state) => state.subscription.currentSubscription
  );
  const currentFund = useAppSelector((state) => state.subscription.currentFund);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const currentCollector = useAppSelector(
    (state) => state.subscription.currentCollector
  );
  const minAmounInvestment = useAppSelector(
    (state) => state.subscription.amountMinInversion
  );

  const { data: collectorAccountData, isLoading: isLoadingCollectorAccount } =
    useQuery<ICollectorAccountResponse>(
      ['collector-account-list', currentFund?.id],
      () => InvestmentService().getCollectorAccounts(currentFund!.id!),
      {
        enabled: !!currentFund?.id,
        onSuccess: (collector) => {
          if (!currentCollector) {
            dispatch(setCurrentCollector(collector.data.at(0)!));
          }
        },
        onError: (err) => {
          console.error('❌ Error al obtener collector accounts:', err);
        },
      }
    );

  return (
    <div>
      <div className='mt-8 grid grid-cols-12 gap-0 pb-20 text-primary-900'>
        <div className='no-scrollbar col-span-12 md:col-span-6 md:max-h-[800px] md:overflow-auto md:pr-10 lg:col-span-8 lg:max-h-full lg:overflow-hidden lg:pr-16'>
          <div className='text-primary-900'>
            <h1 className='text-lg font-bold leading-none md:text-xl'>
              Seleccionar banco{' '}
            </h1>
            <p className='mt-4 leading-none'>
              Selecciona el banco al que realizarás el depósito de tu inversión.
            </p>
          </div>

          {isLoadingCollectorAccount ? (
            <div className='mt-10 animate-pulse rounded-lg border border-neutral-100 p-4 font-bold'>
              <div className='h-3.5 w-5/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-6 h-3.5 w-4/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-2 h-3.5 w-5/12 rounded-full bg-neutral-200 md:w-5/12'></div>
            </div>
          ) : (
            <div className='mt-10 rounded-lg border border-neutral-100 p-4 font-bold'>
              <h1 className='text-primary-500'>RUC y RAZÓN SOCIAL</h1>
              <p className='mt-3 '>
                RUC {collectorAccountData?.data.at(0)?.ruc}
              </p>
              <p>{collectorAccountData?.data.at(0)?.razon_social}</p>
            </div>
          )}

          <div className='mt-6 md:mt-10'>
            <BankCards
              loading={isLoadingCollectorAccount}
              banks={
                collectorAccountData ? collectorAccountData.data : undefined
              }
            />
          </div>
        </div>
        <div className='sticky col-span-12 mt-10 rounded-lg md:col-span-6 md:mt-0 lg:col-span-4'>
          <div className='border border-neutral-100 px-4 py-6'>
            <div className='border-b border-neutral-200 pb-6'>
              <h1 className='text-xl font-bold leading-none'>
                Resumen de tu inversión
              </h1>
              <p className='mt-3 text-base text-neutral-500 md:text-sm'>
                Tu Entidad Bancaria podría cobrarte comisiones o recargos al
                realizar esta operación.
              </p>
            </div>
            <div className='mt-6 border-b border-neutral-100 pb-6'>
              <div className='flex items-center space-x-2'>
                <h1 className='text-[28px] font-bold text-primary-900'>
                  {
                    MoneyTypeConversionEnum[
                      currentFund?.spectrumFund
                        .moneda as keyof typeof MoneyTypeConversionEnum
                    ]
                  }
                  {Number(currentSubscription?.amount).toFixed(2)}
                </h1>
                {forms.createSubscriptionForm.formState.errors.amount && (
                  <IconDangerFill className='mb-1.5' />
                )}
              </div>
              <p
                className={clsx(
                  'flex text-sm font-bold',
                  forms.createSubscriptionForm.formState.errors.amount
                    ? 'text-terciary-900'
                    : 'text-neutral-300'
                )}
              >
                INVERSIÓN MÍNIMA:{' '}
                {
                  MoneyTypeConversionEnum[
                    minAmounInvestment?.moneda as keyof typeof MoneyTypeConversionEnum
                  ]
                }
                {minAmounInvestment?.amount_min_inversion?.toFixed(2)}
              </p>
            </div>
            <div className='mt-6 border-b border-neutral-100 pb-6'>
              <h1 className='text-xl font-bold leading-none text-teal-terciary'>
                {currentFund?.title}
              </h1>
              <p className='mt-1.5 text-sm text-teal-terciary'>
                {currentUser?.serie.name}
              </p>
            </div>
            <div className='mt-6'>
              <h1 className='font-bold leading-none'>
                {currentCollector?.bank.description}
              </h1>
            </div>
          </div>
          <div className='relative mt-6 border border-primary-50 bg-[#E2F4FF4D] px-3 py-4'>
            <IconReceipt className='absolute' />
            <p className='indent-5 text-sm text-primary-900'>
              Recuerda guardar tu comprobante de pago (físico o virtual) y
              número de tu operación. Te los pediremos para validar tu
              inversión.{' '}
            </p>
          </div>
        </div>
      </div>
      <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
        <Button
          title='Cancelar'
          alternative
          noBorder
          handleClick={() => modal(true)}
          className='order-2 mt-4 hidden w-full md:order-none md:mt-0 md:block md:w-auto'
        />
        <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            iconStart='/icons/ArrowLeft.svg'
            alternative
            handleClick={() => {
              dispatch(setCurrentCollector(null));
              dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.DETAIL));
            }}
            title='Anterior'
            disabled={isLoadingCollectorAccount}
          />
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            iconEnd='/icons/ArrowRight.svg'
            disabled={isLoadingCollectorAccount}
            handleClick={() =>
              dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.RECEIPT))
            }
            title='Siguiente'
          />
        </div>
      </div>
    </div>
  );
};

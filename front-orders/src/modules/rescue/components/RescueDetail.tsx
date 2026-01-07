/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import router from 'next/router';
import React, { FC, useEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button } from '@/common/components';
import IconInfo from '@/common/components/icons/utils/IconInfo';
import { Input } from '@/common/components/Input';
import { NumberSelector } from '@/common/components/NumberSelector';
import { Option } from '@/common/components/Option';
import { Tooltip } from '@/common/components/Tooltip';
import { ContextRoutesEnum } from '@/common/enums';
import { convertAmount } from '@/common/helper';
import {
  useAppDispatch,
  useAppSelector,
  useStatePersist,
} from '@/common/hooks';
import {
  IRescueDetailResponse,
  RescueTypeEnum,
} from '@/common/interfaces/rescue.interface';
import { RescueFormEnum } from '@/modules/rescue/enum/rescue.form.enum';
import { useRescue } from '@/modules/rescue/hooks/useRescue';
import { setRescueTab } from '@/modules/rescue/slice/rescueLayoutSlice';
import {
  setBankAccount,
  setCurrentRescue,
  setRescueDetail,
} from '@/modules/rescue/slice/rescueSlice';
import { RescueService } from '@/services/RescueService';

interface IProps {
  modal: (state: boolean, cb?: ((state: boolean) => void) | undefined) => void;
}

export const RescueDetail: FC<IProps> = ({ modal }) => {
  const { forms } = useRescue();
  const dispatch = useAppDispatch();
  const [isPartial, setIsPartial] = useStatePersist<boolean>(
    false,
    'is-partial'
  );
  const [isQuotes, setIsQuotes] = useStatePersist<boolean>(false, 'is-quotes');
  const currentFund = useAppSelector((state) => state.rescue.currentFund);

  const {
    data: rescueDetail,
    isLoading,
    isFetching,
  } = useQuery<IRescueDetailResponse>(
    ['get-rescue-details', currentFund?.codFund],
    () =>
      RescueService().getRescueDetails(
        currentFund!.codFund,
        currentFund!.spectrumFund.codFondoSerie
      ),
    {
      onSuccess: (res) => {
        if (!res.data?.bank_accounts.length) {
          router.push(
            {
              pathname: ContextRoutesEnum.ADD_ACCOUNT,
              query: {
                redirect: true,
                codFund: currentFund!.codFund,
              },
            },
            ContextRoutesEnum.ADD_ACCOUNT
          );
          return;
        }
        dispatch(setRescueDetail(res.data));
        dispatch(setBankAccount(res.data.bank_accounts[0].id));

        forms.createRescueForm.setValue(
          'bank_account_id',
          res.data.bank_accounts[0].id
        );
      },
      staleTime: 1000 * 60 * 2,
      cacheTime: 1000 * 60 * 2,
    }
  );

  useFormPersist(RescueFormEnum.RESCUE_DETAIL, {
    watch: forms.createRescueForm.watch,
    setValue: forms.createRescueForm.setValue,
    storage: window.localStorage,
  });

  useEffect(() => {
    if (localStorage.getItem('token-image')) {
      const image = localStorage.getItem('token-image');
      if (image) {
        const sanitized = image.substring(1, image.length - 1);
        forms.createRescueForm.setValue('image', sanitized);
      }
    }
  }, []);

  useEffect(() => {
    if (forms.createRescueForm.watch('installments_quantity')) {
      forms.createRescueForm.setValue(
        'amount',
        convertAmount(
          (Number(rescueDetail?.data.current_balance) /
            Number(rescueDetail?.data.installments_quantity)) *
            Number(
              forms.createRescueForm
                .watch('installments_quantity')
                .toString()
                .replace(/[^0-9]/g, '')
            )
        ).replaceAll(',', '')
      );
    }
  }, [forms.createRescueForm.watch('installments_quantity')]);

  useEffect(() => {
    if (rescueDetail && forms.createRescueForm.watch('installments_quantity')) {
      if (
        rescueDetail.data.minimum_rescue_amount >
        Number(forms.createRescueForm.watch('amount'))
      ) {
        forms.createRescueForm.setError('installments_quantity', {
          message:
            'El monto mínimo de rescate es de ' +
            currentFund?.spectrumFund.moneda +
            ' ' +
            rescueDetail.data.minimum_rescue_amount,
        });
        return;
      }
      if (
        rescueDetail.data.amount_partial_max_rescue <
        Number(forms.createRescueForm.watch('installments_quantity'))
      ) {
        forms.createRescueForm.setError('amount', {
          message:
            'El monto máximo de rescate es de ' +
            currentFund?.spectrumFund.moneda +
            ' ' +
            rescueDetail.data.amount_partial_max_rescue.toFixed(2),
        });
        return;
      }
      if (
        forms.createRescueForm.watch('installments_quantity') >
        rescueDetail.data.installments_quantity
      ) {
        forms.createRescueForm.setError('installments_quantity', {
          message:
            'Máximo de cuotas: ' + rescueDetail.data.installments_quantity,
        });
        return;
      }
      if (Number(forms.createRescueForm.watch('installments_quantity')) === 0) {
        forms.createRescueForm.setError('installments_quantity', {
          message: 'La cantidad de cuotas debe ser mayor a 0',
        });
        return;
      }
      forms.createRescueForm.clearErrors('installments_quantity');
    }

    if (
      rescueDetail &&
      (Number(forms.createRescueForm.watch('amount')) ||
        Number(forms.createRescueForm.watch('amount')) === 0)
    ) {
      if (
        rescueDetail.data.minimum_rescue_amount >
        Number(forms.createRescueForm.watch('amount'))
      ) {
        forms.createRescueForm.setError('amount', {
          message:
            'El monto mínimo de rescate es de ' +
            currentFund?.spectrumFund.moneda +
            ' ' +
            rescueDetail.data.minimum_rescue_amount,
        });
        return;
      }
      if (
        rescueDetail.data.amount_partial_max_rescue <
        Number(forms.createRescueForm.watch('amount'))
      ) {
        forms.createRescueForm.setError('amount', {
          message:
            'El monto máximo de rescate es de ' +
            currentFund?.spectrumFund.moneda +
            ' ' +
            rescueDetail.data.amount_partial_max_rescue.toFixed(2),
        });
        return;
      }
      forms.createRescueForm.clearErrors('amount');
    }
  }, [
    forms.createRescueForm.watch('amount'),
    forms.createRescueForm.watch('installments_quantity'),
  ]);

  useEffect(() => {
    if (isPartial && isQuotes) {
      const maxAmount = rescueDetail?.data.installments_quantity ?? 0;
      const installmentsValue = Number(
        forms.createRescueForm.watch('installments_quantity')
      );

      if (installmentsValue > maxAmount) {
        forms.createRescueForm.setError('installments_quantity', {
          message: `El valor no puede ser mayor a ${maxAmount}`,
        });
      } else {
        forms.createRescueForm.clearErrors('installments_quantity');
      }
      const maxDigits = maxAmount.toString().length;

      const amountValue = forms.createRescueForm
        .watch('installments_quantity')
        ?.toString();

      if (amountValue && amountValue.length > maxDigits) {
        const newAmountValue = parseInt(amountValue.slice(0, maxDigits), 10);
        forms.createRescueForm.setValue(
          'installments_quantity',
          newAmountValue
        );
      }
    }
  }, [forms.createRescueForm.watch('installments_quantity'), rescueDetail]);

  return (
    <div>
      <div className='mt-8 grid grid-cols-12 gap-0 pb-10 text-primary-900 md:gap-10 lg:gap-16'>
        <div className='col-span-12 md:col-span-6 lg:col-span-8'>
          <div className='text-primary-900'>
            <h1 className='text-lg font-bold leading-none md:text-xl'>
              Detalle del rescate
            </h1>
            <p className='mt-4 leading-none'>
              Por favor, ingresa el detalle de tu rescate.{' '}
            </p>
          </div>
          <div className='mt-10'>
            <h1 className='font-bold leading-none'>
              ¿Cuánto quieres rescatar?
            </h1>
            <p className='mt-4 leading-none'>
              {rescueDetail?.data.can_partial_rescue
                ? 'Selecciona una de las siguientes opciones:'
                : 'Opción de rescate disponible:'}
            </p>
            {isLoading || isFetching ? (
              <div className='mt-5 flex items-center space-x-6'>
                <div className='flex items-center space-x-2'>
                  <div className='relative mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                    <div className='h-8 w-8 rounded-full bg-neutral-100'></div>
                  </div>
                  <div className='relative mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                    <div className='h-4 w-10 rounded-sm bg-neutral-100'></div>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='relative mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                    <div className='h-8 w-8 rounded-full bg-neutral-100'></div>
                  </div>
                  <div className='relative mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                    <div className='h-4 w-10 rounded-sm bg-neutral-100'></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='mt-5 flex items-center space-x-8'>
                <Option
                  selected={isPartial}
                  setSelected={() => {
                    setIsPartial(false);
                    forms.createRescueForm.setValue(
                      'rescue_type',
                      RescueTypeEnum.TOTAL
                    );
                  }}
                  label='Total'
                />
                {rescueDetail?.data.can_partial_rescue && (
                  <Option
                    selected={!isPartial}
                    setSelected={() => {
                      forms.createRescueForm.setValue(
                        'rescue_type',
                        RescueTypeEnum.PARTIAL
                      );
                      setIsPartial(true);
                    }}
                    label='Parcial'
                  />
                )}
              </div>
            )}
          </div>
          {isPartial && !(isLoading || isFetching) && (
            <div className='mt-10'>
              <h1 className='font-bold leading-none'>
                ¿Cuánto quieres rescatar?
              </h1>
              <p className='mt-4 leading-none'>
                Selecciona una de las siguientes opciones:{' '}
              </p>
              <div className='mt-5 flex items-center space-x-8'>
                <Option
                  selected={isQuotes}
                  setSelected={() => {
                    forms.createRescueForm.resetField('installments_quantity');
                    setIsQuotes(false);
                  }}
                  label='Por monto'
                />
                <Option
                  selected={!isQuotes}
                  setSelected={() => {
                    forms.createRescueForm.resetField('amount');
                    setIsQuotes(true);
                  }}
                  label='Por cuotas'
                />
              </div>
            </div>
          )}
          <div className='mt-4 flex w-full flex-grow'>
            {isPartial && !(isLoading || isFetching) && isQuotes ? (
              <div className='mt-4 w-full lg:w-1/2'>
                <NumberSelector
                  error={forms.createRescueForm.formState.errors}
                  formRegister={forms.createRescueForm.register}
                  form={forms.createRescueForm}
                  name='installments_quantity'
                  type='number'
                  max={rescueDetail?.data.installments_quantity}
                />
              </div>
            ) : (
              isPartial &&
              !(isLoading || isFetching) &&
              !isQuotes && (
                <div className='mt-4 w-full lg:w-[307px]'>
                  <Input
                    formRegister={forms.createRescueForm.register}
                    error={forms.createRescueForm.formState.errors}
                    name='amount'
                    placeholder='Monto'
                    noWhiteSpace
                    max={9}
                    type='money'
                    form={forms.createRescueForm}
                    icon={
                      currentFund?.spectrumFund.moneda.includes('$')
                        ? '/icons/moneyType.svg'
                        : '/icons/moneyTypeSoles.svg'
                    }
                    iconError={
                      currentFund?.spectrumFund.moneda.includes('$')
                        ? '/icons/moneyTypeError.svg'
                        : '/icons/moneyTypeSolesError.svg'
                    }
                    size={3}
                  />
                </div>
              )
            )}
          </div>
        </div>
        <div className='col-span-12 mt-10 rounded-lg md:col-span-6 md:mt-0 lg:col-span-4'>
          <div className='border border-neutral-100 px-4 py-6'>
            <div className='border-b border-neutral-200 pb-6'>
              <h1 className='text-xl font-bold leading-none'>
                Resumen de tu rescate{' '}
              </h1>
              <p className='mt-3 text-base text-neutral-500 md:text-sm'>
                El dinero será abonado a tu cuenta entre 2 a 10 días hábiles
                como máximo.
              </p>
            </div>
            <div className='border-b border-neutral-200 pb-4 pt-2'>
              <div className='mt-6'>
                <div className='flex flex-col items-start'>
                  <h1 className='text-sm font-bold uppercase leading-none text-neutral-300'>
                    Total (aprox.)
                  </h1>
                  {isLoading || isFetching ? (
                    <div className='relative mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                      <div className='h-8 w-28 rounded-sm bg-neutral-100'></div>
                    </div>
                  ) : (
                    <h1 className='text-[28px] font-bold text-primary-900'>
                      {currentFund?.spectrumFund.moneda}{' '}
                      {!isPartial
                        ? convertAmount(
                            Number(rescueDetail?.data.current_balance)
                          )
                        : isQuotes
                        ? forms.createRescueForm.watch('installments_quantity')
                          ? Number(
                              forms.createRescueForm
                                .watch('installments_quantity')
                                .toString()
                                .replace(/[^0-9]/g, '')
                            ) !== 0
                            ? convertAmount(
                                (Number(rescueDetail?.data.current_balance) /
                                  Number(
                                    rescueDetail?.data.installments_quantity
                                  )) *
                                  Number(
                                    forms.createRescueForm
                                      .watch('installments_quantity')
                                      .toString()
                                      .replace(/[^0-9]/g, '')
                                  )
                              )
                            : '0.00'
                          : '0.00'
                        : forms.createRescueForm.watch('amount')
                        ? forms.createRescueForm
                            .watch('amount')
                            .toString()
                            .split('')
                            .filter((e: string) => e === '.').length > 1
                          ? convertAmount(
                              Number(
                                forms.createRescueForm
                                  .watch('amount')
                                  .toString()
                                  .replace(/[^0-9.]/g, '')
                                  .replace(/.([^.]*)$/, '' + '$1')
                              )
                            )
                          : forms.createRescueForm
                              .watch('amount')
                              .toString()
                              .startsWith('.')
                          ? '0.00'
                          : convertAmount(
                              Number(
                                forms.createRescueForm
                                  .watch('amount')
                                  .toString()
                                  .replace(/[^0-9.]/g, '')
                              )
                            )
                        : '0.00'}
                    </h1>
                  )}
                </div>
              </div>
              {isLoading || isFetching ? (
                <>
                  <div className='relative mt-5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                    <div className='h-3.5 w-[90%] rounded-sm bg-neutral-100'></div>
                  </div>
                  <div className='relative mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                    <div className='h-3.5 w-28 rounded-sm bg-neutral-100'></div>
                  </div>
                </>
              ) : (
                <div className='mt-3'>
                  <h1 className='text-xl font-bold leading-none text-teal-terciary'>
                    {currentFund?.title}
                  </h1>
                  <p className='mt-1.5 text-sm text-teal-terciary'>
                    {rescueDetail!.data.fund.serie.at(0) +
                      rescueDetail!.data.fund.serie.slice(1, 5).toLowerCase() +
                      rescueDetail!.data.fund.serie.slice(5, 7)}
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className='mt-6'>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center space-x-2'>
                    <h1 className='text-sm font-bold uppercase leading-none text-neutral-300'>
                      Monto disponible (aprox.){' '}
                    </h1>
                    <Tooltip
                      ButtonIcon={IconInfo}
                      positioning='left'
                      title='Monto disponible (aprox.)'
                      content='Tu monto final se determinará cuando se te haya asignado el Valor Cuota.'
                    />
                  </div>
                  {isLoading || isFetching ? (
                    <div className='relative mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                      <div className='h-3.5 w-28 rounded-sm bg-neutral-100'></div>
                    </div>
                  ) : (
                    <h1 className='text-base font-bold text-primary-900'>
                      {currentFund?.spectrumFund.moneda}{' '}
                      {convertAmount(
                        Number(rescueDetail?.data.current_balance)
                      )}
                    </h1>
                  )}
                  {isLoading || isFetching ? (
                    <div className='relative mt-1 animate-pulse rounded-full bg-gradient-to-br text-white'>
                      <div className='h-3.5 w-24 rounded-sm bg-neutral-100'></div>
                    </div>
                  ) : (
                    <p className='text-sm text-neutral-500'>
                      {rescueDetail?.data.installments_quantity} cuotas
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
        <Button
          title='Cancelar'
          alternative
          noBorder
          handleClick={() => modal(true)}
          className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:w-auto md:self-auto'
        />
        <Button
          className='w-4/5 self-center md:w-auto'
          type='submit'
          iconEnd='/icons/ArrowRight.svg'
          title='Siguiente'
          disabled={
            isLoading ||
            isFetching ||
            (isPartial
              ? isQuotes
                ? !!forms.createRescueForm.formState.errors
                    .installments_quantity ||
                  !Number(
                    forms.createRescueForm.getValues('installments_quantity')
                  )
                : !!forms.createRescueForm.formState.errors.amount ||
                  (forms.createRescueForm.getValues('amount')
                    ? forms.createRescueForm.getValues('amount').toString() ===
                      ''
                    : true)
              : false)
          }
          handleClick={() => {
            const amount = isPartial
              ? isQuotes
                ? (
                    (Number(rescueDetail?.data.current_balance) /
                      Number(rescueDetail?.data.installments_quantity)) *
                    Number(
                      forms.createRescueForm
                        .watch('installments_quantity')
                        .toString()
                        .replace(/[^0-9]/g, '')
                    )
                  ).toString()
                : forms.createRescueForm.getValues('amount')
              : rescueDetail!.data.current_balance.toString();
            dispatch(
              setCurrentRescue({
                ...forms.createRescueForm.getValues(),
                cod_fund: currentFund!.codFund,
                cod_fund_serie: currentFund!.spectrumFund.codFondoSerie,
                amount,
                installments_quantity:
                  isPartial && !isQuotes
                    ? 0
                    : forms.createRescueForm.getValues('installments_quantity')
                    ? Number(
                        forms.createRescueForm.getValues(
                          'installments_quantity'
                        )
                      )
                    : 0,
                commission_amount:
                  Number(amount) *
                  (isPartial
                    ? rescueDetail!.data.commission_percentage_partial
                    : rescueDetail!.data.commission_percentage_total),
              })
            );
            dispatch(setRescueTab(1));
          }}
        />
      </div>
    </div>
  );
};

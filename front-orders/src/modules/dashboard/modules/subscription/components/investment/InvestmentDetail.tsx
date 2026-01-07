/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Modal, Spinner } from '@/common/components';
import { IconDangerFill } from '@/common/components/icons/utils/IconDangerFill';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { ContextRoutesEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import {
  ICollectorAccountResponse,
  IFundOriginResponse,
} from '@/common/interfaces/subscription.interface';
import { useInvestment } from '@/modules/dashboard/hooks/useInvestment';
import { BankSmallCards } from '@/modules/dashboard/modules/subscription/components/banks/BankSmallCards';
import {
  fundDistributiveFundEnum,
  ScheduledRescueEnum,
  SerieCodEnum,
} from '@/modules/dashboard/modules/subscription/enum/distributiveFund.enum';
import { MoneyTypeConversionEnum } from '@/modules/dashboard/modules/subscription/enum/investment.enum';
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
  SubscriptionFormEnum,
} from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setPaymentMethod } from '@/modules/dashboard/slice/paymentMethodSlice';
import { setSerieCodigo } from '@/modules/dashboard/slice/subscriptionSerieSlice';
import {
  setCurrentCollector,
  setCurrentSubscription,
  setFundsOriginList,
} from '@/modules/dashboard/slice/subscriptionSlice';
import { InvestmentService } from '@/services/InvestmentService';
import Image from 'next/image';
import { BankAccountService } from '@/services/BankAccountService';

interface IProps {
  modal: (state: boolean, cb?: ((state: boolean) => void) | undefined) => void;
  isLoading: boolean;
}

export const InvestmentDetail: FC<IProps> = ({
  modal,
  isLoading: isLoadingParent,
}) => {
  const [openSerieBModal, setOpenSerieBModal] = useState(false);
  const [mainBankAccount, setMainBankAccount] = useState<any>(null);
  const [rescueErrorModal, setRescueErrorModal] = useState(false);
  const [rescueErrorMessage, setRescueErrorMessage] = useState('');

  const dispatch = useAppDispatch();
  const [renderKey, setRenderKey] = useStateCallback(0);
  const currentFund = useAppSelector((state) => state.subscription.currentFund);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const fundsOriginList = useAppSelector(
    (state) => state.subscription.fundsOriginList
  );
  const pendingSubscription = useAppSelector(
    (state) => state.subscription.pendingSubscription
  );
  const currentCollector = useAppSelector(
    (state) => state.subscription.currentCollector
  );
  const { paymentMethod } = useAppSelector((state) => state.payment_method);
  const minAmounInvestment = useAppSelector(
    (state) => state.subscription.amountMinInversion
  );
  const serieCodigoStore = useAppSelector(
    (state) => state.subscriptionSerie.serieCodigo
  );

  const serieCodigo =
    currentFund?.codFund === fundDistributiveFundEnum.codFund
      ? serieCodigoStore
      : currentUser?.serie.codigo;

  const isDistributiveFund =
    currentFund?.codFund === fundDistributiveFundEnum.codFund;

  const monedaDesdeSerie =
    currentFund?.spectrumFund && Array.isArray(currentFund.spectrumFund)
      ? currentFund.spectrumFund.find(
          (item) => item.codFondoSerie === serieCodigo
        )?.moneda
      : undefined;

  const monedaDesdeRoot = currentFund?.spectrumFund?.moneda;

  const moneda = isDistributiveFund
    ? monedaDesdeSerie || monedaDesdeRoot || ''
    : monedaDesdeRoot || '';

  const { forms, submitHandlers, mutations } = useInvestment();
  useEffect(() => {
    const fetchMainBankAccount = async () => {
      if (isDistributiveFund) {
        try {
          const response = await BankAccountService().getBankAccounts();
          const mainAccount = response?.data?.find((acc: any) => acc.is_main);
          if (mainAccount) {
            setMainBankAccount(mainAccount);
          }
        } catch (err) {
          console.error('Error al obtener cuenta principal:', err);
        }
      }
    };

    fetchMainBankAccount();
  }, [isDistributiveFund]);

  useFormPersist(SubscriptionFormEnum.SUBCRIPTION_DETAIL, {
    watch: forms.createSubscriptionForm.watch,
    setValue: forms.createSubscriptionForm.setValue,
    storage: window.localStorage,
  });

  const { data: _funds, isFetching: isFetchingFundsOrigin } =
    useQuery<IFundOriginResponse>(
      ['funds-origin-list'],
      () => InvestmentService().fundsOriginList(),
      {
        onSuccess: (data: IFundOriginResponse) => {
          dispatch(setFundsOriginList(data.data));
        },
      }
    );

  const { data: collectorAccountData, isFetching: isFetchingCollectorAccount } =
    useQuery<ICollectorAccountResponse>(
      ['collector-account-list', currentFund?.id],
      () => InvestmentService().getCollectorAccounts(currentFund!.id!),
      {
        enabled:
          !!currentFund?.id && paymentMethod === PaymentMethodEnum.ONLINE,
        onSuccess: (collector) => {
          if (
            pendingSubscription?.payment_method === PaymentMethodEnum.ONLINE &&
            pendingSubscription?.payment_status === PaymentStatusEnum.SUCCESS
          ) {
            dispatch(setCurrentCollector(null));
            return;
          }
          if (!currentCollector) {
            dispatch(setCurrentCollector(collector.data.at(0)!));
            return;
          }
        },
      }
    );

  const isLoading = isFetchingFundsOrigin || isFetchingCollectorAccount;

  const setFundOriginValue = (type_worker_id: number) => {
    forms.createSubscriptionForm.setValue('funds_origin_id', type_worker_id);
  };
  const amountMinInversionB = useAppSelector(
    (state) => state.subscription.amountMinInversionB
  );

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement>,
    forceSubmit = false
  ) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const amount = Number(
      forms.createSubscriptionForm
        .getValues('amount')
        ?.toString()
        ?.replace(/[^0-9.]/g, '')
    );

    const shouldSuggestSerieB =
      isDistributiveFund &&
      serieCodigo === SerieCodEnum.SERIE_A &&
      amountMinInversionB &&
      amount >= Number(amountMinInversionB.amount_min_inversion);

    // 👇 Si debería sugerir Serie B pero no lo estoy forzando
    if (shouldSuggestSerieB && !forceSubmit) {
      setOpenSerieBModal(true);
      return;
    }
    if (!moneda) {
      return;
    }

    const scheduledRescueRaw =
      forms.createSubscriptionForm.getValues('scheduled_rescue');
    let scheduledRescueValue = String(scheduledRescueRaw) === 'true';

    const serieCod = isDistributiveFund ? serieCodigo : '999';

    if (!isDistributiveFund) {
      scheduledRescueValue = false;
    }

    const formValues = {
      ...forms.createSubscriptionForm.getValues(),
      payment_method: paymentMethod,
      money_type: moneda,
      scheduled_rescue: scheduledRescueValue,
      serie_cod: serieCod,
    };

    const getValuesForOnlinePayment = () => {
      if (pendingSubscription?.expired) {
        return {
          ...formValues,
          bank_id: currentCollector?.bank_id,
          suscription_id: pendingSubscription.id,
        };
      }
      return { ...formValues, bank_id: currentCollector?.bank_id };
    };

    const values =
      paymentMethod === PaymentMethodEnum.ONLINE
        ? getValuesForOnlinePayment()
        : formValues;

    if (scheduledRescueValue && isDistributiveFund) {
      const rescuePayload = {
        codFondo: currentFund?.codFund,
        codAdministradora: ScheduledRescueEnum.COD_ADMIN,
        codFondoSerie: serieCodigo,
        tipoIdentidad: ScheduledRescueEnum.TYPE_IDENTIFICATION,
        numIdentidad: currentUser?.number_document,
        codCronograma: ScheduledRescueEnum.COD_CRONOGRAM,
        codFormaPago: ScheduledRescueEnum.COD_FORMA_PAGO,
        codbancoCliente: mainBankAccount.bank.code,
        codTipoCuentaCliente: mainBankAccount.account_type.code,
        numCuentaCliente: mainBankAccount.account_number,
        numCuentaCCICliente: mainBankAccount.cci,
      };

      InvestmentService()
        .createScheduledRescue(rescuePayload)
        .then(() => {
          submitHandlers.submitSuscription(values, {
            amount_min_inversion: minAmounInvestment!.amount_min_inversion!,
            moneda: moneda,
          });
        })
        .catch((err) => {
          setRescueErrorMessage(
            err?.message?.[0] || err?.message || 'Error inesperado en rescate'
          );
          setRescueErrorModal(true);
        });

      return;
    } else {
      submitHandlers.submitSuscription(values, {
        amount_min_inversion: minAmounInvestment!.amount_min_inversion!,
        moneda: moneda,
      });
    }
  };

  useEffect(() => {
    forms.createSubscriptionForm.setValue('funds_origin_id', 0);
    if (localStorage.getItem('token-image')) {
      const image = localStorage.getItem('token-image');
      if (image) {
        const sanitized = image.substring(1, image.length - 1);
        forms.createSubscriptionForm.setValue('image', sanitized);
      }
    }
  }, []);

  //When the user already has a pending subscription
  useEffect(() => {
    if (pendingSubscription === null) {
      dispatch(setCurrentSubscription(null));
      forms.createSubscriptionForm.reset();
      setRenderKey(renderKey + 1);
      return;
    }

    if (pendingSubscription) {
      //set initial values
      !forms.createSubscriptionForm.getValues('amount') &&
        forms.createSubscriptionForm.setValue(
          'amount',
          Number(pendingSubscription.amount)
        );
      forms.createSubscriptionForm.setValue(
        'suscription_id',
        Number(pendingSubscription.id)
      );
      forms.createSubscriptionForm.setValue('origin_conditions', true);
      forms.createSubscriptionForm.setValue('terms_and_conditions', true);
      forms.createSubscriptionForm.setValue(
        'funds_origin_id',
        pendingSubscription.funds_origin_id
      );
      forms.createSubscriptionForm.setFocus('amount');

      window.history.replaceState(
        null,
        '',
        ContextRoutesEnum.SUBSCRIPTION_INVESTMENT
      );
    }
  }, [pendingSubscription]);

  useEffect(() => {
    const amount = forms.createSubscriptionForm
      .getValues('amount')
      ?.toString()
      .replace(/[^0-9.]/g, '');

    if (minAmounInvestment) {
      if (
        amount &&
        minAmounInvestment.amount_min_inversion &&
        Number(amount) < Number(minAmounInvestment.amount_min_inversion)
      ) {
        forms.createSubscriptionForm.setError('amount', {
          message: 'El monto es menor a la inversión mínima',
        });
      } else {
        forms.createSubscriptionForm.clearErrors();
      }
    }
  }, [
    forms.createSubscriptionForm.watch('amount'),
    forms.createSubscriptionForm.watch('origin_conditions'),
  ]);

  return (
    <div key={renderKey}>
      <div className='mt-8 grid grid-cols-12 gap-0 pb-20 text-primary-900 md:gap-10 lg:gap-16'>
        <div className='col-span-12 md:col-span-6 lg:col-span-8'>
          <div className='text-primary-900'>
            <h1 className='text-lg font-bold leading-none md:text-xl'>
              Detalle de la inversión
            </h1>
            <p className='mt-4 leading-none'>
              Por favor, ingresa el detalle de tu inversión.
            </p>
          </div>
          <div className='mt-10'>
            <h1 className='font-bold leading-none'>
              ¿Cuánto deseas invertir?{' '}
            </h1>
            <div className='mt-4'>
              <Input
                formRegister={forms.createSubscriptionForm.register}
                error={forms.createSubscriptionForm.formState.errors}
                name='amount'
                placeholder='Monto'
                noWhiteSpace
                max={9}
                type='money'
                form={forms.createSubscriptionForm}
                icon={
                  moneda.includes('$')
                    ? '/icons/moneyType.svg'
                    : '/icons/moneyTypeSoles.svg'
                }
                iconError={
                  moneda.includes('$')
                    ? '/icons/moneyTypeError.svg'
                    : '/icons/moneyTypeSolesError.svg'
                }
                size={3}
                disabled={isLoadingParent}
              />
            </div>

            <p className='mt-2 flex text-xs font-medium text-neutral-400'>
              {!forms.createSubscriptionForm.formState.errors.amount && (
                <>
                  La inversión mínima es de{' '}
                  {isLoadingParent ? (
                    <div className='relative ml-2 animate-pulse rounded-full bg-gradient-to-br text-white'>
                      <div className='h-3 w-10 rounded-sm bg-neutral-100'></div>
                    </div>
                  ) : (
                    <>
                      {
                        MoneyTypeConversionEnum[
                          minAmounInvestment?.moneda as keyof typeof MoneyTypeConversionEnum
                        ]
                      }
                      {minAmounInvestment?.amount_min_inversion?.toFixed(2)}
                    </>
                  )}
                </>
              )}
            </p>
          </div>
          <div className='mt-10'>
            <h1 className='font-bold leading-none'>Origen de fondos</h1>
            <div className='relative mt-4'>
              {isFetchingFundsOrigin || isLoadingParent ? (
                <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                  <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                  <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                    <Spinner />
                  </div>
                </div>
              ) : (
                <Select
                  keyDisplay='description'
                  keySearchCondition='id'
                  keySearchValue='description'
                  keyValue='id'
                  list={(fundsOriginList as never) ?? []}
                  name='funds_origin_id'
                  onChange={(fundOriginId: number) =>
                    setFundOriginValue(fundOriginId)
                  }
                  placeholder='Seleccionar'
                  form={forms.createSubscriptionForm}
                />
              )}
            </div>
          </div>
          <div className='mt-10'>
            <h1 className='font-bold leading-none'>Método de pago</h1>
            <p className='mt-4 leading-none'>
              Seleccione el método de pago con el cual quiere proceder para su
              inversión.
            </p>
            {isLoadingParent ? (
              <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:flex'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-pulse rounded-full bg-gray-300'></div>
                  <div className='h-8 w-32 animate-pulse rounded bg-gray-300'></div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-pulse rounded-full bg-gray-300'></div>
                  <div className='h-8 w-32 animate-pulse rounded bg-gray-300'></div>
                </div>
              </div>
            ) : (
              <div className='mt-4 flex gap-8'>
                <div
                  className='flex w-full items-start space-x-2 rounded-l'
                  onClick={() =>
                    dispatch(setPaymentMethod(PaymentMethodEnum.TRANSFER))
                  }
                >
                  <div
                    className={clsx(
                      'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                      paymentMethod === PaymentMethodEnum.TRANSFER
                        ? 'border-[#0066CC]'
                        : 'border-neutral-200'
                    )}
                  >
                    {paymentMethod === PaymentMethodEnum.TRANSFER && (
                      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-[5px]'></div>
                    )}
                  </div>
                  <label htmlFor='bank_transfer' className='cursor-pointer'>
                    Transferencia desde tu banco
                  </label>
                </div>
                {/* <div
                  className='flex w-full items-start space-x-2 rounded-l'
                  onClick={() =>
                    dispatch(setPaymentMethod(PaymentMethodEnum.ONLINE))
                  }
                >
                  <div
                    className={clsx(
                      'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                      paymentMethod === PaymentMethodEnum.ONLINE
                        ? 'border-[#0066CC]'
                        : 'border-neutral-200'
                    )}
                  >
                    {paymentMethod === PaymentMethodEnum.ONLINE && (
                      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-[5px]'></div>
                    )}
                  </div>
                  <label htmlFor='online_pay' className='cursor-pointer'>
                    Pago en línea
                  </label>
                </div> */}
              </div>
            )}
          </div>
          {isDistributiveFund && (
            <div className='mt-10'>
              <h1 className='font-bold leading-none'>
                Programa de rescates programados
              </h1>
              <p className='mt-2 text-sm text-neutral-600'>
                ¿Desea suscribirse al programa de rescates programados?
              </p>
              <div className='mt-4 flex gap-6'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    value='true'
                    {...forms.createSubscriptionForm.register(
                      'scheduled_rescue'
                    )}
                  />
                  Sí
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    value='false'
                    defaultChecked // ✅ se marca si el valor aún no está seteado
                    {...forms.createSubscriptionForm.register(
                      'scheduled_rescue'
                    )}
                  />
                  No
                </label>
              </div>
            </div>
          )}

          {paymentMethod === PaymentMethodEnum.ONLINE && (
            <div className='mt-10'>
              <h1 className='font-bold leading-none'>Banco</h1>
              <p className='mt-4 leading-none'>
                Por favor, seleccione el banco.
              </p>
              <div className='mt-4'>
                <BankSmallCards
                  isLoading={isFetchingCollectorAccount || isLoadingParent}
                  banks={
                    collectorAccountData ? collectorAccountData.data : undefined
                  }
                />
              </div>
            </div>
          )}
          <div className='mt-10 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
            <div className='flex space-x-3'>
              <input
                type='checkbox'
                {...forms.createSubscriptionForm.register('origin_conditions')}
                className='h-5 w-5 cursor-pointer rounded border-[#0066CC] text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 disabled:opacity-50 md:h-6 md:w-6'
                disabled={isLoadingParent}
              />
              <span className='pr-2 text-justify text-sm text-primary-900 md:text-base'>
                Declaro bajo juramento que las sumas de dinero, así como los
                valores que ingresan en mi cuenta en PrudentialSAF Sociedad
                Administradora de Fondos S.A.C para la realización de
                operaciones a través de los mecanismos centralizados de
                negociación y fuera de éstos, provienen de actividades lícitas,
                es decir, no contrarias al ordenamiento legal vigente y que
                tampoco tienen como origen el lavado de activos y/o el
                financiamiento del terrorismo.
              </span>
            </div>
            <div className='flex space-x-3'>
              <input
                type='checkbox'
                {...forms.createSubscriptionForm.register(
                  'terms_and_conditions'
                )}
                className='h-5 w-5 cursor-pointer rounded border-[#0066CC] text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 disabled:opacity-50 md:h-6 md:w-6'
                disabled={isLoadingParent}
              />
              <span className='pr-2 text-justify text-sm text-primary-900 md:text-base'>
                Acepto que los Términos y Condiciones aplicables respecto del
                uso de cada uno de los medios electrónicos y telemáticos
                indicados están a disposición del Partícipe en la página web de
                la Administradora{' '}
                <a
                  className='text-primary-500'
                  href='http://prudentialsaf.com.pe'
                  target='_blank'
                >
                  www.prudentialsaf.com.pe
                </a>{' '}
                <br /> <br /> Confirmo que se me ha puesto a disposición la
                documentación reglamentaria del fondo mutuo en el cual estoy
                invirtiendo (Reglamento de Participación, Anexo de Reglamento y
                Prospecto Simplificado).
              </span>
            </div>
          </div>
        </div>
        <div className='col-span-12 mt-10 rounded-lg md:col-span-6 md:mt-0 lg:col-span-4'>
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
            <div className='mt-6'>
              <div className='flex items-center space-x-2'>
                <h1 className='text-[28px] font-bold text-primary-900'>
                  {currentFund?.codFund === fundDistributiveFundEnum.codFund
                    ? moneda
                    : currentFund?.spectrumFund.moneda}{' '}
                  {forms.createSubscriptionForm.watch('amount')
                    ? forms.createSubscriptionForm
                        .watch('amount')
                        .toString()
                        .split('')
                        .filter((e: string) => e === '.').length > 1
                      ? Number(
                          forms.createSubscriptionForm
                            .watch('amount')
                            .toString()
                            .replace(/[^0-9.]/g, '')
                            .replace(/.([^.]*)$/, '' + '$1')
                        ).toFixed(2)
                      : truncateToDecimals(
                          Number(
                            forms.createSubscriptionForm
                              .watch('amount')
                              .toString()
                              .replace(/[^0-9.]/g, '')
                          )
                        )
                    : '0.00'}
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
                <>
                  {isLoadingParent ? (
                    <div className='relative ml-2 mt-0.5 animate-pulse rounded-full bg-gradient-to-br text-white'>
                      <div className='h-3.5 w-10 rounded-sm bg-neutral-100'></div>
                    </div>
                  ) : (
                    <>
                      {
                        MoneyTypeConversionEnum[
                          minAmounInvestment?.moneda as keyof typeof MoneyTypeConversionEnum
                        ]
                      }
                      {minAmounInvestment?.amount_min_inversion?.toFixed(2)}
                    </>
                  )}
                </>
              </p>
            </div>
            <div className='mt-6'>
              <h1 className='text-xl font-bold leading-none text-teal-terciary'>
                {currentFund?.title}
              </h1>
              <p className='mt-1.5 text-sm text-teal-terciary'>
                {currentUser?.serie.name}
              </p>
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
          handleClick={handleSubmit}
          disabled={
            isLoading ||
            Object.values(forms.createSubscriptionForm.getValues()).includes(
              ''
            ) ||
            Object.values(forms.createSubscriptionForm.getValues()).includes(
              0
            ) ||
            Object.values(forms.createSubscriptionForm.getValues()).length <
              6 ||
            Object.values(forms.createSubscriptionForm.getValues()).includes(
              false
            ) ||
            !!forms.createSubscriptionForm.formState.errors.amount ||
            mutations.subscriptionMutation.isLoading
          }
          loader={mutations.subscriptionMutation.isLoading}
          title='Siguiente'
        />{' '}
        <Modal
          isOpen={openSerieBModal}
          title='Información adicional importante'
          setIsOpen={setOpenSerieBModal}
          secondaryCustomFunction={() => handleSubmit(undefined, true)}
          modalLength={470}
          confirmationText='Si, cambiar'
          confirmationCustomFunction={() => {
            dispatch(setSerieCodigo({ serieCodigo: SerieCodEnum.SERIE_B }));
            setOpenSerieBModal(false);
          }}
          customIcon={
            <div className='grid h-11 w-11 place-content-center rounded-full bg-primary-50'>
              <Image
                src='/icons/warning.svg'
                alt='icon'
                width={24}
                height={24}
              />
            </div>
          }
          secondaryConfirmationText='No, mantener'
        >
          <p className='text-neutral-600'>
            El monto de tu inversión califica para acceder a la Serie B, la cual
            te ofrece una comisión unificada menor de 0.7% + IGV. ¿Deseas
            cambiar a la Serie B?
          </p>
        </Modal>
        <Modal
          customIcon={
            <div className='grid h-11 w-11 place-content-center rounded-full bg-primary-50'>
              <Image
                src='/icons/warning.svg'
                alt='icon'
                width={24}
                height={24}
              />
            </div>
          }
          isOpen={rescueErrorModal}
          setIsOpen={setRescueErrorModal}
          title='Ha ocurrido un error al programar tu rescate'
          confirmationText='Aceptar y continuar sin programación'
          secondaryConfirmationText='Cancelar'
          confirmationCustomFunction={() => {
            forms.createSubscriptionForm.setValue('scheduled_rescue', false);
            setRescueErrorModal(false);
            handleSubmit(undefined, true); // vuelve a enviar con `scheduled_rescue = false`
          }}
        >
          <p className='text-sm text-neutral-700'>{rescueErrorMessage}</p>
        </Modal>
      </div>
    </div>
  );
};

function truncateToDecimals(num: number, dec = 2) {
  const calcDec = Math.pow(10, dec);
  return Math.trunc(num * calcDec) / calcDec;
}

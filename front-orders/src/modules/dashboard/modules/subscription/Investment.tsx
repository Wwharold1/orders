/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Tab } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Modal } from '@/common/components';
import { IconMoney } from '@/common/components/icons/subscription/IconMoney';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import {
  ContextRoutesEnum,
  GeneralStatusEnum,
  MediaQueryEnum,
} from '@/common/enums';
import { convertBase64 } from '@/common/helper/fileHelper';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import {
  IAmountMinInversionResponse,
  IHasPendingSuscriptionResponse,
} from '@/common/interfaces';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { setCustomerSerie } from '@/modules/auth/slice/authSlice';
import { useInvestment } from '@/modules/dashboard/hooks/useInvestment';
import {
  InvestmentDetail,
  InvestmentReceipt,
} from '@/modules/dashboard/modules/subscription/components/investment';
import { InvestmentBanks } from '@/modules/dashboard/modules/subscription/components/investment/InvestmentBanks';
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
  SubscriptionFormEnum,
  TabInvestmentSubscriptionEnum,
} from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setPaymentMethod } from '@/modules/dashboard/slice/paymentMethodSlice';
import { setInvestmentTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import {
  setAmountMinInversion,
  setAmountMinInversionB,
  setCurrentCollector,
  setCurrentSubscription,
  setPendingSubscription,
} from '@/modules/dashboard/slice/subscriptionSlice';
import { FundsService } from '@/services';
import { ProfileService } from '@/services/ProfileService';
import {
  fundDistributiveFundEnum,
  SerieCodEnum,
} from '@/modules/dashboard/modules/subscription/enum/distributiveFund.enum';
import { setSerieCodigo } from '@/modules/dashboard/slice/subscriptionSerieSlice';

export const aceptedImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export const Investment = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);

  const { investmentTab, investmentTabs } = useAppSelector(
    (state) => state.subscription_layout
  );
  const currentFund = useAppSelector((state) => state.subscription.currentFund);
  if (!currentFund) throw new Error('Fund not found');

  const currentUser = useAppSelector((state) => state.session.currentUser);
  const { paymentMethod } = useAppSelector((state) => state.payment_method);

  const { status } = currentUser || {};
  const isSuspended = status === GeneralStatusEnum.SUSPENDED;

  const [isLoadingWithDelay, setIsLoadingWithDelay] = useStateCallback(true);
  const [isFirstEntry, setIsFirstEntry] = useStateCallback(true);
  const [lastInvestmentTab, setLastInvestmentTab] =
    useStateCallback(investmentTab);
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const [openModalInterrupt, setOpenModalInterrupt] =
    useStateCallback<boolean>(false);
  const [currentImage, setCurrentImage] = useStateCallback<string>('');
  const [imageDimensions, setImageDimensions] = useStateCallback({
    width: 0,
    height: 0,
  });

  const {
    forms,
    mutations,
    modal,
    setInvestmentFormData,
    getInvestmentFormData,
    clearInvestmentFormData,
  } = useInvestment();

  const updatedInvestmentTabs =
    paymentMethod === PaymentMethodEnum.TRANSFER
      ? investmentTabs
      : investmentTabs.slice(0, 1);

  useFormPersist(SubscriptionFormEnum.SUBCRIPTION_RECEIPT, {
    watch: forms.createPaymentForm.watch,
    setValue: forms.createPaymentForm.setValue,
    storage: window.localStorage,
  });

  const {
    data: _,
    isFetching: isGetActiveCusomerFetching,
    refetch,
  } = useQuery<any>(
    ['customer-serie'],
    () => ProfileService().getActiveCustomerSerie(currentUser?.id as any),
    {
      onSuccess: (data) => {
        dispatch(setCustomerSerie(data));
        mutations.pendingSubscriptionMutation.mutate(
          {
            fund_id: currentFund.id.toString(),
            serie_id: data.id,
          },
          {
            onSuccess: ({ data }: IHasPendingSuscriptionResponse) => {
              if (!data.has_pending_suscription) {
                dispatch(
                  setInvestmentTab(TabInvestmentSubscriptionEnum.DETAIL)
                );
                dispatch(setPendingSubscription(null));
                return;
              }

              dispatch(
                setCurrentSubscription({
                  amount: Number(data.pending_suscription.amount),
                  id: Number(data.pending_suscription.id),
                  funds_origin_id: data.pending_suscription.funds_origin_id,
                })
              );
              dispatch(setPendingSubscription(data.pending_suscription));
              data.pending_suscription.payment_method &&
                dispatch(
                  setPaymentMethod(data.pending_suscription.payment_method)
                );

              if (investmentTab === TabInvestmentSubscriptionEnum.RECEIPT)
                return;

              if (
                data.pending_suscription?.payment_method ===
                  PaymentMethodEnum.TRANSFER &&
                isFirstEntry
              ) {
                dispatch(setCurrentCollector(null));
                dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.BANKS));
                return;
              }

              if (
                data.pending_suscription?.payment_method ===
                  PaymentMethodEnum.ONLINE &&
                data.pending_suscription?.payment_status ===
                  PaymentStatusEnum.SUCCESS
              ) {
                dispatch(setCurrentCollector(null));
                router.push(ContextRoutesEnum.BIOMETRIC_VALIDATION);
              }
            },
            onSettled: () => {
              setIsFirstEntry(false);
            },
          }
        );
      },
    }
  );
  const serieCodigoStore = useAppSelector(
    (state) => state.subscriptionSerie.serieCodigo
  );
  const isDistributiveFund =
    currentFund?.codFund === fundDistributiveFundEnum.codFund;

  const fundId = currentFund?.id?.toString();
  const serieParam = isDistributiveFund ? serieCodigoStore : '999';

  const { data: _minAmountData, isFetching: isFetchingMinAmount } =
    useQuery<IAmountMinInversionResponse>(
      ['min-amount-inversion', fundId, serieParam],
      () => FundsService().getMinAmountByFund(fundId!, serieParam),
      {
        enabled: !!fundId && (!isDistributiveFund || !!serieCodigoStore),
        onSuccess: ({ data }) => {
          dispatch(setAmountMinInversion(data));
        },
      }
    );
  useEffect(() => {
    if (!isDistributiveFund || serieCodigoStore !== SerieCodEnum.SERIE_A)
      return;

    const fundId = currentFund?.id?.toString();
    const serieB = SerieCodEnum.SERIE_B;

    if (fundId) {
      FundsService()
        .getMinAmountByFund(fundId, serieB)
        .then(({ data }) => {
          dispatch(setAmountMinInversionB(data));
        });
    }
  }, [isDistributiveFund, serieCodigoStore, currentFund]);

  const setTabRoute = () => {
    const tab = Number(router.query?.tab);
    if (!Object.values(TabInvestmentSubscriptionEnum).includes(tab)) return;
    dispatch(setInvestmentTab(tab as TabInvestmentSubscriptionEnum));
  };

  const setFileInvestmentData = () => {
    const { file } = getInvestmentFormData();
    forms.createPaymentForm.setValue('file', file);
  };

  const setImageView = (file: any) => {
    Array.from(file).length &&
      convertBase64(file[0] as File, (width, height, reader) => {
        setImageDimensions({ width, height });
        setCurrentImage(reader.result as string);
      });
  };

  useEffect(() => {
    if (isSuspended) {
      router.push(ContextRoutesEnum.DASHBOARD);
      return;
    }
    setTabRoute();
    setFileInvestmentData();
    dispatch(setPendingSubscription(null));
    dispatch(setPaymentMethod(PaymentMethodEnum.TRANSFER));
    const invevestmentFormData = getInvestmentFormData();
    if (!invevestmentFormData.suscription_id) {
      dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.DETAIL));
    }
  }, []);

  useEffect(() => {
    if (isSuspended) return;

    if (investmentTab > lastInvestmentTab) {
      setLastInvestmentTab(investmentTab);
    }

    const shouldRefetch =
      !isFirstEntry &&
      !!currentUser?.serie &&
      !isGetActiveCusomerFetching &&
      investmentTab === TabInvestmentSubscriptionEnum.DETAIL;

    if (shouldRefetch) {
      refetch();
    }
  }, [investmentTab]);

  useEffect(() => {
    if (isSuspended) return;
    let timeout: NodeJS.Timeout;
    const isPendingSubLoading = mutations.pendingSubscriptionMutation.isLoading;
    if (
      isGetActiveCusomerFetching ||
      isPendingSubLoading ||
      isFetchingMinAmount
    ) {
      setIsLoadingWithDelay(true);
    } else {
      timeout = setTimeout(() => {
        setIsLoadingWithDelay(false);
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [
    isFetchingMinAmount,
    isGetActiveCusomerFetching,
    mutations.pendingSubscriptionMutation.isLoading,
  ]);

  useEffect(() => {
    if (isSuspended) return;
    const fileList = forms.createPaymentForm.getValues('file');
    const fileType = fileList?.[0]?.type;
    if (aceptedImageTypes.includes(fileType)) {
      setImageView(fileList);
    } else {
      forms.createPaymentForm.setValue('file', '');
      setCurrentImage('');
    }
  }, [forms.createPaymentForm.watch('file')]);
  useEffect(() => {
    if (!serieCodigoStore && isDistributiveFund) {
      const storedSerie = localStorage.getItem('serieCodigo') as '000' | '001';
      if (storedSerie) {
        dispatch(setSerieCodigo({ serieCodigo: storedSerie }));
      }
    }
  }, [currentFund]);

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout routeBack={() => setOpenModalInterrupt(true)}>
        {!isSuspended ? (
          <div className='relative rounded-lg bg-white px-4 pt-6 md:px-6'>
            <div className='flex space-x-4 border-b border-neutral-100 pb-4 md:hidden'>
              <div className='rounded-full border border-solid border-primary-500 p-1'>
                <div className='flex items-center justify-center rounded-full  bg-primary-500 p-3'>
                  <IconMoney />
                </div>
              </div>
              <div className='flex flex-col justify-center space-y-2'>
                <p className='text-xs leading-none text-primary-300'>
                  PASO {investmentTab + 1} DE {updatedInvestmentTabs.length}
                </p>
                <p className='text-lg font-bold leading-none text-primary-900'>
                  {
                    updatedInvestmentTabs.find((e) => e.id === investmentTab)
                      ?.title
                  }
                </p>
              </div>
            </div>
            <Tab.Group
              selectedIndex={investmentTab}
              onChange={(e) => dispatch(setInvestmentTab(e as never))}
            >
              <Tab.List className='hidden space-x-4 rounded-lg border-b border-neutral-100 ring-0 md:block'>
                {updatedInvestmentTabs.map((tab, index) => {
                  return (
                    <Tab className='pointer-events-none' key={index}>
                      {({ selected }) => (
                        <div
                          className={clsx(
                            'relative p-4 px-0 pb-2.5 font-bold transition-all duration-150 ease-in hover:!text-primary-400',
                            selected
                              ? 'text-primary-500'
                              : index < 1
                              ? 'text-neutral-200'
                              : lastInvestmentTab >= index
                              ? 'text-neutral-400'
                              : 'text-neutral-200'
                          )}
                        >
                          {tab.title}
                          {selected && (
                            <div className='absolute bottom-0 left-1/2 h-1.5 w-full -translate-x-1/2 rounded-t-md bg-primary-500'></div>
                          )}
                        </div>
                      )}
                    </Tab>
                  );
                })}
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <InvestmentDetail
                    modal={setOpenModalCancel}
                    isLoading={isLoadingWithDelay}
                  />
                </Tab.Panel>
                {paymentMethod === PaymentMethodEnum.TRANSFER && (
                  <>
                    <Tab.Panel>
                      <InvestmentBanks modal={setOpenModalCancel} />
                    </Tab.Panel>
                    <Tab.Panel>
                      <InvestmentReceipt
                        currentImage={currentImage}
                        imageDimensions={imageDimensions}
                        setCurrentImage={setCurrentImage}
                        modal={setOpenModalCancel}
                        useInvestmentInstance={[
                          forms,
                          mutations,
                          modal,
                          setInvestmentFormData,
                          getInvestmentFormData,
                        ]}
                        isLoading={isLoadingWithDelay}
                      />
                    </Tab.Panel>
                  </>
                )}
              </Tab.Panels>
            </Tab.Group>
          </div>
        ) : (
          <p className='text-white'>
            No cuentas con los accesos para realizar una inversión.
          </p>
        )}
        <Modal
          isOpen={openModalCancel}
          title='¿Seguro que deseas cancelar tu suscripción?'
          setIsOpen={setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Cancelar suscripción'
          confirmationCustomFunction={() => {
            clearInvestmentFormData();
            router.push(ContextRoutesEnum.DASHBOARD);
          }}
          extended={isMdDown}
          secondaryConfirmationText='Volver al formulario'
        >
          <span className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </span>
        </Modal>
        <Modal
          isOpen={openModalInterrupt}
          title='¿Deseas interrumpir el proceso de suscripción?'
          setIsOpen={setOpenModalInterrupt}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() => {
            clearInvestmentFormData();
            router.push(ContextRoutesEnum.DASHBOARD);
          }}
          extended
          modalLength={500}
          secondaryConfirmationText='Cancelar'
        >
          <span className='text-neutral-600'>
            Si sales ahora, tu información podría no guardarse.{' '}
          </span>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

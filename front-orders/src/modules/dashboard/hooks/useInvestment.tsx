/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import router from 'next/router';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { notifyError } from '@/common/components';
import {
  ContextRoutesEnum,
  ContextSplashEnum,
  OriginTypeEnum,
} from '@/common/enums';
import { getSavedQueryParams } from '@/common/helper/queryParams';
import { sendGMT } from '@/common/helper/sendGMT';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import {
  IAmountMinInversion,
  IFundSerie,
  IHasPendingSuscriptionResponse,
} from '@/common/interfaces/subscription.interface';
import { GMTEnum } from '@/modules/auth/enums/gmt.enum';
import {
  createPaymentValidationSchema,
  createSubscriptionValidationSchema,
  TCreatePaymentForm,
  TCreateSubscriptionForm,
} from '@/modules/dashboard/helpers/investmentValidationSchema';
import {
  PaymentMethodEnum,
  SubscriptionFormEnum,
  TabInvestmentSubscriptionEnum,
} from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setInvestmentTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import {
  setAmountMinInversion,
  setCurrentCollector,
  setCurrentFund,
  setCurrentSubscription,
  setPendingSubscription,
  toggleDisabledButton,
} from '@/modules/dashboard/slice/subscriptionSlice';
import { setSplash } from '@/redux/common/layoutSlice';
import { InvestmentService } from '@/services/InvestmentService';

interface IFundItem extends IFundSerie {
  fund_spectrum: any;
}

const investFormData: TCreatePaymentForm = {
  collector_account_prudential_id: 0,
  operation_number: '',
  file: [],
  suscription_id: 0,
};
export const useInvestment = (fundItem?: IFundItem) => {
  const dispatch = useAppDispatch();
  const [openModalPayment, setOpenModalPayment] =
    useStateCallback<boolean>(false);

  const [onDisabledModal, setOnDisabledModal] =
    useStateCallback<boolean>(false);
  const currentFund = useAppSelector((state) => state.subscription.currentFund);
  const subscriptionSlice = useAppSelector((state) => state.subscription);

  const createSubscriptionForm = useForm<TCreateSubscriptionForm>({
    resolver: zodResolver(createSubscriptionValidationSchema),
    defaultValues: {
      fund_id: currentFund?.id,
      money_type: currentFund?.spectrumFund?.moneda,
    },
  });

  const createPaymentForm = useForm<TCreatePaymentForm>({
    resolver: zodResolver(createPaymentValidationSchema),
    defaultValues: {
      collector_account_prudential_id: subscriptionSlice.currentCollector?.id,
      suscription_id: subscriptionSlice.currentSubscription?.id,
    },
  });

  const setInvestmentFormData = (data: TCreatePaymentForm) => {
    Object.assign(investFormData, data);
  };
  const clearInvestmentFormData = () => {
    Object.assign(investFormData, {
      collector_account_prudential_id: 0,
      operation_number: '',
      file: [],
      suscription_id: 0,
    });
    dispatch(setCurrentCollector(null));
    dispatch(setPendingSubscription(null));
    dispatch(setCurrentSubscription(null));
    dispatch(setAmountMinInversion(null));
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_DETAIL);
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_RECEIPT);
    createSubscriptionForm.reset();
  };

  const getInvestmentFormData = () => {
    return investFormData;
  };

  const hasPendingSubscriptionMutation =
    useQuery<IHasPendingSuscriptionResponse>(
      [
        'has-pending-subscription-',
        fundItem && fundItem!.fund_id,
        fundItem && fundItem!.serie_id!,
      ],
      {
        queryFn: () =>
          InvestmentService().hasPendingSubscription(
            fundItem?.fund_id?.toString(),
            fundItem?.serie_id?.toString()
          ),
        enabled: false,
        onSuccess: (res) => {
          dispatch(setCurrentFund(fundItem!.fund_spectrum));
          if (res.data.has_pending_suscription) {
            router.push(
              {
                pathname: ContextRoutesEnum.SUBSCRIPTION_INVESTMENT,
                query: {
                  ...res.data.pending_suscription,
                },
              },
              ContextRoutesEnum.SUBSCRIPTION_INVESTMENT
            );
          } else {
            router.push(ContextRoutesEnum.SUBSCRIPTION_INVESTMENT);
            dispatch(setInvestmentTab(0));
          }
        },
      }
    );

  const pendingSubscriptionMutation = useMutation(
    (params: { fund_id: string; serie_id: string }) =>
      InvestmentService().hasPendingSubscription(
        params.fund_id,
        params.serie_id
      )
  );

  const subscriptionMutation = useMutation(
    (subscription: TCreateSubscriptionForm) =>
      InvestmentService().createSubscription(subscription)
  );
  const paymentMutation = useMutation((payment: any) =>
    InvestmentService().createPayment(payment)
  );
  const submitSuscription = (
    values: TCreateSubscriptionForm,
    minAmount: IAmountMinInversion
  ) => {
    subscriptionMutation.mutate(values, {
      onSuccess: (res) => {
        if (res.message) {
          if (res.message.includes('solicitud')) {
            notifyError({
              title: res.message.split('. ')[1],
              subtitle: res.message.split('. ')[0],
            });
            return;
          }

          notifyError({
            title: res.message,
          });

          return;
        }

        const { amount, funds_origin_id, payment_method } = values;
        const { id } = res.data;
        const basicSubscription = {
          amount,
          id,
          funds_origin_id,
          payment_method: payment_method as PaymentMethodEnum,
        };
        dispatch(setCurrentSubscription({ ...basicSubscription }));
        dispatch(
          setPendingSubscription({
            ...basicSubscription,
            terms_and_conditions: true,
            origin_conditions: true,
          })
        );

        if (res.data.payment_url) {
          window.open(res.data.payment_url, '_self');
          return;
        } else {
          dispatch(setCurrentCollector(null));
          dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.BANKS));
        }
      },
    });
  };
  const submitPayment = (
    values: TCreatePaymentForm & { imageBiometric: string }
  ) => {
    dispatch(toggleDisabledButton(true));
    const formData = new FormData();
    if (subscriptionSlice.currentCollector) {
      formData.append(
        'collector_account_prudential_id',
        subscriptionSlice.currentCollector.id.toString() || ''
      );
    }
    formData.append('operation_number', values.operation_number);
    formData.append(
      'suscription_id',
      subscriptionSlice.currentSubscription!.id!.toString()
    );
    formData.append('file', values.file[0] || '');
    formData.append('imageBiometric', values.imageBiometric);
    formData.append('channel_register', OriginTypeEnum.WEB);

    const savedQueryParams = getSavedQueryParams();
    const uuid = uuidv4();

    if (savedQueryParams) {
      const { utm_source, utm_medium, utm_campaign } = savedQueryParams;
      if (utm_source) formData.append('utm_source', utm_source);
      if (utm_medium) formData.append('utm_medium', utm_medium);
      if (utm_campaign) formData.append('utm_campaign', utm_campaign);
    }

    if (uuid) formData.append('transac_id', uuid);

    paymentMutation.mutate(formData, {
      onSuccess: () => {
        sendGMT(GMTEnum.ACCOUNT_OPENIG, uuid);
        dispatch(
          setSplash({
            show: true,
            type: ContextSplashEnum.CREATE_PAYMENT_SUCCESS,
          })
        );
        clearInvestmentFormData();
      },
      onError: (e) => {
        const errorMessage = isAxiosError(e)
          ? e.response?.data?.message
          : 'Error al procesar el pago';
        notifyError({
          title: errorMessage,
        });
      },
      onSettled: () => {
        dispatch(toggleDisabledButton(false));
      },
    });
  };

  return {
    forms: {
      createSubscriptionForm,
      createPaymentForm,
    },
    mutations: {
      subscriptionMutation,
      paymentMutation,
      hasPendingSubscriptionMutation,
      pendingSubscriptionMutation,
    },
    submitHandlers: {
      submitSuscription,
      submitPayment,
    },
    modal: {
      setOpenModalPayment,
      setOnDisabledModal,
      onDisabledModal,
      openModalPayment,
    },
    setInvestmentFormData,
    clearInvestmentFormData,
    getInvestmentFormData,
  };
};

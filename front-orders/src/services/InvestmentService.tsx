import { isAxiosError } from 'axios';

import { OriginTypeEnum } from '@/common/enums';
import { apiUrl } from '@/common/utils/axios';
import {
  TCreatePaymentForm,
  TCreateSubscriptionForm,
} from '@/modules/dashboard/helpers/investmentValidationSchema';

const suscriptionUrl = '/suscription';
const paymentUrl = '/payment';

export const InvestmentService = () => {
  const fundsOriginList = async () => {
    try {
      return (await apiUrl.get(`/funds-origin/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const createScheduledRescue = async (data: any) => {
    try {
      return (await apiUrl.post(`/spectrum/contract/scheduled-rescue`, data))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw error.response?.data || new Error('Error desconocido en rescate');
      }
      throw new Error('Error no manejado en rescate');
    }
  };

  const createSubscription = async (data: TCreateSubscriptionForm) => {
    try {
      return (
        await apiUrl.post(`${suscriptionUrl}/create`, {
          ...data,
          origin: OriginTypeEnum.WEB,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const hasPendingSubscription = async (
    fund_id?: string,
    serie_id?: string
  ) => {
    try {
      return (
        await apiUrl.get(
          `${suscriptionUrl}/has-pending-suscription?fund_id=${fund_id}&serie_id=${serie_id}`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  //payment/create
  const createPayment = async (data: TCreatePaymentForm) => {
    try {
      return (await apiUrl.post(`${paymentUrl}/create`, data)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw error;
      }
    }
  };

  const getCollectorAccounts = async (fund_id: number) => {
    try {
      return (
        await apiUrl.post(
          `${suscriptionUrl}/list-collector-account/${fund_id.toString()}`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    fundsOriginList,
    createSubscription,
    getCollectorAccounts,
    createPayment,
    hasPendingSubscription,
    createScheduledRescue,
  };
};

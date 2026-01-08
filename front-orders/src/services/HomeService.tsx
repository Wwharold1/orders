import { isAxiosError } from 'axios';

import { IListOrderResponse } from '@/common/interfaces';
import { apiUrl } from '@/common/utils/axios';
import { TCreateOrderForm, TDeleteOrderForm, TUpdateOrderForm } from '@/modules/dashboard/helpers/orderValidationSchema';

const orderUrl = '/orders';

export const HomeService = () => {
  const listOrders = async () => {
    try {
      return (
        await apiUrl.get<IListOrderResponse>(
          `${orderUrl}/getAll`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const createOrder = async (data: TCreateOrderForm) => {
    try {
      return (
        await apiUrl.post(`${orderUrl}/create`, {
          ...data,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const updateOrder = async (orderId: number, data: TUpdateOrderForm) => {
    const request = {
      Id: orderId,
      ...data
    }
    try {
      return (
        await apiUrl.put(`${orderUrl}/update`, {
          ...request,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const deleteOrder = async (data: TDeleteOrderForm) => {
    try {
      return (
        await apiUrl.delete(`${orderUrl}/delete`, {
          data: {...data}
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    listOrders,
    createOrder,
    updateOrder,
    deleteOrder
  };
};

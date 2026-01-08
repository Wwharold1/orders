/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import router from 'next/router';
import { useForm } from 'react-hook-form';

import { notifyError, notifyInfo } from '@/common/components';
import {
  ContextRoutesEnum,
} from '@/common/enums';
import {
  useStatePersist,
} from '@/common/hooks';
import { IOrder } from '@/common/interfaces';
import { HomeService } from '@/services/HomeService';

import { createOrderValidationSchema, TCreateOrderForm, TDeleteOrderForm, TUpdateOrderForm } from '../helpers/orderValidationSchema';

const orderFormData: TCreateOrderForm = {
  customer: '',
  orderDate: '',
  orderNumber: '',
  total: 0
};

export const useOrder = () => {
  const queryClient = useQueryClient();
  const [selectOrder, setSelectOrder] =
    useStatePersist<IOrder | null>(null, 'selected-order');

  const createOrderForm = useForm<TCreateOrderForm>({
    resolver: zodResolver(createOrderValidationSchema),
  });

  const updateOrderForm = useForm<TUpdateOrderForm>({
    resolver: zodResolver(createOrderValidationSchema),
  });

  const setOrderFormData = (data: TCreateOrderForm) => {
    Object.assign(orderFormData, data);
  };

  const clearOrderFormData = () => {
    Object.assign(orderFormData, {
        customer: '',
        orderDate: '',
        orderNumber: '',
        total: 0
    });
  };

  const getOrderFormData = () => {
    return orderFormData;
  };

  const orderCreateMutation = useMutation(
    (order: TCreateOrderForm) =>
      HomeService().createOrder(order)
  );

  const submitCreateOrder = (
    values: TCreateOrderForm
  ) => {
    orderCreateMutation.mutate(values, {
      onSuccess: (res) => {
        if (res.status == 400) {
            notifyError({
              title: 'Error de duplicidad',
              subtitle: 'Ya se ha registrado ese numero de orden ingresado.'
            });
            return;
        } else {
            notifyInfo({
                title: 'Se registró correctamente la orden',
            });
            router.push(ContextRoutesEnum.DASHBOARD);
        }
      },
    });
  };
  
  const orderUpdateMutation = useMutation(
    (order: TUpdateOrderForm) =>
      HomeService().updateOrder(selectOrder?.id ?? 0, order)
  );

  const submitUpdateOrder = (
    values: TUpdateOrderForm
  ) => {
    orderUpdateMutation.mutate(values, {
      onSuccess: (res) => {
        if (res.status == 400) {
            notifyError({
              title: 'Error de duplicidad',
              subtitle: 'Ya se ha registrado ese numero de orden ingresado.'
            });
            return;
        } else {
            notifyInfo({
                title: 'Se actualizó correctamente la orden',
            });
            setSelectOrder(null);
            router.push(ContextRoutesEnum.DASHBOARD);
        }
      },
    });
  };

  const orderDeleteMutation = useMutation(
    (order: TDeleteOrderForm) =>
      HomeService().deleteOrder(order)
  );

  const submitDeleteOrder = (
    values: TDeleteOrderForm
  ) => {
    orderDeleteMutation.mutate(values, {
      onSuccess: (res) => {
        if (res.status == 400) {
            notifyError({
              title: 'Error de duplicidad',
              subtitle: 'Ya se ha registrado ese numero de orden ingresado.'
            });
            return;
        } else {
            notifyInfo({
                title: 'Se eliminó correctamente la orden',
            });
            setSelectOrder(null);
            queryClient.invalidateQueries(['list-orders']);
        }
      },
    });
  };

  return {
    forms: {
      createOrderForm,
      updateOrderForm
    },
    mutations: {
      orderCreateMutation,
      orderUpdateMutation,
      orderDeleteMutation
    },
    state: {
      setSelectOrder,
      selectOrder,
    },
    submitHandlers: {
      submitCreateOrder,
      submitUpdateOrder,
      submitDeleteOrder
    },
    setOrderFormData,
    clearOrderFormData,
    getOrderFormData,
  };
};

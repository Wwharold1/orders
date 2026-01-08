/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/common/hooks';
import { IListOrderResponse } from '@/common/interfaces';
import {
  setSubscriptions,
} from '@/modules/dashboard/slice/subscriptionSlice';
import { HomeService } from '@/services/HomeService';

export const useHome = () => {
  const dispatch = useAppDispatch();
  const listOrdersQuery = useQuery<IListOrderResponse>(
    ['list-orders'],
    () => HomeService().listOrders(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        dispatch(setSubscriptions(res.data));
      },
    }
  );
  return {
    queries: {
      listOrdersQuery,
    },
  };
};

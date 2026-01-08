/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query';

import { IListOrderResponse } from '@/common/interfaces';
import { HomeService } from '@/services/HomeService';

export const useHome = () => {
  const listOrdersQuery = useQuery<IListOrderResponse>(
    ['list-orders'],
    () => HomeService().listOrders(),
    {
      retry: false,
      refetchOnWindowFocus: false
    }
  );
  return {
    queries: {
      listOrdersQuery,
    },
  };
};

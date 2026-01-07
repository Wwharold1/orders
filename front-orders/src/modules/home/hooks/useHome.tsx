/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query';

import { useAppDispatch } from '@/common/hooks';
import { IListFundsByCustomerResponse } from '@/common/interfaces';
import { IBankAccountResponse } from '@/common/interfaces/bank.account.interface';
import {
  hasSubscription,
  setSubscriptions,
} from '@/modules/dashboard/slice/subscriptionSlice';
import {
  MoneyTypeEnum,
  SpectrumMoneyTypeKey,
} from '@/modules/home/enum/money.type.enum';
import {
  setHasBankAccount,
  setMoneyTypes,
} from '@/modules/rescue/slice/rescueSlice';
import { BankAccountService } from '@/services/BankAccountService';
import { HomeService } from '@/services/HomeService';

export const useHome = () => {
  const dispatch = useAppDispatch();
  const listFundsByCustomerQuery = useQuery<IListFundsByCustomerResponse>(
    ['list-funds-by-customer'],
    () => HomeService().listFundsByCustomer(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        dispatch(setSubscriptions(res.data));
        if (res.data.funds_serie?.length) {
          dispatch(hasSubscription(true));
        } else {
          dispatch(hasSubscription(false));
        }
      },
    }
  );
  useQuery<IBankAccountResponse>(
    ['bank-account-list'],
    () => BankAccountService().getBankAccounts(),
    {
      onSuccess: (res) => {
        if (res.data?.length) {
          const dataMoneyType = Array.from(
            new Set(
              res.data.map(
                (o) => SpectrumMoneyTypeKey[o.money_type as MoneyTypeEnum]
              )
            )
          );
          dispatch(setMoneyTypes(dataMoneyType));
          dispatch(setHasBankAccount(true));
        } else dispatch(setHasBankAccount(false));
      },
    }
  );
  return {
    queries: {
      listFundsByCustomerQuery,
    },
  };
};

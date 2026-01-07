import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { apiUrl } from '@/common/utils/axios';
import {
  TCreateAccountForm,
  TUpdateAccountForm,
} from '@/modules/accounts/helpers/accountValidationSchemas';

const bankAccountUrl = '/app/bank-account';

export const BankAccountService = () => {
  const createBankAccount = createAsyncThunk(
    'bank-account/create',
    async (data: TCreateAccountForm) => {
      try {
        return (await apiUrl.post(`${bankAccountUrl}`, data)).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );
  const deleteBankAccount = createAsyncThunk(
    'bank-account/delete',
    async (bankAccountId: number) => {
      try {
        return (await apiUrl.delete(`${bankAccountUrl}/${bankAccountId}`)).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );
  const updateBankAccount = async (
    bankAccountId: number,
    data: TUpdateAccountForm
  ) => {
    try {
      return (await apiUrl.put(`${bankAccountUrl}/${bankAccountId}`, data))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const getBankAccounts = async () => {
    try {
      return (await apiUrl.get(`${bankAccountUrl}/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    createBankAccount,
    getBankAccounts,
    deleteBankAccount,
    updateBankAccount,
  };
};

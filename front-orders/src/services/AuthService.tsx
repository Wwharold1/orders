import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import {
  ILogin,
  ILoginResponse,
} from '@/common/interfaces/auth.interface';
import { apiUrl, noTokenApiUrl } from '@/common/utils/axios';

export const AuthService = () => {
  const login = createAsyncThunk('auth/login', async (values: ILogin) => {
    try {
      return (
        await noTokenApiUrl.post<ILoginResponse>('/auth/login', {
          ...values,
          app: true,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  });

  const logoutCustomer = createAsyncThunk('auth/logout', async () => {
    try {
      return (await apiUrl.post<any>(`auth/logout`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  });

  return {
    login,
    logoutCustomer,
  };
};

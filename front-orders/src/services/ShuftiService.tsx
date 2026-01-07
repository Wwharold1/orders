import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { IMakeAmlResponse } from '@/common/interfaces/shufti.interface';
import { apiUrl } from '@/common/utils/axios';

const shuftiUrl = '/shufti';

export const ShuftiService = () => {
  const makeAml = createAsyncThunk('shufti/make-aml', async () => {
    try {
      return (await apiUrl.post<IMakeAmlResponse>(`${shuftiUrl}/make-aml`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  });

  return {
    makeAml,
  };
};

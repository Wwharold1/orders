import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { DocumentTagEnum } from '@/common/enums/document-tag.enum';
import {
  IDownloadEECCRequest,
  IFundByUserResponse,
  IProfileFundResponse,
  TShowFundResponse,
} from '@/common/interfaces';
import { apiUrl } from '@/common/utils/axios';

const fundUrl = '/fund';
const userAppUrl = '/user/app';

export const FundsService = (abortController?: AbortController) => {
  const fundByUser = createAsyncThunk('fund/funds-by-user', async () => {
    try {
      return (await apiUrl.get<IFundByUserResponse>(`${fundUrl}/funds-by-user`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  });

  const showFunds = async () => {
    try {
      return (
        await apiUrl.patch<TShowFundResponse>(`${fundUrl}/show-funds-funding`)
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getMinAmountByFund = async (fund_id: string, serieCodigo = '999') => {
    try {
      return (
        await apiUrl.get(
          `${userAppUrl}/get-amount-min-inversion/${fund_id}/${serieCodigo}`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const profileFund = async () => {
    try {
      return (await apiUrl.get<IProfileFundResponse>(`/profile-fund/list`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const downloadEECC = async (values: IDownloadEECCRequest) => {
    try {
      return (
        await apiUrl.post(`${fundUrl}/download-eecc`, values, {
          responseType: 'arraybuffer',
          signal: abortController ? abortController.signal : undefined,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const getFilesByTag = async ({
    fund_id,
    document_tag,
  }: {
    fund_id: number;
    document_tag: DocumentTagEnum;
  }) => {
    try {
      const file = await apiUrl.get(
        `${fundUrl}/files-by-tag/${fund_id}?document_tag=${document_tag}`
      );
      return file.data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    profileFund,
    showFunds,
    fundByUser,
    downloadEECC,
    getMinAmountByFund,
    getFilesByTag,
  };
};

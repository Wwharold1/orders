import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { OriginTypeEnum } from '@/common/enums';
import {
  ITOCFaceDocument,
  ITOCRegisterValidation,
  ITOCSessionManagerResponse,
  ITOCVerifyAccount,
  ITOCVerifyAccountResponse,
  TOCFaceVsDocument,
} from '@/common/interfaces/auth.interface';
import { apiUrl, TOCApiUrl } from '@/common/utils/axios';

export const TOCService = () => {
  const TOCSessionManager = createAsyncThunk(
    'toc/toc-session-manager',
    async () => {
      try {
        return (
          await TOCApiUrl.post<ITOCSessionManagerResponse>(`/sesion-manager`, {
            liveness: true,
            autocapture: true,
          })
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const TOCRegisterValidation = createAsyncThunk(
    'toc/face-vs-dni',
    async (values: ITOCRegisterValidation) => {
      try {
        return (
          await apiUrl.post<ITOCRegisterValidation>(`toc/face-vs-dni`, {
            ...values,
            origin: OriginTypeEnum.APP,
          })
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );
  const TOCFaceDocument = createAsyncThunk(
    'toc/face-vs-dni',
    async (values: ITOCFaceDocument) => {
      try {
        return (
          await apiUrl.post<ITOCFaceDocument>(`toc/face-vs-document`, {
            ...values,
            origin: OriginTypeEnum.APP,
          })
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );
  const TOCVerifyAccount = createAsyncThunk(
    'toc/app-face-vs-dni',
    async (values: ITOCVerifyAccount) => {
      try {
        return (
          await apiUrl.post<ITOCVerifyAccountResponse>(
            `toc-app/face-vs-dni`,
            values
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );
  const TOCFaceVsDocument = createAsyncThunk(
    'toc/app-face-vs-document',
    async (values: TOCFaceVsDocument) => {
      try {
        return (await apiUrl.post(`toc-app/face-vs-document`, values)).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  return {
    TOCSessionManager,
    TOCVerifyAccount,
    TOCRegisterValidation,
    TOCFaceDocument,
    TOCFaceVsDocument,
  };
};

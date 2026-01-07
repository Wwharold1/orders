import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import {
  FacephiCivilValidation,
  FacephiFaceVsReniec,
  FacephiNoAuthCivilValidation,
} from '@/common/interfaces';
import { apiUrl } from '@/common/utils/axios';

export const FacephiService = () => {
  const FacephiCivilValidationCall = createAsyncThunk(
    'facephi/civil-validation',
    async (values: FacephiCivilValidation) => {
      try {
        return (await apiUrl.post(`facephi/civil-validation`, values)).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const FacephiNoAuthCivilValidationCall = createAsyncThunk(
    'facephi/no-auth-civil-validation',
    async (values: FacephiNoAuthCivilValidation) => {
      try {
        return (await apiUrl.post(`facephi/no-auth-civil-validation`, values))
          .data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw error.response?.data;
        }
      }
    }
  );

  const FacephiFaceVsReniecCall = createAsyncThunk(
    'facephi/face-vs-reniec',
    async (values: FacephiFaceVsReniec) => {
      try {
        return (await apiUrl.post(`facephi/face-vs-reniec`, values)).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  return {
    FacephiCivilValidationCall,
    FacephiFaceVsReniecCall,
    FacephiNoAuthCivilValidationCall,
  };
};

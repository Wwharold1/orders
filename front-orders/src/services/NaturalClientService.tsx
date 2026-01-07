import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import {
  IActivityCustomerResponse,
  IFinalBeneficiary,
  IHomeCustomerResponse,
  IIdentifyCustomerResponse,
  IPersonalInformationResponse,
  ISpouseCustomerResponse,
  ITypeParticipateResponse,
} from '@/common/interfaces';
import { apiUrl } from '@/common/utils/axios';
import {
  TActivityClientForm,
  TFinalBeneficiaryForm,
  THomeClientForm,
  TIdentifyCustomerForm,
  TPersonalInformationForm,
  TSpouseClientForm,
  TTypeParticipateForm,
} from '@/modules/dashboard/helpers/naturalClientValidationSchemas';

const appCustomerUrl = '/app/customer';

export const NaturalClientService = () => {
  const postTypeParticipate = createAsyncThunk(
    'natural/post-type-participate',
    async (values: TTypeParticipateForm) => {
      try {
        return (
          await apiUrl.post<ITypeParticipateResponse>(
            `${appCustomerUrl}/type-participate`,
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

  const getTypeParticipate = async () => {
    try {
      return (
        await apiUrl.get<ITypeParticipateResponse>(
          `/type-participate-item/list`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const anuallyUpdateCustomer = createAsyncThunk(
    'natural/anually-update-customer',
    async (values: any) => {
      try {
        return (
          await apiUrl.post<any>(
            `${appCustomerUrl}/anually-edit-customer`,
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

  const postIdentifyCustomer = createAsyncThunk(
    'natural/post-identify-customer',
    async (values: TIdentifyCustomerForm) => {
      try {
        return (
          await apiUrl.post<IIdentifyCustomerResponse>(
            `${appCustomerUrl}/identify-customer`,
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

  const getIdentifyCustomer = async () => {
    try {
      return (
        await apiUrl.get<IIdentifyCustomerResponse>(
          `${appCustomerUrl}/identify-customer`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const postSpouseCustomer = createAsyncThunk(
    'natural/post-spouse-customer',
    async (values: TSpouseClientForm) => {
      try {
        return (
          await apiUrl.post<ISpouseCustomerResponse>(
            `${appCustomerUrl}/spouse`,
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
  const postFinalBeneficiary = createAsyncThunk(
    'user/final-beneficiary',
    async (values: TFinalBeneficiaryForm) => {
      try {
        return (await apiUrl.post<any>('user/final-beneficiary', values)).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const getFinalBeneficiary = async (customerId: string) => {
    try {
      return (
        await apiUrl.get<IFinalBeneficiary>(
          'user/final-beneficiary/' + customerId
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const getSpouseCustomer = async () => {
    try {
      return (
        await apiUrl.get<ISpouseCustomerResponse>(`${appCustomerUrl}/spouse`)
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const postProfileCustomer = createAsyncThunk(
    'natural/post-profile-customer',
    async (values: TPersonalInformationForm) => {
      try {
        return (
          await apiUrl.post<IPersonalInformationResponse>(
            `${appCustomerUrl}/profile`,
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
  const postChargePublic = createAsyncThunk(
    'natural/post-charge-public',
    async () => {
      try {
        return (
          await apiUrl.post(`${appCustomerUrl}/charge-public`, {
            charge_public_last_five_years: false,
            pep: true,
            institution: null,
            position: null,
          })
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const getProfileCustomer = async () => {
    try {
      return (await apiUrl.get(`${appCustomerUrl}/profile`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const postActivityCustomer = createAsyncThunk(
    'natural/post-activity-customer',
    async (values: TActivityClientForm) => {
      try {
        return (
          await apiUrl.post<IActivityCustomerResponse>(
            `${appCustomerUrl}/activity`,
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

  const getActivityCustomer = async () => {
    try {
      return (await apiUrl.get(`${appCustomerUrl}/activity`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const postHomeCustomer = createAsyncThunk(
    'natural/post-home-customer',
    async (values: THomeClientForm) => {
      try {
        return (
          await apiUrl.post<IHomeCustomerResponse>(
            `${appCustomerUrl}/home`,
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

  const getHomeCustomer = async () => {
    try {
      const { data } = await apiUrl.get(`${appCustomerUrl}/home`);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    postTypeParticipate,
    getTypeParticipate,
    postIdentifyCustomer,
    getIdentifyCustomer,
    postProfileCustomer,
    getProfileCustomer,
    postActivityCustomer,
    getActivityCustomer,
    postHomeCustomer,
    getHomeCustomer,
    postSpouseCustomer,
    postFinalBeneficiary,
    getSpouseCustomer,
    postChargePublic,
    anuallyUpdateCustomer,
    getFinalBeneficiary,
  };
};

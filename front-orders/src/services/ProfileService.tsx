import { isAxiosError } from 'axios';

import { IProfileFundsByCustomerResponse } from '@/common/interfaces/profile.interface';
import { apiUrl } from '@/common/utils/axios';
import {
  TEmailValidationForm,
  TPasswordValidationForm,
  TPhoneValidationForm,
  TProfileUpdateEmailForm,
  TProfileUpdatePhoneForm,
  TUpdatePasswordForm,
  TUpdateUsernameForm,
} from '@/modules/profile/helpers/profileValidationSchemas';

const profileUrl = '/profile';
const appCustomerUrl = '/app/customer';
const userAppUrl = '/user/app';

export const ProfileService = () => {
  const listFundsByCustomer = async () => {
    try {
      return (
        await apiUrl.get<IProfileFundsByCustomerResponse>(
          `${profileUrl}/list-funds-by-customer`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const validatePassword = async (data: TPasswordValidationForm) => {
    try {
      return (await apiUrl.post(`${appCustomerUrl}/validate-password`, data))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const validateEmail = async (data: TEmailValidationForm) => {
    try {
      return (await apiUrl.put(`${profileUrl}/validate-update-email`, data))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const validatePhone = async (data: TPhoneValidationForm) => {
    try {
      return (
        await apiUrl.put(`${profileUrl}/validate-update-phone-number`, data)
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const updateUsername = async (data: TUpdateUsernameForm) => {
    try {
      return (await apiUrl.put(`${profileUrl}/update-name`, data)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const updateEmail = async (data: TProfileUpdateEmailForm) => {
    try {
      return (await apiUrl.put(`${profileUrl}/update-email`, data)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const updatePhone = async (data: TProfileUpdatePhoneForm) => {
    try {
      return (await apiUrl.put(`${profileUrl}/update-phone-number`, data)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const updatePassword = async (data: TUpdatePasswordForm) => {
    try {
      return (await apiUrl.put(`${profileUrl}/update-password`, data)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const getActiveCustomerSerie = async (customer_id: string) => {
    try {
      return (
        await apiUrl.get(
          `${userAppUrl}/get-active-customer-serie/?customer_id=${customer_id}`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const getCanDelete = async () => {
    try {
      return (await apiUrl.get(`${userAppUrl}/can-delete`)).data;
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data;
    }
  };

  const requestDelete = async () => {
    try {
      return (await apiUrl.post(`${userAppUrl}/request-delete`)).data;
    } catch (error) {
      if (isAxiosError(error)) throw error.response?.data;
    }
  };

  return {
    listFundsByCustomer,
    validatePassword,
    updateUsername,
    validateEmail,
    updateEmail,
    validatePhone,
    updatePhone,
    updatePassword,
    getActiveCustomerSerie,
    getCanDelete,
    requestDelete,
  };
};

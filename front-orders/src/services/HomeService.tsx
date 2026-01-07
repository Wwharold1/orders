import { isAxiosError } from 'axios';

import { IListFundsByCustomerResponse } from '@/common/interfaces';
import { apiUrl } from '@/common/utils/axios';

const homeUrl = '/home';

export const HomeService = () => {
  const listFundsByCustomer = async () => {
    try {
      return (
        await apiUrl.get<IListFundsByCustomerResponse>(
          `${homeUrl}/list-funds-by-customer`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const userExistsInSpectrum = async () => {
    try {
      return (await apiUrl.post<boolean>(`${homeUrl}/exists-in-spectrum`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    listFundsByCustomer,
    userExistsInSpectrum,
  };
};

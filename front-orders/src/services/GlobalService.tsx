import { isAxiosError } from 'axios';

import { IGlobalDocumentsResponse } from '@/common/interfaces/global.config.interface';
import { apiUrl } from '@/common/utils/axios';
import { AuthService } from '@/services/AuthService';

const globalUrl = '/global-config';
const configurationUrl = '/configuration';

export const GlobalService = () => {
  const globalDocuments = async () => {
    try {
      let token = localStorage.getItem('public-token') ?? '';
      if (!token) {
        const user = await AuthService().loginSuperUser();
        token = user.token;
        localStorage.setItem('public-token', token);
      }
      const publicToken = process.env.NEXT_PUBLIC_TOKEN || 'public';
      return (
        await apiUrl.get<IGlobalDocumentsResponse>(
          `${globalUrl}/app-documents`,
          {
            headers: {
              'public-token': publicToken,
              Authorization: 'Bearer ' + token,
            },
          }
        )
      ).data;
    } catch (error) {
      localStorage.removeItem('public-token');
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const configurationList = async () => {
    try {
      return (await apiUrl.get(`${configurationUrl}/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    globalDocuments,
    configurationList,
  };
};

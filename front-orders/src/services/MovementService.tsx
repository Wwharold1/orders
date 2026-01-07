import { isAxiosError } from 'axios';

import { apiUrl } from '@/common/utils/axios';

const movementUrl = '/movement';

export const MovementService = () => {
  const getMovements = async (
    page: number,
    limit: number,
    search: string,
    filter?: { [key: string]: string | number }
  ) => {
    try {
      return (
        await apiUrl.get(
          `${movementUrl}/movement-by-user?page=${page}&limit=${limit}`,
          {
            params: { search, ...filter },
          }
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    getMovements,
  };
};

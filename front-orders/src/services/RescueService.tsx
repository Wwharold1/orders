import { isAxiosError } from 'axios';

import { OriginTypeEnum } from '@/common/enums';
import { apiUrl } from '@/common/utils/axios';
import { TCreateRescueForm } from '@/modules/rescue/helpers/rescueValidationSchemas';

const rescueUrl = '/rescue';

export const RescueService = () => {
  const getRescueDetails = async (codFund: string, codFundSerie: string) => {
    try {
      return (
        await apiUrl.get(
          `${rescueUrl}/rescue-detail?cod_fund=${codFund}&cod_fund_serie=${codFundSerie}`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const createRescue = async (data: TCreateRescueForm) => {
    try {
      return (
        await apiUrl.post(`${rescueUrl}/create`, {
          ...data,
          origin: OriginTypeEnum.WEB,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    getRescueDetails,
    createRescue,
  };
};

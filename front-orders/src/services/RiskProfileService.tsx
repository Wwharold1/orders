import { isAxiosError } from 'axios';

import {
  IRegisterProfileRequest,
  IShowRiskProfileResponse,
} from '@/common/interfaces';
import { apiUrl } from '@/common/utils/axios';

const appCustomerUrl = '/app/customer';

export const RiskProfileService = () => {
  const showQuestionnaire = async () => {
    try {
      return (
        await apiUrl.post<IShowRiskProfileResponse>(
          `${appCustomerUrl}/show-questionnaire/Preguntas para determinar la tolerancia al riesgo`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const registerCustomerRisk = async (data: IRegisterProfileRequest) => {
    try {
      return (
        await apiUrl.post(`${appCustomerUrl}/register-customer-risk`, data)
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const setCustomerRisk = async ({
    image,
    risk_profile_id,
  }: {
    risk_profile_id: number;
    image: string;
  }) => {
    try {
      return (
        await apiUrl.post(`${appCustomerUrl}/set-customer-risk`, {
          risk_profile_id,
          image,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getRiskProfile = async () => {
    try {
      return (await apiUrl.get(`/risk-profile`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    showQuestionnaire,
    registerCustomerRisk,
    getRiskProfile,
    setCustomerRisk,
  };
};

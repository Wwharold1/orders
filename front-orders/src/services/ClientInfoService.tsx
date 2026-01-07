import { isAxiosError } from 'axios';

import {
  IBankResponse,
  IBusinessExecutiveResponse,
  ICivilStatusResponse,
  ICountryResponse,
  IDepartmentResponse,
  IDistrictResponse,
  IDocumentTypeResponse,
  IEntryDateResponse,
  IGenderResponse,
  IInstructionGradeResponse,
  IMoneyTypeResponse,
  INationalitiesResponse,
  IProvinceResponse,
  IRegimeTypeResponse,
  ITypeAccount,
  ITypeWorkerResponse,
} from '@/common/interfaces';
import { apiUrl } from '@/common/utils/axios';
import { AuthService } from '@/services/AuthService';

export const ClientInfoService = () => {
  const getDocumentType = async () => {
    try {
      return (await apiUrl.get<IDocumentTypeResponse>(`/document-type/list`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getGenders = async () => {
    try {
      return (await apiUrl.get<IGenderResponse>(`/genders/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getCivilStatus = async () => {
    try {
      return (await apiUrl.get<ICivilStatusResponse>(`/civil-status/list`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getCountries = async () => {
    try {
      const publicToken = process.env.NEXT_PUBLIC_TOKEN || 'public';
      let token = localStorage.getItem('public-token') ?? '';
      if (!token) {
        const user = await AuthService().loginSuperUser();
        token = user.token;
        localStorage.setItem('public-token', token);
      }
      const response = await apiUrl.get<ICountryResponse>(`/country/list`, {
        headers: {
          'public-token': publicToken,
          Authorization: 'Bearer ' + token,
        },
      });

      return response.data;
    } catch (error) {
      localStorage.removeItem('public-token');
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getInstructionGrade = async () => {
    try {
      return (
        await apiUrl.get<IInstructionGradeResponse>(`/instruction-grade/list`)
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getNationalities = async () => {
    try {
      return (await apiUrl.get<INationalitiesResponse>(`/nationalities/list`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getTypeWorker = async () => {
    try {
      return (await apiUrl.get<ITypeWorkerResponse>(`/type-worker/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getEntryDate = async () => {
    try {
      return (await apiUrl.get<IEntryDateResponse>(`/entry-date/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getDepartments = async () => {
    try {
      return (await apiUrl.get<IDepartmentResponse>(`/departments/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getProvinces = async (department_id: string) => {
    try {
      return (
        await apiUrl.get<IProvinceResponse>(`/provinces/list/${department_id}`)
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getDistricts = async (province_id: string) => {
    try {
      return (
        await apiUrl.get<IDistrictResponse>(`/districts/list/${province_id}`)
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getRegimeType = async () => {
    try {
      return (await apiUrl.get<IRegimeTypeResponse>(`/regime-type/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getBanks = async () => {
    try {
      return (await apiUrl.get<IBankResponse>(`/banks/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getTypeAccount = async () => {
    try {
      return (await apiUrl.get<ITypeAccount>(`/type-account/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };
  const getMoneyType = async () => {
    try {
      return (await apiUrl.get<IMoneyTypeResponse>(`/money-type/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const getBusinessExecutive = async (filter: any = {}) => {
    try {
      return (
        await apiUrl.post<IBusinessExecutiveResponse>(
          `/business-executive/list`,
          {
            search: '',
            filter,
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
    getDocumentType,
    getBusinessExecutive,
    getGenders,
    getCivilStatus,
    getNationalities,
    getCountries,
    getInstructionGrade,
    getTypeWorker,
    getEntryDate,
    getDepartments,
    getProvinces,
    getDistricts,
    getRegimeType,
    getBanks,
    getTypeAccount,
    getMoneyType,
  };
};

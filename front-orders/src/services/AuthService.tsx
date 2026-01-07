import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { OriginTypeEnum } from '@/common/enums';
import { PublicUserEnum } from '@/common/enums/public-user.enum';
import {
  ICreatePassword,
  ICreatePasswordResponse,
  ILogin,
  ILoginResponse,
  IRecoverGenerate,
  IRecoverGenerateResponse,
  IRecoverValidateCode,
  IRegisterEmail,
  IRegisterResponse,
  IResetPassword,
  IResetPasswordResponse,
  ISendEmailValidationResponse,
  IUpdateEmailCustomer,
  IUpdateEmailCustomerResponse,
  IUpdatePasswordRegistration,
  IVerify,
} from '@/common/interfaces/auth.interface';
import { apiUrl, noTokenApiUrl } from '@/common/utils/axios';
import { TSendProspectForm } from '@/modules/auth/helpers/authValidationSchemas';

const userAppUrl = '/user/app';
const appCustomerUrl = '/app/customer';

export const AuthService = () => {
  const login = createAsyncThunk('auth/login', async (values: ILogin) => {
    try {
      return (
        await noTokenApiUrl.post<ILoginResponse>('/auth/login', {
          ...values,
          app: true,
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  });

  const loginSuperUser = async () => {
    try {
      return (
        await noTokenApiUrl.post<ILoginResponse>('/auth/login', {
          ...{
            email: PublicUserEnum.EMAIL,
            password: PublicUserEnum.PASSWORD,
          },
        })
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const register = createAsyncThunk(
    'auth/register-email',
    async (data: IRegisterEmail) => {
      try {
        return (
          await noTokenApiUrl.post<IRegisterResponse>(
            `${appCustomerUrl}/register-email`,
            data
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const verifyEmailCode = createAsyncThunk(
    'auth/verify',
    async (values: IVerify) => {
      try {
        return (
          await noTokenApiUrl.post<IRegisterResponse>(
            `${appCustomerUrl}/validate-security-code`,
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

  const updatePasswordRegistration = createAsyncThunk(
    'auth/update-password',
    async (values: IUpdatePasswordRegistration) => {
      try {
        return (
          await noTokenApiUrl.patch(`${appCustomerUrl}/update-password`, values)
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const generateRecover = createAsyncThunk(
    'auth/generate-recover-password',
    async (values: IRecoverGenerate) => {
      try {
        return (
          await noTokenApiUrl.post<IRecoverGenerateResponse>(
            `${userAppUrl}/send-code-recovery-password`,
            {
              email: values.email,
              resend: values.resend,
            }
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const validateRecoverCode = createAsyncThunk(
    'auth/validate-recover-code',
    async (values: IRecoverValidateCode) => {
      try {
        return (
          await noTokenApiUrl.get<IRecoverValidateCode>(
            `${userAppUrl}/validate-code-recovery-password/${values.code}/${values.email}`
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const resetPassword = createAsyncThunk(
    'auth/reset-password',
    async (values: IResetPassword) => {
      try {
        return (
          await noTokenApiUrl.put<IResetPasswordResponse>(
            `${userAppUrl}/reset-password/`,
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

  const sendEmailValidation = createAsyncThunk(
    'auth/send-email-validation',
    async (email: string) => {
      try {
        return (
          await noTokenApiUrl.post<ISendEmailValidationResponse>(
            `${userAppUrl}/send-email-validation`,
            {
              email,
              resend: true,
              origin: OriginTypeEnum.WEB,
            }
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const sendEmailCreationPassword = createAsyncThunk(
    'auth/send-email-validation',
    async (email: string) => {
      try {
        return (
          await noTokenApiUrl.post<ISendEmailValidationResponse>(
            `${userAppUrl}/send-email-creation-password`,
            {
              email,
              resend: true,
              backoffice: false,
              origin: OriginTypeEnum.WEB,
            }
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const createPasswordCustomer = createAsyncThunk(
    'auth/create-password-customer',
    async (values: ICreatePassword) => {
      try {
        return (
          await noTokenApiUrl.post<ICreatePasswordResponse>(
            `${userAppUrl}/create-password-customer`,
            { ...values, origin: OriginTypeEnum.APP }
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  const verifyEmail = async (email: string, hash: string) => {
    try {
      return (
        await noTokenApiUrl.patch(
          `${userAppUrl}/verify-email/${email}/${hash}/${OriginTypeEnum.WEB}`
        )
      ).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const updateEmailCustomer = createAsyncThunk(
    'auth/update-email-customer',
    async (values: IUpdateEmailCustomer) => {
      try {
        return (
          await noTokenApiUrl.post<IUpdateEmailCustomerResponse>(
            `${userAppUrl}/update-email-customer`,
            { ...values, origin: OriginTypeEnum.WEB }
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );
  const sendProspectForm = createAsyncThunk(
    'auth/send-prospect-form',
    async (values: TSendProspectForm) => {
      try {
        return (
          await noTokenApiUrl.post(
            `${appCustomerUrl}/send-prospect-document`,
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

  const logoutCustomer = createAsyncThunk('auth/logout', async () => {
    try {
      return (await apiUrl.post<IUpdateEmailCustomerResponse>(`auth/logout`))
        .data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  });

  return {
    login,
    loginSuperUser,
    register,
    verifyEmailCode,
    generateRecover,
    validateRecoverCode,
    resetPassword,
    sendEmailValidation,
    sendEmailCreationPassword,
    createPasswordCustomer,
    verifyEmail,
    updateEmailCustomer,
    logoutCustomer,
    sendProspectForm,
    updatePasswordRegistration,
  };
};

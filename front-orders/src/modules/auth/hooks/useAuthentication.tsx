/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { persistStore } from 'redux-persist';

import { notifyError } from '@/common/components/Notify';
import {
  ContextSidebarEnum,
  ContextSplashEnum,
} from '@/common/enums';
import {
  LoginErrorsDictionary,
} from '@/common/enums/custom-errors.dictionary';
import { removeQueryParams } from '@/common/helper/queryParams';
import { useAppDispatch } from '@/common/hooks/redux-hooks';
import {
  createPasswordSchema,
  documentValidationSchema,
  loginValidationSchema,
  passwordRegistrationValidationSchema,
  recoverGenerateSchema,
  registerEmailValidationSchema,
  resetPasswordSchema,
  sendProspectValidationSchema,
  TCreatePasswordForm,
  TDocumentValidationForm,
  TLoginForm,
  TPasswordRegistrationForm,
  TRecoverGenerateForm,
  TRecoverValidateForm,
  TRegisterEmailForm,
  TResetPasswordForm,
  TSendProspectForm,
  TUpdateEmailForm,
  TVerifyForm,
  updateEmailValidationSchema,
  validateRecoverSchema,
  verifyAccountValidationSchema,
} from '@/modules/auth/helpers/authValidationSchemas';
import { transformTimestamp } from '@/modules/auth/hooks/useErrorTimer';
import { useGoogleRecaptcha } from '@/modules/auth/hooks/useGoogleRecaptcha';
import { deleteAuth } from '@/modules/auth/slice/authSlice';
import { persistor, store } from '@/redux';
import { setSidebar, setSplash } from '@/redux/common/layoutSlice';
import { AuthService } from '../../../services/AuthService';

export const useAuthentication = () => {
  const { handleReCaptchaVerify } = useGoogleRecaptcha();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const generateForm = useForm<TRecoverGenerateForm>({
    resolver: zodResolver(recoverGenerateSchema),
  });

  const validateForm = useForm<TRecoverValidateForm>({
    resolver: zodResolver(validateRecoverSchema),
  });

  const resetForm = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const sendProspectForm = useForm<TSendProspectForm>({
    resolver: zodResolver(sendProspectValidationSchema),
    mode: 'onChange',
  });

  const loginForm = useForm<TLoginForm>({
    resolver: zodResolver(loginValidationSchema),
  });

  const documentValidationForm = useForm<TDocumentValidationForm>({
    resolver: zodResolver(documentValidationSchema),
  });


  const verifyForm = useForm<TVerifyForm>({
    resolver: zodResolver(verifyAccountValidationSchema),
  });

  const createPasswordForm = useForm<TCreatePasswordForm>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      accept_data_treatment: false,
      accept_terms_conditions: true,
    },
  });

  const registerEmailForm = useForm<TRegisterEmailForm>({
    resolver: zodResolver(registerEmailValidationSchema),
    mode: 'onChange',
  });

  const updateEmailForm = useForm<TUpdateEmailForm>({
    resolver: zodResolver(updateEmailValidationSchema),
  });

  const passwordRegistrationForm = useForm<TPasswordRegistrationForm>({
    resolver: zodResolver(passwordRegistrationValidationSchema),
    defaultValues: {
      phone_country: '+51',
      name: '',
      lastname: '',
      accept_data_treatment: false,
      accept_terms_conditions: true,
      password: '',
      password_confirmation: '',
    },
    mode: 'onChange',
  });

  const { mutate: loginMutation, isLoading: loadLogin } = useMutation(
    (userData: TLoginForm) => dispatch(AuthService().login(userData)),
    {
      onSuccess(data) {
        if (data.payload.message == 'Error') {
          const message = data.payload.message.split(' ');
          loginForm.setError('email', {
            message: '',
          });
          loginForm.setError('password', {
            message: '',
          });
          loginForm.setError('root', {
            message: '',
          });
          loginForm.resetField('password');

          if (
            message[0] === LoginErrorsDictionary.USER_BLOQUED ||
            message[0] === LoginErrorsDictionary.USER_DISABLED
          ) {
            notifyError({
              title: 'Usuario no autorizado',
              subtitle: `Para continuar, comuníquese con`,
              bolded: 'backoffice@prudentialsaf.com.pe',
            });
            return;
          }
          if (message[1].length === 1) {
            notifyError({
              title: 'Tus credenciales son incorrectas',
              subtitle: `Te queda${message[1] === '1' ? '' : 'n'} ${message[1]
                } intento${message[1] === '1' ? '' : 's'}.`,
            });

            return;
          }
          if (message[1].length > 1) {
            const timestamp = Math.round(
              (new Date(Number(message[1])).getTime() - new Date().getTime()) /
              1000
            );
            notifyError({
              title: 'Has alcanzado el límite de intentos',
              subtitle: `Podrás volver a intentarlo en ${transformTimestamp(
                timestamp
              )}`,
            });

            return;
          }

          notifyError({
            title: 'Correo o contraseña incorrectos',
            subtitle: `Tus credenciales son incorrectas. Inténtalo de nuevo.`,
          });
          localStorage.removeItem('public-token');

          return;
        }
        persistStore(store);
        dispatch(
          setSplash({
            show: true,
            type: ContextSplashEnum.AUTH,
          })
        );
        dispatch(setSidebar(ContextSidebarEnum.HOME));
        setTimeout(() => {
          router.push('/dashboard');
        }, 4500);
      },
    }
  );

  const logoutMutation = useMutation(
    () => dispatch(AuthService().logoutCustomer()),
    {
      onSuccess() {
        localStorage.removeItem('openModalBeneficiary');
        dispatch(deleteAuth());
        localStorage.clear();
        persistor.purge();
        // document.cookie = '';
        router.push('/');
        removeQueryParams(); // Remove query params when logout
      },
      onSettled() {
      },
    }
  );


  const submitLogin: SubmitHandler<TLoginForm> = async (values) => {
    await handleReCaptchaVerify();
    loginMutation(values);
  };


  return {
    forms: {
      generateForm,
      validateForm,
      resetForm,
      loginForm,
      verifyForm,
      registerEmailForm,
      updateEmailForm,
      passwordRegistrationForm,
      documentValidationForm,
      createPasswordForm,
      sendProspectForm,
    },
    submitHandlers: {
      submitLogin,
    },
    loaders: {
      loadLogin,
    },
    mutations: {
      logoutMutation,
    },
  };
};

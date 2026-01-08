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
import { removeQueryParams } from '@/common/helper/queryParams';
import { useAppDispatch } from '@/common/hooks/redux-hooks';
import {
  loginValidationSchema,
  TLoginForm,
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

  const loginForm = useForm<TLoginForm>({
    resolver: zodResolver(loginValidationSchema),
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

          if (message[0]) {
            notifyError({
              title: 'Tus credenciales son incorrectas',
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
    }
  );


  const submitLogin: SubmitHandler<TLoginForm> = async (values) => {
    await handleReCaptchaVerify();
    loginMutation(values);
  };


  return {
    forms: {
      loginForm,
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

import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect } from 'react';

import { saveQueryParams } from '@/common/helper/queryParams';
import { useWindowSize } from '@/common/hooks';
import { useAppSelector } from '@/common/hooks/redux-hooks';
import { AuthLayout } from '@/layout/AuthLayout';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';

export const Login = () => {
  const {
    forms: { loginForm },
    submitHandlers,
    loaders: { loadLogin },
  } = useAuthentication();
  const isRemembered = useAppSelector((state) => state.session.isRemembered);
  const { height } = useWindowSize();

  useEffect(() => {
    saveQueryParams(); // Save query params in local storage
    return;
  }, []);

  return (
    <AuthLayout title='Bienvenid@' footer imagePath='/images/loginImage3.jpg'>
      <form
        onSubmit={loginForm.handleSubmit(submitHandlers.submitLogin)}
        className='mt-10 flex grow flex-col px-4 md:px-14'
        action='#'
        method='POST'
      >
        <div className='space-y-1.5 rounded-md'>
          <AuthInput
            name='email'
            placeholder='Correo electrónico'
            type='text'
            icon='/icons/mail.svg'
            iconError='/icons/mailError.svg'
            size={3}
            form={loginForm}
            formRegister={loginForm.register}
            error={loginForm.formState.errors}
          />
          <br />
          <AuthInput
            name='password'
            placeholder='Contraseña'
            type='password'
            icon='/icons/password.svg'
            iconError='/icons/passwordError.svg'
            left='left-3.5'
            width={15}
            top='top-[18px]'
            form={loginForm}
            formRegister={loginForm.register}
            error={loginForm.formState.errors}
          />
        </div>

        <div className='mt-10 flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={isRemembered}
              className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 mt-1 block font-bold text-[#222729]'
            >
              Recuérdame
            </label>
          </div>
          <div>
            <Link
              href=''
              className='font-bold text-prudential-500 hover:text-primary-500'
            >
              Olvidé mi contraseña
            </Link>
          </div>
        </div>
        <AuthButton
          title='Iniciar sesión'
          loader={loadLogin}
          subButton
          subButtonExtraText='¿No tienes una cuenta?'
          subButtonText='REGÍSTRATE'
          subButtonLink='/auth/register'
          disabled={loadLogin}
        />
      </form>
      {height <= 720 && (
        <div
          className={clsx(
            'mt-auto flex h-[72px] w-full items-center justify-center self-end border-t border-border-100 bg-[#F8F9F9] text-center text-sm text-primary-900  lg:text-base'
          )}
        >
          PrudentialSAF Sociedad Administradora de Fondos S.A.C <br /> RUC
          20601051487
        </div>
      )}
    </AuthLayout>
  );
};

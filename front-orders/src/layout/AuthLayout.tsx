/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';

import { Button, Spinner } from '@/common/components';
import { Select } from '@/common/components/Select';
import { Splash } from '@/common/components/Splash';
import {
  ContextRoutesEnum,
  ContextSplashEnum,
  DeviceTypeEnum,
  HeightEnum,
  MediaQueryEnum,
  MediaQueryHeightEnum,
} from '@/common/enums';
import { useWindowSize } from '@/common/hooks';
import { useAppDispatch, useAppSelector } from '@/common/hooks/redux-hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import useMediaQueryHeight from '@/common/hooks/useMediaQueryHeight';
import { ICountryResponse } from '@/common/interfaces';
import { IGlobalDocumentsResponse } from '@/common/interfaces/global.config.interface';
import { setGlobalDocuments } from '@/redux/common/globalSlice';
import { setSplash } from '@/redux/common/layoutSlice';
import { GlobalService } from '@/services';
import { ClientInfoService } from '@/services/ClientInfoService';

interface IProps {
  children: React.ReactNode;
  imagePath: string;
  title: string;
  imageRecover?: boolean;
  footer?: boolean;
  steps?: number;
  totalSteps?: number;
  form?: UseFormReturn<
    {
      place_birth: string;
    },
    any
  > | null;
}

export const AuthLayout = ({
  children,
  imagePath,
  title,
  imageRecover,
  footer = false,
  steps,
  totalSteps,
  form,
}: IProps) => {
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const isSmdDown = useMediaQueryHeight(MediaQueryHeightEnum.SMD);
  const { height } = useWindowSize();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const deviceType = useAppSelector((state) => state.layout.deviceType);

  useQuery<IGlobalDocumentsResponse>(
    ['global-documents'],
    () => GlobalService().globalDocuments(),
    {
      keepPreviousData: true,
      staleTime: 60000,
      onSuccess: ({ data }) => {
        dispatch(setGlobalDocuments(data));
      },
    }
  );

  const { data: countryData, isLoading: loadCountry } =
    useQuery<ICountryResponse>(['countries-list'], () =>
      ClientInfoService().getCountries()
    );

  return (
    <section className='grid max-h-full min-h-full grid-cols-1 overflow-x-hidden lg:grid-cols-2'>
      <div className='relative col-span-1 hidden h-full w-full lg:block'>
        <Image
          src={imagePath}
          alt='Login image'
          style={{
            backgroundPosition: 'center',
            objectFit: 'cover',
            objectPosition: !imageRecover ? 'left' : 'top',
          }}
          fill
        />
      </div>
      <div
        className={clsx(
          'col-span-1 md:scale-95',
          height <= 720 && '!scale-100 md:scale-100'
        )}
      >
        <div
          className={clsx(
            ' flex w-full flex-col space-y-8 py-10 md:py-[30px]  md:pb-[32px]',
            footer
              ? height <= 720
                ? 'h-full py-0 !pt-10 md:py-0 md:!pb-0'
                : 'h-2/3 lg:h-[90%]'
              : 'h-full',
            router.pathname === ContextRoutesEnum.LOGIN && '!pb-0'
          )}
        >
          <div className='flex flex-col px-4 md:px-14'>
            {steps?.toString().length && (
              <div className='relative mb-[30px] lg:hidden'>
                <div className='h-1 w-full bg-border-100'></div>
                <div
                  className={clsx(
                    `absolute top-0 z-30 h-1 bg-prudential-500 transition-transform duration-1000 ease-in-out`
                  )}
                  style={{
                    width: `${(
                      (steps + 1) *
                      (100 / (totalSteps || 5))
                    ).toString()}%`,
                  }}
                ></div>
              </div>
            )}

            <div className='mb-10 flex items-center justify-between lg:mb-14'>
              {form && (
                <div
                  className={clsx(
                    'relative flex h-10 w-20 items-center justify-end'
                  )}
                >
                  {loadCountry ? (
                    <Spinner />
                  ) : (
                    <Select
                      keyDisplay='description'
                      keySearchCondition='description'
                      keySearchValue='description'
                      keyValue='description'
                      list={(countryData?.data as any) ?? []}
                      name='place_birth'
                      onChange={(place_birth: string) => {
                        form.setValue('place_birth', place_birth);
                      }}
                      country
                      placeholder='Lugar de nacimiento'
                      form={form}
                    />
                  )}
                </div>
              )}
            </div>
            {steps?.toString().length && (
              <span className='mb-4 text-sm font-bold leading-5 !text-primary-500'>
                {`Paso ${steps + 1} de ${totalSteps}`.toUpperCase()}
              </span>
            )}
            <h2 className='text-2xl font-bold leading-10 text-primary-900 md:text-[32px] md:tracking-wide'>
              {title}
            </h2>
            <div className='mt-2.5 h-2 w-20 bg-prudential-500'></div>
          </div>

          {children}
        </div>
      </div>
      {footer && height > 720 && (
        <div
          className={clsx(
            'absolute bottom-0 flex h-[72px] w-full items-center justify-center border-t border-border-100 bg-[#F8F9F9] text-center text-sm text-primary-900 lg:left-full lg:w-1/2 lg:-translate-x-full lg:text-base',
            deviceType === DeviceTypeEnum.MOBILE && isSmdDown && 'relative'
          )}
        >

        </div>
      )}
      <Toaster />
      <Splash context={ContextSplashEnum.AUTH} />
      <Splash size={2} context={ContextSplashEnum.AUTH_EMAIL_VERIFIED}>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='mb-3 mt-5 text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Excelente!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Tu correo fue verificado. <br /> Continuemos con el proceso.
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/IdentityValidation.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Reconocimiento biométrico exitoso!{' '}
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Ya puedes continuar con el registro.
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.AUTH_REGISTER_COMPLETED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/RegistrationCompleted.svg'
            alt='Registration completed icon'
            width={isMdDown ? 90 : 120}
            height={isMdDown ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Todo listo!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Ya puedes comenzar a invertir con nosotros.
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.AUTH_RECOVERY_COMPLETED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/RecoveryCompleted.svg'
            alt='Recovery completed icon'
            width={isMdDown ? 90 : 120}
            height={isMdDown ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Todo listo!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Tu contraseña fue actualizada. <br /> Inicia sesión nuevamente.
          </p>
        </div>
      </Splash>
      <Splash
        size={2}
        infinite
        context={ContextSplashEnum.AUTH_PROSPECT_COMPLETED}
      >
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/TypeParticipateCompleted.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            Gracias por tu respuesta{' '}
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Un Asesor de Inversiones se contactará contigo para continuar tu
            proceso.
          </p>
          <Button
            title='Ir al inicio de sesión'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.AUTH_PROSPECT_COMPLETED,
                  show: false,
                })
              );
              router.push('/');
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-0 md:!px-20'
          />
        </div>
      </Splash>
    </section>
  );
};

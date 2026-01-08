/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import { Splash } from '@/common/components/Splash';
import {
  ContextRoutesEnum,
  ContextSplashEnum,
  DeviceTypeEnum,
  MediaQueryHeightEnum,
} from '@/common/enums';
import { useWindowSize } from '@/common/hooks';
import { useAppSelector } from '@/common/hooks/redux-hooks';
import useMediaQueryHeight from '@/common/hooks/useMediaQueryHeight';

interface IProps {
  children: React.ReactNode;
  imagePath: string;
  title: string;
  imageRecover?: boolean;
  footer?: boolean;
  steps?: number;
  totalSteps?: number;
}

export const AuthLayout = ({
  children,
  imagePath,
  title,
  imageRecover,
  footer = false,
  steps,
  totalSteps,
}: IProps) => {
  const isSmdDown = useMediaQueryHeight(MediaQueryHeightEnum.SMD);
  const { height } = useWindowSize();
  const router = useRouter();
  const deviceType = useAppSelector((state) => state.layout.deviceType);

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
    </section>
  );
};

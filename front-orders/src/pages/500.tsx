import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Button } from '@/common/components';
import Seo from '@/common/components/Seo';
import { ContextRoutesEnum } from '@/common/enums';
import { PrudentialLogo } from '@/modules/dashboard/components/logos';

export default function InternalErrorPage() {
  const router = useRouter();
  return (
    <React.Fragment>
      <Seo templateTitle='Not Found' />

      <main className='relative'>
        <div className='relative z-10 h-[100dvh] w-screen'>
          <Image
            src='/images/internalErrorImage.jpeg'
            alt='Login image'
            style={{
              backgroundPosition: 'center',
              objectFit: 'cover',
              objectPosition: 'top',
            }}
            fill
          />
        </div>
        <div className='absolute left-0 top-0 z-20 h-[100dvh] w-screen bg-[#001F45CC]'></div>
        <div className='absolute left-1/2 top-1/2 z-30 flex w-3/5 -translate-x-1/2  -translate-y-1/2 flex-col items-center md:w-auto'>
          <p className='self-stretch text-center text-[40px] font-bold not-italic leading-[48px] tracking-[0.4px] text-white'>
            Lo sentimos, hubo un error con tu petición.{' '}
          </p>
          <p className='mt-4 self-stretch text-center text-base font-medium not-italic leading-7 tracking-[0.2px] text-white md:text-xl'>
            Estamos trabajando para solucionarlo. Por favor, vuelve a intentarlo
            más tarde.
          </p>
          <Button
            title='Ir al inicio'
            handleClick={() => router.push(ContextRoutesEnum.DASHBOARD)}
            className='mt-10 w-4/5 md:w-1/2 lg:w-1/3'
            alternative
          />
        </div>
        <div
          onClick={() => router.push(ContextRoutesEnum.DASHBOARD)}
          className={clsx(
            'absolute bottom-16 left-1/2 z-20 -translate-x-1/2 cursor-pointer'
          )}
        >
          <PrudentialLogo />
        </div>
      </main>
    </React.Fragment>
  );
}

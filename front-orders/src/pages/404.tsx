import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Button } from '@/common/components';
import Seo from '@/common/components/Seo';
import { ContextRoutesEnum } from '@/common/enums';

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <React.Fragment>
      <Seo templateTitle='Not Found' />

      <main>
        <div className='relative z-10 h-[100dvh] w-screen'>
          <Image
            src='/images/errorImage.jpeg'
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
          <p className='self-stretch text-center text-9xl font-bold not-italic leading-[150px] text-white md:text-[180px]'>
            404
          </p>
          <p className='mt-4 self-stretch text-center text-3xl font-bold not-italic text-white md:text-[40px]'>
            Página no encontrada
          </p>
          <p className='mt-4 self-stretch text-center text-base font-medium not-italic leading-7 tracking-[0.2px] text-white md:text-xl'>
            El enlace que seguiste probablemente esté roto o la página ha sido
            eliminada.{' '}
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
          className='absolute bottom-16 left-1/2 z-20 -translate-x-1/2 cursor-pointer'
        >
        </div>
      </main>
    </React.Fragment>
  );
}

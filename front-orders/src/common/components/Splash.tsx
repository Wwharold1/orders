import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { FC, useLayoutEffect } from 'react';

import {
  ContextSplashEnum,
  MediaQueryEnum,
  MediaQueryHeightEnum,
} from '@/common/enums';
import { useWindowSize } from '@/common/hooks';
import { useAppDispatch, useAppSelector } from '@/common/hooks/redux-hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import useMediaQueryHeight from '@/common/hooks/useMediaQueryHeight';
import { PrudentialLogo } from '@/modules/dashboard/components/logos/PrudentialLogo';
import { setSplash } from '@/redux/common/layoutSlice';

interface IProps {
  content?: string;
  children?: string | JSX.Element | JSX.Element[];
  context: ContextSplashEnum;
  size?: 0 | 1 | 2 | 3;
  infinite?: boolean;
}

export const Splash: FC<IProps> = ({
  content,
  children,
  context,
  size,
  infinite,
}) => {
  const { splash } = useAppSelector((state) => state.layout);
  const { currentUser } = useAppSelector((state) => state.session);
  const isSmDown = useMediaQuery(MediaQueryHeightEnum.SM);
  const isLgDown = useMediaQuery(MediaQueryEnum.LG);
  const isMdUp = useMediaQueryHeight(MediaQueryHeightEnum.MD);
  const dispatch = useAppDispatch();
  const { height } = useWindowSize();

  useLayoutEffect(() => {
    if (splash.show && context === splash.type && !infinite) {
      setTimeout(() => {
        dispatch(setSplash({ type: context, show: false }));
      }, 5000);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splash.show]);

  return (
    <Transition
      appear
      show={splash.show && context === splash.type}
      className='absolute left-0 top-0 z-[1000] h-[100dvh] w-screen bg-primary-500'
      enter='transition-all duration-200'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-all duration-200'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      {context === ContextSplashEnum.AUTH ? (
        <div
          className={clsx(
            'absolute left-1/2 -translate-x-1/2 text-xl font-bold leading-10 tracking-wide text-white md:text-3xl',
            TopSizeEnum[
              (isMdUp ? 1 : size ?? 1) as keyof typeof TopSizeEnum
            ] as string,
            context === ContextSplashEnum.AUTH && 'text-center'
          )}
        >
          {context === ContextSplashEnum.AUTH &&
            (content || `Hola, ${currentUser?.username}`)}
          {children}
        </div>
      ) : (
        <div
          className={clsx(
            'absolute left-1/2 w-[70%] -translate-x-1/2 text-xl font-bold leading-10 tracking-wide text-white md:w-auto md:text-3xl',
            height < 720
              ? 'top-[25%]'
              : (TopSizeEnum[
                  (isMdUp ? 3 : size ?? 1) as keyof typeof TopSizeEnum
                ] as string)
          )}
        >
          {content}
          {children}
        </div>
      )}
      <div
        className={clsx(
          'absolute bottom-16 left-1/2 -translate-x-1/2',
          isSmDown ? 'mt-10 scale-90' : isLgDown ? 'scale-90' : 'scale-125'
        )}
      >
        <PrudentialLogo />
      </div>
    </Transition>
  );
};

const TopSizeEnum = {
  3: 'top-[30%]',
  2: 'top-[40%]',
  1: 'top-[45%]',
  0: 'top-[35%]',
};

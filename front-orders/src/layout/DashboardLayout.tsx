/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { MdChevronRight } from 'react-icons/md';

import { Modal } from '@/common/components';
import { IconBurger } from '@/common/components/icons/sidebar/IconBurger';
import { IconArrowLeft } from '@/common/components/icons/utils/IconArrowLeft';
import { ContextRoutesEnum, TopBarRouteName } from '@/common/enums';
import { AUTH_LOCAL_STORAGE_KEY, escapeRegExp } from '@/common/helper';
import eventEmitter from '@/common/helper/eventEmitterHelper';
import {
  removeQueryParams,
  saveQueryParams,
} from '@/common/helper/queryParams';
import { useStateCallback, useWindowSize } from '@/common/hooks';
import { useAppDispatch, useAppSelector } from '@/common/hooks/redux-hooks';
import InactivityHandler from '@/common/hooks/useIdleTimer';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';
import { Sidebar } from '@/modules/dashboard/components/sidebar/Sidebar';
import {
  setSidebar,
  setSplash,
  toggleOpenedAnuallyUpdate,
  toggleSidebarOpened,
} from '@/redux/common/layoutSlice';

import {
  ContextSidebarEnum,
  ContextSplashEnum,
  HeightEnum,
  MediaQueryEnum,
  SidebarOptions,
} from '../common/enums/layout-types.enum';

interface IProps {
  children: React.ReactNode;
  routeBack?: any;
}

export const DashboardLayout = ({ children, routeBack }: IProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openExpired, setOpenExpired] = useStateCallback(false);
  const currentRoute =
    TopBarRouteName[router.pathname as keyof typeof TopBarRouteName];
  const controls = useAnimation();

  const { currentUser } = useAppSelector((state) => state.session);
  const { sidebar, sidebarOpened } = useAppSelector((state) => state.layout);

  const Icon = SidebarOptions.find((e) => e.type === sidebar)!;

  const isDashboardHome = sidebar === ContextSidebarEnum.HOME && !currentRoute;

  useEffect(() => {
    eventEmitter.on('unauthorized', () => {
      setOpenExpired(true);
      setTimeout(() => {
        localStorage.removeItem('token');
        document.cookie = `${AUTH_LOCAL_STORAGE_KEY}=; Path=/;`;
        localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
        window.location.href = '/';
        removeQueryParams();
      }, 2000);
    });
    saveQueryParams(); //save query params in local storage
  }, []);

  return (
    <React.Fragment>
      <main className='flex h-full w-full'>
        <Sidebar controls={controls} />
        <motion.section
          className={clsx(
            `max-h-full min-h-full w-full overflow-y-auto scroll-smooth bg-neutral-50`
          )}
          id='main-container'
        >
          <div>
            <div
              className={clsx(
                'flex flex-col rounded-br-[40px] bg-primary-500 px-4 pb-40 pt-12 text-white md:items-start md:rounded-br-none md:pb-32 md:pt-14 lg:px-10 xl:rounded-tl-[40px]',
                !isDashboardHome && 'md:!pb-32'
              )}
            >
              <div className='flex w-full items-center justify-between'>
                <div>
                  <div className='flex items-center space-x-2 lg:hidden'>
                    <div
                      onClick={() => {
                        !sidebarOpened
                          ? controls.start('open')
                          : controls.start('closed');

                        dispatch(toggleSidebarOpened());
                      }}
                      className='z-10 cursor-pointer'
                    >
                      <IconBurger />
                    </div>
                    <motion.div
                      onClick={() => {
                        router.push(ContextRoutesEnum.DASHBOARD);
                        dispatch(setSidebar(ContextSidebarEnum.HOME));
                      }}
                      initial={{ width: '100%' }}
                      animate={{ width: '100%' }}
                      className='scale-90 pl-3'
                    >
                    </motion.div>
                  </div>
                  <div className='hidden items-center text-xl font-bold tracking-wider lg:flex lg:text-3xl'>
                    {currentRoute && (
                      <div
                        onClick={() => {
                          routeBack ? routeBack() : router.back();
                        }}
                        className='mb-2 mr-2 scale-150 cursor-pointer rounded-full p-2 transition duration-150 hover:bg-primary-300/10'
                      >
                        <IconArrowLeft fill='white' />
                      </div>
                    )}
                    {currentRoute
                      ? currentRoute.title
                      : sidebar !== ContextSidebarEnum.HOME &&
                      SidebarOptions.find((e) => e.type === sidebar)?.title}
                    {isDashboardHome && `Hola, ${currentUser?.username}`}
                  </div>

                  {currentRoute && (
                    <div className='mt-2 hidden md:ml-9 lg:flex'>
                      <div
                        className={clsx(
                          sidebar === ContextSidebarEnum.ACCOUNTS && 'pt-1'
                        )}
                      >
                        <Icon.icon fill='rgba(255, 255, 255, 0.6)' />
                      </div>
                      <MdChevronRight
                        color='rgba(255, 255, 255, 0.6)'
                        size={20}
                      />
                      {RelativeRoute({
                        text: currentRoute.subtitle,
                        bolded: '/',
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={clsx(
                  !isDashboardHome ? 'mt-6' : 'mt-10',
                  'block lg:hidden'
                )}
              >
                <div className='flex flex-col items-start text-xl font-bold tracking-wider lg:hidden lg:text-3xl'>
                  {currentRoute && (
                    <div
                      onClick={() => (routeBack ? routeBack() : router.back())}
                      className='z-10 mb-4 scale-150 cursor-pointer p-1'
                    >
                      <IconArrowLeft fill='white' />
                    </div>
                  )}
                  {currentRoute
                    ? currentRoute.title
                    : sidebar !== ContextSidebarEnum.HOME &&
                    SidebarOptions.find((e) => e.type === sidebar)?.title}
                  {sidebar === ContextSidebarEnum.HOME &&
                    !currentRoute &&
                    `Hola, ${currentUser?.username}`}
                </div>

                {currentRoute && (
                  <div className='mt-2 flex lg:ml-9'>
                    <div
                      className={clsx(
                        sidebar === ContextSidebarEnum.ACCOUNTS && 'pt-1'
                      )}
                    >
                      <Icon.icon fill='rgba(255, 255, 255, 0.6)' />
                    </div>
                    <MdChevronRight
                      color='rgba(255, 255, 255, 0.6)'
                      size={20}
                    />
                    {RelativeRoute({
                      text: currentRoute.subtitle,
                      bolded: '/',
                    })}
                  </div>
                )}
              </div>{' '}
            </div>
          </div>
          <div className='relative'>
            <div
              className={clsx(
                'absolute -top-32 w-full px-3 md:-top-20 lg:px-10',
                sidebar === ContextSidebarEnum.HOME &&
                router.pathname === ContextRoutesEnum.DASHBOARD &&
                '!px-0'
              )}
            >
              {children}
            </div>
          </div>
        </motion.section>
      </main>
      <InactivityHandler />
      <Toaster />
      <Modal
        urlIcon='/icons/info.svg'
        title='Tu sesión ha expirado'
        isOpen={openExpired}
        modalLength={350}
        setIsOpen={setOpenExpired}
        confirmationText='Entendido'
        closeIcon
        closeOnTouchOutside={false}
      >
        <p>Tu sesión se cerró por seguridad.</p>
      </Modal>
    </React.Fragment>
  );
};

const RelativeRoute = ({ text, bolded }: { text: string; bolded: string }) => {
  const pattern = new RegExp(escapeRegExp(bolded), 'g');
  const replacement = (
    <MdChevronRight color='rgba(255, 255, 255, 0.6)' size={20} />
  );
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && replacement}
          <p className='text-white/60'>{part}</p>
        </React.Fragment>
      ))}
    </>
  );
};

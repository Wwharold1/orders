/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { MdChevronRight } from 'react-icons/md';

import { Button, Modal, Splash } from '@/common/components';
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
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const { height } = useWindowSize();
  const { mutations } = useAuthentication();
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
      <Splash
        size={2}
        infinite
        context={ContextSplashEnum.TYPE_PARTICIPATE_COMPLETED}
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
            proceso.{' '}
          </p>
          <Button
            title='Ir al inicio'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.TYPE_PARTICIPATE_COMPLETED,
                  show: false,
                })
              );
              dispatch(setSidebar(ContextSidebarEnum.HOME));
              router.push('/dashboard');
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-0 md:!px-20'
          />
        </div>
      </Splash>
      <Splash
        size={2}
        infinite
        context={ContextSplashEnum.NATURAL_PERSON_PEP_COMPLETED}
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
            proceso.{' '}
          </p>
          <Button
            title='Ir al inicio'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.NATURAL_PERSON_PEP_COMPLETED,
                  show: false,
                })
              );
              dispatch(setSidebar(ContextSidebarEnum.HOME));
              router.push('/dashboard');
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-0 md:!px-20'
          />
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.BANK_ACCOUNT_CREATED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/BankAccountCompleted.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Listo!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            La cuenta bancaria se agregó correctamente.
          </p>
        </div>
      </Splash>
      <Splash
        size={2}
        infinite
        context={ContextSplashEnum.IDENTITY_VALIDATION_LIMIT}
      >
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/IdentityValidation.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            La validación no fue posible{' '}
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Has alcanzado el límite de intentos posible para validar tu
            identidad a través de nuestro sistema biométrico. Un Asesor de
            Inversiones se contactará contigo para finalizar el proceso.
          </p>
          <Button
            title='Ir al inicio'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.IDENTITY_VALIDATION_LIMIT,
                  show: false,
                })
              );
              dispatch(setSidebar(ContextSidebarEnum.HOME));
              router.push('/dashboard');
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-0 md:!px-20'
          />
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
            Ya puedes realizar tu inversión.
          </p>
        </div>
      </Splash>
      <Splash
        size={2}
        context={ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS_RESCUE}
      >
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
            Ya puedes realizar tu rescate.
          </p>
        </div>
      </Splash>
      <Splash
        size={2}
        infinite
        context={ContextSplashEnum.IDENTITY_VALIDATION_FIRST_SUCCESS}
      >
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/IdentityValidation.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Reconocimiento biométrico exitoso!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Ya puedes realizar tu inversión.
          </p>
          <Button
            title='Comenzar a invertir'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS,
                  show: false,
                })
              );
              router.push(ContextRoutesEnum.SUBSCRIPTION_INVESTMENT);
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-0 !text-primary-500 md:!px-20'
          />
        </div>
      </Splash>
      <Splash size={0} infinite context={ContextSplashEnum.FAILED_AML}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/FailedAML.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            No podemos continuar con tu suscripción{' '}
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Lamentamos comunicarte que los datos ingresados no ha pasado
            nuestros niveles de seguridad. En caso de dudas o consultas,
            escríbenos a{' '}
            <span className='font-semibold'>
              backoffice@prudentialsaf.com.pe
            </span>
          </p>
          <Button
            title='Cerrar sesión'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.FAILED_AML,
                  show: false,
                })
              );
              mutations.logoutMutation.mutate();
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-3 leading-none !text-primary-500 md:!px-20'
          />
        </div>
      </Splash>
      <Splash size={0} infinite context={ContextSplashEnum.ANUALLY_UPDATED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/FailedAML.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            Actualiza tus datos para continuar
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Para poder continuar es necesario actualizar la información
            registrada.
          </p>
          <div
            onClick={() => {
              dispatch(
                setSplash({
                  show: false,
                  type: ContextSplashEnum.ANUALLY_UPDATED,
                })
              );
            }}
            className='mt-8 cursor-pointer text-sm font-bold underline'
          >
            Ahora no
          </div>
          <Button
            title='Actualizar mis datos'
            handleClick={() => {
              dispatch(toggleOpenedAnuallyUpdate(true));
              router.push(
                {
                  pathname: ContextRoutesEnum.DASHBOARD_RISK_PROFILE,
                  query: {
                    anually_update: true,
                  },
                },
                ContextRoutesEnum.DASHBOARD_RISK_PROFILE
              );
            }}
            alternative
            noBorder
            className='mt-4 !px-10 !py-3 leading-none !text-primary-500 md:!px-20'
          />
        </div>
      </Splash>
      <Splash
        size={0}
        infinite
        context={ContextSplashEnum.CREATE_PAYMENT_SUCCESS}
      >
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/PaymentCompleted.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            Tu solicitud fue enviada{' '}
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Se registró tu pedido y será revisado por uno de nuestros Asesores
            de Inversiones. Si necesitamos información adicional nos
            comunicaremos contigo a tu correo.
          </p>
          <Button
            title='Entendido'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.CREATE_PAYMENT_SUCCESS,
                  show: false,
                })
              );
              router.replace(ContextRoutesEnum.DASHBOARD);
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-3 leading-none !text-primary-500 md:!px-20'
          />
        </div>
      </Splash>
      <Splash size={0} infinite context={ContextSplashEnum.RESCUE_CREATED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/PaymentCompleted.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            Tu solicitud fue enviada
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            El dinero será abonado a tu cuenta entre 2 a 10 días hábiles como
            máximo.
          </p>
          <Button
            title='Entendido'
            handleClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.RESCUE_CREATED,
                  show: false,
                })
              );
              router.replace(ContextRoutesEnum.DASHBOARD);
            }}
            alternative
            noBorder
            className='mt-8 !px-10 !py-3 leading-none !text-primary-500 md:!px-20'
          />
          <p
            onClick={() => {
              dispatch(
                setSplash({
                  type: ContextSplashEnum.RESCUE_CREATED,
                  show: false,
                })
              );
              router.push(ContextRoutesEnum.DASHBOARD);
              dispatch(setSidebar(ContextSidebarEnum.MOVEMENTS));
            }}
            className='mt-8 cursor-pointer text-center text-base font-bold md:text-base'
          >
            Ver movimientos
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.PROFILE_UPDATED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/ConfirmIcon.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Excelente!{' '}
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Los datos fueron actualizados.
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.ANUALLY_PROFILE_UPDATED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/IdentityValidation.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Reconocimiento biométrico exitoso!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Ya puedes seguir invirtiendo.
          </p>
        </div>
      </Splash>
      <Splash
        infinite
        size={2}
        context={ContextSplashEnum.PROFILE_CHANGED_RISK}
      >
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/ConfirmIcon.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Listo!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Tu perfil de tolerancia al riesgo fue actualizado.
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.PROFILE_FINAL_BENFICIARY}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/ConfirmIcon.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Reconocimiento biométrico exitoso!!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            El registro del beneficiario final se ha completado con éxito. Si
            necesita realizar alguna modificación, por favor comuníquese con su
            asesor.
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.PROFILE_EMAIL_VERIFIED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/VerifyEmail.svg'
            alt='Verify email icon'
            width={isMdDown ? 90 : 120}
            height={isMdDown ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Excelente!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Tu correo fue verificado.
          </p>
        </div>
      </Splash>
      <Splash size={2} context={ContextSplashEnum.PROFILE_PHONE_VERIFIED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/UpdatePhoneNumber.svg'
            alt='Update phone icon'
            width={isMdDown ? 90 : 120}
            height={isMdDown ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-lg font-semibold md:mt-8 md:text-3xl'>
            ¡Excelente!
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Tu número de celular fue verificado.
          </p>
        </div>
      </Splash>
      <Splash size={0} infinite context={ContextSplashEnum.ANUALLY_UPDATED}>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/icons/FailedAML.svg'
            alt='Recovery completed icon'
            width={isMdDown || height < HeightEnum.MD ? 90 : 120}
            height={isMdDown || height < HeightEnum.MD ? 90 : 120}
          />
          <h1 className='mb-3 mt-5 text-center text-lg font-semibold md:mt-8 md:text-3xl'>
            Actualiza tus datos para continuar
          </h1>
          <p className='text-center text-base font-light md:text-lg'>
            Para poder continuar es necesario actualizar la información
            registrada.
          </p>
          <div
            onClick={() => {
              dispatch(
                setSplash({
                  show: false,
                  type: ContextSplashEnum.ANUALLY_UPDATED,
                })
              );
            }}
            className='mt-8 cursor-pointer text-sm font-bold underline'
          >
            Ahora no
          </div>
          <Button
            title='Actualizar mis datos'
            handleClick={() => {
              dispatch(toggleOpenedAnuallyUpdate(true));
              router.push(
                {
                  pathname: ContextRoutesEnum.DASHBOARD_RISK_PROFILE,
                  query: {
                    anually_update: true,
                  },
                },
                ContextRoutesEnum.DASHBOARD_RISK_PROFILE
              );
            }}
            alternative
            noBorder
            className='mt-4 !px-10 !py-3 leading-none !text-primary-500 md:!px-20'
          />
        </div>
      </Splash>

      <Splash size={2} context={ContextSplashEnum.PROFILE_PASSWORD_UPDATED}>
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
            Tu contraseña fue actualizada.
          </p>
        </div>
      </Splash>
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

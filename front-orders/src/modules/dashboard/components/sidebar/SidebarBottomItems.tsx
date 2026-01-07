import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

import { IconDelete, IconLogout, Modal, Spinner } from '@/common/components';
import { IconContactSupport } from '@/common/components/icons/sidebar/IconContactSupport';
import IconInfo from '@/common/components/icons/utils/IconInfo';
import {
  BottomSidebarOptions,
  ContextBottomSidebarEnum,
  ContextRoutesEnum,
  MediaQueryEnum,
} from '@/common/enums';
import { useAppSelector, useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';
import { useDeleteAccount } from '@/modules/dashboard/hooks/useDeleteAccount';

export const SidebarBottomItems = () => {
  const {
    mutations: { logoutMutation },
  } = useAuthentication();
  const handleLogout = async () => {
    logoutMutation.mutate();
  };
  const router = useRouter();
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const [openLogout, setOpenLogout] = useStateCallback<boolean>(false);
  const [openSupport, setOpenSupport] = useStateCallback<boolean>(false);
  /* const [openFinalBeneficiary, setFinalBeneficiary] =
    useStateCallback<boolean>(false); */
  const {
    mutations: { canDeleteMutation, requestDeleteMutation },
    modal: { modalState },
    handlers: { handleModalToggle },
  } = useDeleteAccount();

  const { sidebarOpened } = useAppSelector((state) => state.layout);
  const { terms_conditions, email, phone_number } = useAppSelector(
    (state) => state.global
  );
  const isLgDown = useMediaQuery(MediaQueryEnum.LG);

  return (
    <ul
      className={clsx(
        'bottom-20 flex grow flex-col items-start justify-end space-y-4'
      )}
    >
      {BottomSidebarOptions.map((option, index) => {
        const isLastItem = index === BottomSidebarOptions.length - 1;
        return (
          <li
            key={index}
            className={clsx(
              'relative cursor-pointer items-center pl-8 pr-6 lg:flex lg:justify-center lg:pl-7',
              sidebarOpened ? 'xl:pl-[52px]' : 'xl:pl-[52px]'
            )}
          >
            <div
              className={clsx(
                'flex h-12 w-full items-center space-x-3 rounded-md p-3 duration-200 ease-out',
                isLastItem
                  ? 'hover:bg-terciary-300/10'
                  : 'hover:bg-primary-50/50',
                !sidebarOpened && !isLgDown
                  ? 'w-12 justify-center'
                  : 'justify-start'
              )}
              onClick={() => {
                switch (option.type) {
                  case ContextBottomSidebarEnum.LOGOUT:
                    setOpenLogout(true);
                    break;
                  case ContextBottomSidebarEnum.SUPPORT:
                    setOpenSupport(true);
                    break;
                  case ContextBottomSidebarEnum.DELETE:
                    !canDeleteMutation.isLoading && canDeleteMutation.mutate();
                    break;
                }
              }}
            >
              <option.icon
                className='h-6 w-6'
                fill={clsx(isLastItem ? '#D53943' : 'rgb(0 123 195 / 0.75)')}
              />
              {(sidebarOpened || isLgDown) && (
                <p
                  className={clsx(
                    'mt-0.5 text-base font-bold',
                    isLastItem ? 'text-terciary-900' : 'text-primary-500/75'
                  )}
                >
                  {option.title}
                </p>
              )}
              {option.type === ContextBottomSidebarEnum.DELETE &&
                canDeleteMutation.isLoading && <Spinner />}
            </div>
          </li>
        );
      })}
      <Modal
        isOpen={openLogout}
        title='Cerrar sesión'
        setIsOpen={setOpenLogout}
        customIcon={<IconLogout fill='#007BC3' className='ml-1' />}
        confirmationText='Cerrar sesión'
        confirmationCustomFunction={() => handleLogout()}
        extended={isMdDown}
        modalLength={
          router.pathname === ContextRoutesEnum.DASHBOARD ? 400 : 450
        }
        secondaryConfirmationText='Cancelar'
        subtitle={
          router.pathname === ContextRoutesEnum.DASHBOARD
            ? ''
            : 'Si cierras la sesión ahora, los datos del proceso que iniciaste podrían no ser guardados.'
        }
        onlyTitle={router.pathname === ContextRoutesEnum.DASHBOARD}
      ></Modal>
      <Modal
        isOpen={openSupport}
        title='Contactar a soporte'
        setIsOpen={setOpenSupport}
        customIcon={<IconContactSupport fill='#007BC3' className='ml-1' />}
        confirmationText='Entendido'
        extended={isMdDown}
        modalLength={400}
        onlyTitle
        closeIcon
      >
        <p>
          Para comunicarte con nuestra área de soporte y atención al cliente,
          escríbenos a{' '}
          <a
            href={'mailto:' + email}
            className='cursor-pointer font-bold text-primary-500 focus-visible:outline-none'
          >
            {email}
          </a>{' '}
          o llámanos a{' '}
          <span className='font-bold text-primary-500'>{phone_number}</span> en
          el horario de Lunes a Viernes, de 9:00 a.m. a 6:00 p.m.
        </p>
      </Modal>
      <Modal
        isOpen={modalState.openAskDeleteAccount}
        title='¿Está seguro que desea eliminar su cuenta?'
        setIsOpen={(value: boolean) =>
          handleModalToggle('openAskDeleteAccount', value)
        }
        customIcon={<IconInfo fill='#007BC3' />}
        confirmationText='Aceptar'
        secondaryConfirmationText='Cancelar'
        confirmationCustomFunction={() => requestDeleteMutation.mutate()}
        extended={isMdDown}
        disabledPrimary={requestDeleteMutation.isLoading}
        modalLength={500}
        closeOnSaved={false}
        closeIcon
      >
        <p className='text-center text-neutral-600'>
          Al aceptar se enviará una solicitud para ser revisada por nuestro
          equipo.
        </p>
      </Modal>
      <Modal
        isOpen={modalState.openDeleteAlreadySended}
        title='Solicitud ya enviada'
        setIsOpen={(value: boolean) =>
          handleModalToggle('openDeleteAlreadySended', value)
        }
        customIcon={<IconInfo fill='#007BC3' />}
        confirmationText='Aceptar'
        extended={isMdDown}
        modalLength={500}
        onlyTitle
        closeIcon
      >
        <p className='text-center text-neutral-600'>
          Ya has enviado una solicitud para eliminar tu cuenta, por favor espera
          a que nuestro equipo se comunique contigo
        </p>
      </Modal>
      <Modal
        isOpen={modalState.openDeleteTermsConditions}
        title='Procedimiento para eliminar una cuenta'
        setIsOpen={(value: boolean) =>
          handleModalToggle('openDeleteTermsConditions', value)
        }
        customIcon={<IconDelete fill='#007BC3' />}
        confirmationText='Ver Términos y condiciones'
        confirmationCustomFunction={() =>
          window.open(terms_conditions, '_blank')
        }
        extended={isMdDown}
        modalLength={550}
        onlyTitle
        closeIcon
      >
        <p className='text-center'>
          Ya que cuentas con contratos activos, debes seguir los siguientes
          pasos para eliminar tu cuenta:
          <br />
          <br /> i. Enviar un correo electrónico a{' '}
          <span className='font-bold text-primary-500'>
            backoffice@prudentialsaf.com.pe
          </span>{' '}
          con el asunto: Eliminar Cuenta
          <br />
          <br /> ii. Prudential SAF Sociedad Administradora de Fondos S.A.C
          pasará a evaluar el caso y proceder con la eliminación de datos de
          acuerdo con la política de tratamiento de datos. <br />
          <br /> iii. El cliente recibirá una notificación vía correo
          electrónico.
        </p>
      </Modal>
      <Modal
        isOpen={modalState.openSuccessDeleteAccount}
        title='Solicitud de eliminar cuenta enviada'
        setIsOpen={(value: boolean) =>
          handleModalToggle('openSuccessDeleteAccount', value)
        }
        customIcon={<IconDelete fill='#007BC3' />}
        confirmationText='Aceptar'
        extended={isMdDown}
        modalLength={550}
        onlyTitle
        closeIcon
      >
        <p className='text-center'>
          Tu solicitud de eliminar cuenta será revisada por nuestro equipo, nos
          comunicaremos en la brevedad posible.
        </p>
      </Modal>
      <Modal
        isOpen={modalState.openErrorDeleteAccount}
        title='Error al eliminar cuenta'
        setIsOpen={(value: boolean) =>
          handleModalToggle('openErrorDeleteAccount', value)
        }
        customIcon={<IconDelete fill='#007BC3' />}
        confirmationText='Aceptar'
        extended={isMdDown}
        modalLength={550}
        onlyTitle
        closeIcon
      >
        <p className='text-center'>
          Sucedió un error al momento de enviar la solicitud, por favor intente
          de nuevo.
        </p>
      </Modal>
    </ul>
  );
};

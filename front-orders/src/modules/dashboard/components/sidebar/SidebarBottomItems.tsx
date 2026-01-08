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


  const { sidebarOpened } = useAppSelector((state) => state.layout);

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
    </ul>
  );
};

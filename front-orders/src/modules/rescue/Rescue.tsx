/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Modal } from '@/common/components';
import { IconMoney } from '@/common/components/icons/subscription/IconMoney';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { RescueAccount } from '@/modules/rescue/components/RescueAccount';
import { RescueDetail } from '@/modules/rescue/components/RescueDetail';
import { setRescueTab } from '@/modules/rescue/slice/rescueLayoutSlice';

export const Rescue = () => {
  const { rescueTab, rescueTabs } = useAppSelector(
    (state) => state.rescue_layout
  );
  const [lastRescueTab, setLastRescueTab] = useStateCallback(rescueTab);

  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const [openModalInterrupt, setOpenModalInterrupt] =
    useStateCallback<boolean>(false);
  const router = useRouter();

  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (rescueTab > lastRescueTab) {
      setLastRescueTab(rescueTab);
    }
  }, [rescueTab]);

  useEffect(() => {
    dispatch(setRescueTab(0));
  }, []);

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout routeBack={() => setOpenModalInterrupt(true)}>
        <div className='relative rounded-lg bg-white px-4 pt-6 md:px-6'>
          <div className='flex space-x-4 border-b border-neutral-100 pb-4 md:hidden'>
            <div className='rounded-full border border-solid border-primary-500 p-1'>
              <div className='flex items-center justify-center rounded-full  bg-primary-500 p-3'>
                <IconMoney />
              </div>
            </div>
            <div className='flex flex-col justify-center space-y-2'>
              <p className='text-xs leading-none text-primary-300'>
                PASO {rescueTab + 1} DE {rescueTabs.length}
              </p>
              <p className='text-lg font-bold leading-none text-primary-900'>
                {rescueTabs.find((e) => e.id === rescueTab)?.title}
              </p>
            </div>
          </div>
          <Tab.Group
            selectedIndex={rescueTab}
            onChange={(e) => dispatch(setRescueTab(e as never))}
          >
            <Tab.List className='hidden space-x-4 rounded-lg border-b border-neutral-100 ring-0 md:block'>
              {rescueTabs.map((tab, index) => {
                return (
                  <Tab
                    className={clsx(
                      lastRescueTab < index
                        ? 'pointer-events-none'
                        : '!cursor-pointer'
                    )}
                    key={index}
                  >
                    {({ selected }) => (
                      <div
                        className={clsx(
                          'relative p-4 px-0 pb-2.5 font-bold transition-all duration-150 ease-in hover:!text-primary-400',
                          selected
                            ? 'text-primary-500'
                            : lastRescueTab >= index
                            ? 'text-neutral-400'
                            : 'text-neutral-200'
                        )}
                      >
                        {tab.title}
                        {selected && (
                          <div className='absolute bottom-0 left-1/2 h-1.5 w-full -translate-x-1/2 rounded-t-md bg-primary-500'></div>
                        )}
                      </div>
                    )}
                  </Tab>
                );
              })}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <RescueDetail modal={setOpenModalCancel} />
              </Tab.Panel>
              <Tab.Panel>
                <RescueAccount modal={setOpenModalCancel} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <Modal
          isOpen={openModalCancel}
          title='¿Seguro que deseas cancelar tu solicitud de rescate?'
          setIsOpen={setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Cancelar solicitud'
          confirmationCustomFunction={() =>
            router.push(ContextRoutesEnum.DASHBOARD)
          }
          extended={isMdDown}
          secondaryConfirmationText='Volver al formulario'
        >
          <p className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </p>
        </Modal>
        <Modal
          isOpen={openModalInterrupt}
          title='¿Deseas interrumpir el proceso de rescate?'
          setIsOpen={setOpenModalInterrupt}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() =>
            router.push(ContextRoutesEnum.DASHBOARD)
          }
          extended
          modalLength={500}
          secondaryConfirmationText='Cancelar'
        >
          <p className='text-neutral-600'>
            Si sales ahora, tu información podría no guardarse.{' '}
          </p>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

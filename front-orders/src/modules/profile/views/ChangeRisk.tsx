/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

import { Modal } from '@/common/components';
import { IconMoney } from '@/common/components/icons/subscription/IconMoney';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { IdentityValidationFacephi } from '@/modules/dashboard/modules/subscription/components/natural-client/IdentityValidationFacephi';
import { setChangeRiskTab } from '@/modules/dashboard/slice/riskProfileSlice';
import { SelectChangeRisk } from '@/modules/profile/components/SelectChangeRisk';

export const ChangeRiskProfile = () => {
  const router = useRouter();
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const { changeRiskTab, changeRiskTabs } = useAppSelector(
    (state) => state.riskProfile
  );
  const [lastTab, setLastTab] = useStateCallback<number>(0);
  const dispatch = useAppDispatch();

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout>
        <div className='relative rounded-lg bg-white px-6 pt-6 shadow-md'>
          <div className='flex space-x-4 border-b border-neutral-100 pb-4 md:hidden'>
            <div className='rounded-full border border-solid border-primary-500 p-1'>
              <div className='flex items-center justify-center rounded-full  bg-primary-500 p-3'>
                <IconMoney />
              </div>
            </div>
            <div className='flex flex-col justify-center space-y-2'>
              <p className='text-xs leading-none text-primary-300'>
                PASO {changeRiskTab + 1} DE {changeRiskTabs.length}
              </p>
              <p className='text-lg font-bold leading-none text-primary-900'>
                {changeRiskTabs.find((e) => e.id === changeRiskTab)?.title}
              </p>
            </div>
          </div>
          <Tab.Group
            selectedIndex={changeRiskTab}
            onChange={(e) => {
              dispatch(setChangeRiskTab(e as any));
              if (changeRiskTab < e) {
                setLastTab(e);
              }
            }}
          >
            <Tab.List className='hidden space-x-4 rounded-lg border-b border-neutral-100 ring-0 md:block'>
              {changeRiskTabs.map((tab, index) => {
                return (
                  <Tab
                    className={clsx(
                      lastTab < index && 'pointer-events-none cursor-pointer'
                    )}
                    key={index}
                  >
                    {({ selected }) => (
                      <div
                        className={clsx(
                          'relative p-4 px-0 pb-2.5 font-bold transition-all duration-150 ease-in hover:!text-primary-400',
                          selected ? 'text-primary-500' : 'text-neutral-200',
                          'cursor-default'
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
                <SelectChangeRisk setOpenModalCancel={setOpenModalCancel} />
              </Tab.Panel>
              <Tab.Panel>
                <IdentityValidationFacephi isInside={true} changeRisk />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <Modal
          isOpen={openModalCancel}
          title='¿Deseas cancelar el cambio de perfil de tolerancia al riesgo?'
          setIsOpen={setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() =>
            router.push(ContextRoutesEnum.DASHBOARD)
          }
          extended
          modalLength={520}
          secondaryConfirmationText='Volver'
        >
          <p className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </p>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

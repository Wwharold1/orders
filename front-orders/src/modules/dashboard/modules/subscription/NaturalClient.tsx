/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Modal } from '@/common/components';
import { IconMoney } from '@/common/components/icons/subscription/IconMoney';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum, ContextTabs, MediaQueryEnum } from '@/common/enums';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { useShufti } from '@/modules/dashboard/hooks/useShufti';
import { ActivityCustomer } from '@/modules/dashboard/modules/subscription/components/natural-client/ActivityCustomer';
import { FinalBeneficiaryCustomer } from '@/modules/dashboard/modules/subscription/components/natural-client/FinalBeneficiaryCustomer';
import { HomeCustomer } from '@/modules/dashboard/modules/subscription/components/natural-client/HomeCustomer';
import { IdentifyCustomer } from '@/modules/dashboard/modules/subscription/components/natural-client/IdentifyCustomer';
import { IdentityValidationFacephi } from '@/modules/dashboard/modules/subscription/components/natural-client/IdentityValidationFacephi';
import { PepCustomer } from '@/modules/dashboard/modules/subscription/components/natural-client/PepCustomer';
import { PersonalInformation } from '@/modules/dashboard/modules/subscription/components/natural-client/PersonalInformation';
import { SpouseCustomer } from '@/modules/dashboard/modules/subscription/components/natural-client/SpouseCustomer';
import { setNaturalClientTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { setContextTabs } from '@/modules/dashboard/slice/subscriptionSlice';

import { StepsNaturalForm } from '../../../../common/enums/form-steps.enum';

export const NaturalClient = () => {
  const router = useRouter();
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const { modal, mutations, state } = useNaturalClient();
  const { form_steps } = useAppSelector((state) => state.session);
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );

  const hasPassedYear = useAppSelector(
    (state) => !!state.session.currentUser?.has_passed_year
  );
  const existSpectrum = useAppSelector(
    (state) => !!state.session.currentUser?.exist_spectrum
  );
  const disableFields = router.query.profile ? existSpectrum : hasPassedYear;

  const { isFinalBeneficiaryDatabase } = useAppSelector(
    (state) => state.finalBeneficiary
  );

  const { contextTabs } = useAppSelector((state) => state.subscription);
  const dispatch = useAppDispatch();
  const { makeAmlMutation } = useShufti();
  const stepsNaturalForm = form_steps
    .filter((form) =>
      Object.values(StepsNaturalForm).includes(form.description as any)
    )
    .sort((a, b) => a.order - b.order)
    .map((e) => e.status)
    .lastIndexOf(true);

  useEffect(() => {
    if (router.query.anually_update) {
      const newTabs = ContextTabs.slice(1, ContextTabs.length);
      dispatch(setContextTabs(newTabs));
    }

    if (router.query.customer_risk_form) {
      state.setAnuallyUpdateData({
        ...state.anuallyUpdateData,
        customer_risk_form: JSON.parse(
          router.query.customer_risk_form as string
        ),
      });
    }
  }, []);

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout routeBack={() => modal.setOpenModalInterrupt(true)}>
        <div className='relative rounded-lg bg-white px-6 pt-6 shadow-md'>
          <div className='flex space-x-4 border-b border-neutral-100 pb-4 md:hidden'>
            <div className='rounded-full border border-solid border-primary-500 p-1'>
              <div className='flex items-center justify-center rounded-full  bg-primary-500 p-3'>
                <IconMoney />
              </div>
            </div>
            <div className='flex flex-col justify-center space-y-2'>
              <p className='text-xs leading-none text-primary-300'>
                PASO {naturalClientTab + 1} DE {contextTabs.length}
              </p>
              <p className='text-lg font-bold leading-none text-primary-900'>
                {contextTabs.find((e) => e.id === naturalClientTab)?.title}
              </p>
            </div>
          </div>
          <Tab.Group
            selectedIndex={naturalClientTab}
            onChange={(e) => dispatch(setNaturalClientTab(e as any))}
          >
            <Tab.List className='hidden space-x-4 rounded-lg border-b border-neutral-100 ring-0 md:block'>
              {contextTabs.map((tab, index) => {
                return (
                  <Tab
                    // className={clsx(
                    //   stepsNaturalForm < index &&
                    //     'pointer-events-none cursor-pointer'
                    // )}
                    className='pointer-events-none cursor-pointer'
                    key={index}
                  >
                    {({ selected }) => (
                      <div
                        className={clsx(
                          'relative p-4 px-0 pb-2.5 font-bold transition-all duration-150 ease-in hover:!text-primary-400',
                          selected
                            ? 'text-primary-500'
                            : stepsNaturalForm >= index
                            ? 'text-neutral-400'
                            : 'text-neutral-200',
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
              {contextTabs.map((e) => e.title).includes('Documento') && (
                <Tab.Panel>
                  <IdentifyCustomer
                    setOpenModalCancel={modal.setOpenModalCancel}
                  />
                </Tab.Panel>
              )}
              <Tab.Panel>
                <PersonalInformation
                  setOpenModalCancel={modal.setOpenModalCancel}
                  update={disableFields}
                  state={state}
                />
              </Tab.Panel>
              <Tab.Panel>
                <ActivityCustomer
                  setOpenModalCancel={modal.setOpenModalCancel}
                  update={disableFields}
                  state={state}
                />
              </Tab.Panel>
              <Tab.Panel>
                <HomeCustomer
                  setOpenModalCancel={modal.setOpenModalCancel}
                  update={disableFields}
                  state={state}
                />
              </Tab.Panel>
              {contextTabs.map((e) => e.title).includes('Cónyuge') && (
                <Tab.Panel>
                  <SpouseCustomer
                    setOpenModalCancel={modal.setOpenModalCancel}
                    update={disableFields}
                    state={state}
                  />
                </Tab.Panel>
              )}
              <Tab.Panel>
                <PepCustomer
                  setOpenModalPep={modal.setOpenModalPep}
                  setOpenModalCancel={modal.setOpenModalCancel}
                  update={disableFields}
                  state={state}
                  makeAmlMutation={makeAmlMutation}
                />
              </Tab.Panel>
              {!isFinalBeneficiaryDatabase ? (
                <Tab.Panel>
                  <FinalBeneficiaryCustomer
                    setOpenModalCancel={modal.setOpenModalCancel}
                    update={disableFields}
                    state={state}
                  />
                </Tab.Panel>
              ) : (
                <div></div>
              )}
              <Tab.Panel>
                <IdentityValidationFacephi
                  naturalClient
                  isInside
                  update={disableFields}
                  state={state}
                  setOpenModalCancel={modal.setOpenModalCancel}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <Modal
          isOpen={modal.openModalCancel}
          title='¿Seguro que deseas cancelar tu registro de suscripción?'
          setIsOpen={modal.setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Cancelar registro'
          confirmationCustomFunction={() => {
            dispatch(setNaturalClientTab(0));
            router.push(ContextRoutesEnum.DASHBOARD);
          }}
          extended={isMdDown}
          secondaryConfirmationText='Volver al formulario'
        >
          <p className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </p>
        </Modal>
        <Modal
          isOpen={modal.openModalInterrupt}
          title='¿Deseas interrumpir el proceso de suscripción?'
          setIsOpen={modal.setOpenModalInterrupt}
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
        <Modal
          isOpen={modal.openModalPep}
          title='Si eres una Persona Expuesta Políticamente (PEP), te contactaremos con un ejecutivo para continuar con tu suscripción.'
          setIsOpen={modal.setOpenModalPep}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Enviar mi información'
          confirmationCustomFunction={() =>
            mutations.chargePublicMutation.mutate()
          }
          extended={isMdDown}
          secondaryConfirmationText='Volver al formulario'
        >
          <p className='text-neutral-600'>
            Para continuar el proceso, enviaremos tu información y un asesor de
            inversiones se pondrá en contacto contigo en un plazo máximo de 48
            horas hábiles.
          </p>
        </Modal>
        <Modal
          title='Un momento...'
          isOpen={makeAmlMutation.isLoading}
          modalLength={450}
          setIsOpen={!makeAmlMutation.isLoading}
          size={2}
          customColor='#4C555A'
          customIcon={
            <div className='relative mb-2 flex items-center justify-center'>
              <Image
                src='/icons/loadingIconBlub.svg'
                alt='light blub'
                width={80}
                height={80}
                className='scale-[1.8]'
              />
              <motion.div
                animate={{
                  rotate: '360deg',
                  transition: {
                    repeat: Infinity,
                    type: 'tween',
                    ease: 'linear',
                    duration: 1.5,
                  },
                }}
                className='absolute -top-0.5'
              >
                <Image
                  src='/images/settings.png'
                  alt='light blub'
                  width={28}
                  height={28}
                />
              </motion.div>
            </div>
          }
        >
          <p className='mt-0 text-center'>
            Estamos procesando toda la información que nos <br /> has
            brindado...
          </p>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

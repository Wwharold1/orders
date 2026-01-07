/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tab } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

import { Modal } from '@/common/components';
import { IconMoney } from '@/common/components/icons/subscription/IconMoney';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum } from '@/common/enums';
import { AUTH_LOCAL_STORAGE_KEY } from '@/common/helper';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import { IPersonalInformationResponse } from '@/common/interfaces';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { IdentityValidationFacephi } from '@/modules/dashboard/modules/subscription/components/natural-client/IdentityValidationFacephi';
import {
  setChangeFinalBeneficiaryTab,
  setFormBeneficiaryFinal,
} from '@/modules/dashboard/slice/finalBeneficiarySlice';
import { FinalBeneficiaryProfileStep } from '@/modules/profile/components/BeneficiaryFinalStep';
import { ClientInfoService } from '@/services/ClientInfoService';
import { NaturalClientService } from '@/services/NaturalClientService';

export const FinalBeneficiaryProfile = () => {
  const { changeFinalBeneficiaryTab, changeFinalBeneficiaryTabs } =
    useAppSelector((state) => state.finalBeneficiary);
  const router = useRouter();
  const [lastTab, setLastTab] = useStateCallback<number>(0);
  const dispatch = useAppDispatch();
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const { isFinalBeneficiaryFromModal } = useAppSelector(
    (state) => state.finalBeneficiary
  );

  useQuery<IPersonalInformationResponse>(
    ['get-personal-info'],
    () => NaturalClientService().getProfileCustomer(),
    {
      onSuccess: async (data) => {
        const dt = await ClientInfoService().getDocumentType();
        if (isFinalBeneficiaryFromModal) {
          const lsValue = JSON.parse(
            localStorage.getItem(AUTH_LOCAL_STORAGE_KEY) ?? ''
          );
          if (lsValue) {
            forms.finalBeneficiaryForm.setValue(
              'name_beneficiary',
              data?.data.name
                ? data?.data.name + ' ' + data?.data.middlename
                : ''
            );
            forms.finalBeneficiaryForm.setValue(
              'lastname_beneficiary',
              data?.data.surname
                ? data?.data.surname + ' ' + data?.data.lastname
                : ''
            );
            forms.finalBeneficiaryForm.setValue(
              'country_id',
              data?.data.place_birth ?? 6
            );
            forms.finalBeneficiaryForm.setValue(
              'date_birth',
              data?.data.birthdate ?? ''
            );
            forms.finalBeneficiaryForm.setValue(
              'nationality_id',
              data?.data.nationality_id ?? 1
            );
            forms.finalBeneficiaryForm.setValue(
              'document_number',
              data?.data.number_document ?? ''
            );
            forms.finalBeneficiaryForm.setValue('nit', '');
            forms.finalBeneficiaryForm.setValue('ruc', '');

            forms.finalBeneficiaryForm.setValue(
              'civil_status_id',
              data?.data.civil_status_id ?? 1
            );

            forms.finalBeneficiaryForm.setValue(
              'contact_email',
              lsValue.user.email
            );
            forms.finalBeneficiaryForm.setValue(
              'contact_phone',
              lsValue.user.phone_number
            );
            forms.finalBeneficiaryForm.setValue('contact_address', 'direccion');
            forms.finalBeneficiaryForm.setValue('contact_district_id', 535);
            forms.finalBeneficiaryForm.setValue('contact_province_id', 51);
            forms.finalBeneficiaryForm.setValue('contact_country_id', 6);
            forms.finalBeneficiaryForm.setValue('contact_postal_code', '12312');

            forms.finalBeneficiaryForm.setValue('name_spouse', undefined);
            forms.finalBeneficiaryForm.setValue('lastname_spouse', undefined);
            forms.finalBeneficiaryForm.setValue(
              'document_type_spouse',
              undefined
            );
            forms.finalBeneficiaryForm.setValue(
              'document_number_spouse',
              undefined
            );
            forms.finalBeneficiaryForm.setValue('regime_type_id', undefined);
            forms.finalBeneficiaryForm.setValue(
              'date_property_regime',
              undefined
            );
            forms.finalBeneficiaryForm.setValue(
              'document_type',
              dt?.data.find((s: any) => s.id == data?.data.document_type_id)
                ?.description ?? ''
            );

            forms.finalBeneficiaryForm.setValue(
              'legal_relationship',
              'Titular'
            );
            forms.finalBeneficiaryForm.setValue('legal_position', 'Partícipe');

            dispatch(
              setFormBeneficiaryFinal(forms.finalBeneficiaryForm.getValues())
            );
            forms.finalBeneficiaryForm.reset();
          }
          forms.finalBeneficiaryForm.setValue('is_final_beneficiary', true);
          forms.finalBeneficiaryForm.setValue(
            'date_format',
            new Date().toISOString()
          );

          forms.finalBeneficiaryForm.setValue(
            'name_beneficiary',
            data?.data.name ? data?.data.name + ' ' + data?.data.middlename : ''
          );
          forms.finalBeneficiaryForm.setValue(
            'lastname_beneficiary',
            data?.data.surname
              ? data?.data.surname + ' ' + data?.data.lastname
              : ''
          );
          forms.finalBeneficiaryForm.setValue(
            'country_id',
            data?.data.place_birth ?? 6
          );
          forms.finalBeneficiaryForm.setValue(
            'date_birth',
            data?.data.birthdate ?? ''
          );
          forms.finalBeneficiaryForm.setValue(
            'nationality_id',
            data?.data.nationality_id ?? 1
          );
          forms.finalBeneficiaryForm.setValue(
            'document_number',
            data?.data.number_document ?? ''
          );
          forms.finalBeneficiaryForm.setValue('nit', '');
          forms.finalBeneficiaryForm.setValue('ruc', '');

          forms.finalBeneficiaryForm.setValue(
            'civil_status_id',
            data?.data.civil_status_id ?? 1
          );

          forms.finalBeneficiaryForm.setValue(
            'contact_email',
            lsValue.user.email
          );
          forms.finalBeneficiaryForm.setValue(
            'contact_phone',
            lsValue.user.phone_number
          );
          forms.finalBeneficiaryForm.setValue('contact_address', 'direccion');
          forms.finalBeneficiaryForm.setValue('contact_district_id', 535);
          forms.finalBeneficiaryForm.setValue('contact_province_id', 51);
          forms.finalBeneficiaryForm.setValue('contact_country_id', 6);
          forms.finalBeneficiaryForm.setValue('contact_postal_code', '12312');

          forms.finalBeneficiaryForm.setValue('name_spouse', undefined);
          forms.finalBeneficiaryForm.setValue('lastname_spouse', undefined);
          forms.finalBeneficiaryForm.setValue(
            'document_type_spouse',
            undefined
          );
          forms.finalBeneficiaryForm.setValue(
            'document_number_spouse',
            undefined
          );
          forms.finalBeneficiaryForm.setValue('regime_type_id', undefined);
          forms.finalBeneficiaryForm.setValue(
            'date_property_regime',
            undefined
          );
          forms.finalBeneficiaryForm.setValue(
            'document_type',
            dt?.data.find((s: any) => s.id == data?.data.document_type_id)
              ?.description ?? ''
          );
          forms.finalBeneficiaryForm.setValue('customer_id', lsValue.user.id);
          forms.finalBeneficiaryForm.setValue('name_holder', lsValue.user.name);

          forms.finalBeneficiaryForm.setValue('legal_relationship', 'Titular');
          forms.finalBeneficiaryForm.setValue('legal_position', 'Partícipe');

          dispatch(
            setFormBeneficiaryFinal(forms.finalBeneficiaryForm.getValues())
          );
          forms.finalBeneficiaryForm.reset();
        }
      },
    }
  );

  const { forms } = useNaturalClient();

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
                PASO {changeFinalBeneficiaryTab + 1} DE{' '}
                {changeFinalBeneficiaryTabs.length}
              </p>
              <p className='text-lg font-bold leading-none text-primary-900'>
                {
                  changeFinalBeneficiaryTabs.find(
                    (e) => e.id === changeFinalBeneficiaryTab
                  )?.title
                }
              </p>
            </div>
          </div>
          {!isFinalBeneficiaryFromModal ? (
            <Tab.Group
              selectedIndex={changeFinalBeneficiaryTab}
              onChange={(e) => {
                dispatch(setChangeFinalBeneficiaryTab(e as any));
                if (changeFinalBeneficiaryTab < e) {
                  setLastTab(e);
                }
              }}
            >
              <Tab.List className='hidden space-x-4 rounded-lg border-b border-neutral-100 ring-0 md:block'>
                {changeFinalBeneficiaryTabs.map((tab, index) => {
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
                  <FinalBeneficiaryProfileStep
                    setOpenModalCancel={setOpenModalCancel}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <IdentityValidationFacephi
                    isInside={true}
                    finalBeneficiary
                    setOpenModalCancel={setOpenModalCancel}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          ) : (
            <IdentityValidationFacephi
              isInside={true}
              finalBeneficiary
              setOpenModalCancel={setOpenModalCancel}
            />
          )}
          <Modal
            isOpen={openModalCancel}
            title='¿Deseas cancelar el registro del beneficario final?'
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
        </div>
      </DashboardLayout>
    </div>
  );
};

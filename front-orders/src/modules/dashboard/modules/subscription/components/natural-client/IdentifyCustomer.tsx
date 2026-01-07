/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import React, { FC, useLayoutEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Modal, Spinner } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import {
  GeneralStatusEnum,
  MediaQueryEnum,
  SpectrumDocumentType,
} from '@/common/enums';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import {
  IBusinessExecutiveResponse,
  IDocumentTypeResponse,
  IIdentifyCustomerResponse,
} from '@/common/interfaces';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { NaturalClientFormEnum } from '@/modules/dashboard/modules/subscription/enum/natural.client.form.enum';
import { ClientInfoService } from '@/services/ClientInfoService';
import { NaturalClientService } from '@/services/NaturalClientService';

interface IProps {
  setOpenModalCancel: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
}

export const IdentifyCustomer: FC<IProps> = ({ setOpenModalCancel }) => {
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const { forms, submitHandlers, mutations, modal } = useNaturalClient();
  const { data: typeDocumentData, isLoading: isLoadingTypeDocument } =
    useQuery<IDocumentTypeResponse>(
      ['type-document-list'],
      () => ClientInfoService().getDocumentType(),
      {
        staleTime: 60000,
      }
    );
  const { data: businessExecutiveData, isLoading: isLoadingBusinessExecutive } =
    useQuery<IBusinessExecutiveResponse>(
      ['business-executive-list'],
      () => ClientInfoService().getBusinessExecutive({ status: 1 }),
      {
        staleTime: 60000,
      }
    );

  const { isFetching } = useQuery<IIdentifyCustomerResponse>(
    ['get-identify-customer'],
    () => NaturalClientService().getIdentifyCustomer(),
    {
      onSuccess: (res) => {
        delete res.data.customer_id;
        delete res.data.id;

        for (const key of Object.keys(res.data)) {
          const index =
            key as keyof typeof forms.identifyCustomerForm.getValues;
          forms.identifyCustomerForm.setValue(index, res.data[index]);
        }
        forms.identifyCustomerForm.setValue(
          'document_type_id',
          typeDocumentData?.data.find((e) => e.id === res.data.document_type_id)
            ?.code
        );
      },
    }
  );

  useFormPersist(NaturalClientFormEnum.IDENTIFY_CUSTOMER_FORM, {
    watch: forms.identifyCustomerForm.watch,
    setValue: forms.identifyCustomerForm.setValue,
    storage: window.localStorage,
  });

  const isLoadingIdentify =
    isLoadingBusinessExecutive || isLoadingTypeDocument || isFetching;

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
    () => {
      localStorage.removeItem(NaturalClientFormEnum.IDENTIFY_CUSTOMER_FORM);
    };
  }, []);

  return (
    <div>
      <div className='bg-white py-10'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Documento del cliente
        </p>
        <p className='mt-6 text-primary-900'>
          Responde las siguientes preguntas para continuar.
        </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingIdentify ? (
              <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                  <Spinner />
                </div>
              </div>
            ) : (
              <Select
                keyDisplay='description'
                keySearchCondition='code'
                keySearchValue='description'
                keyValue='code'
                list={(typeDocumentData?.data as any) ?? []}
                name='document_type_id'
                disabled
                onChange={(document_type_id: number) => {
                  forms.identifyCustomerForm.setValue(
                    'document_type_id',
                    document_type_id
                  );

                  if (
                    forms.identifyCustomerForm.getValues('number_document')
                      .length > 1
                  ) {
                    forms.identifyCustomerForm.resetField('number_document');
                  }
                }}
                placeholder='Tipo de doc.'
                form={forms.identifyCustomerForm}
              />
            )}
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.identifyCustomerForm.register}
              error={forms.identifyCustomerForm.formState.errors}
              name='number_document'
              placeholder='N.° de documento'
              noPadding
              noWhiteSpace
              disabled
              isLoading={isLoadingIdentify}
              max={
                forms.identifyCustomerForm.getValues('document_type_id') ===
                SpectrumDocumentType.DNI
                  ? 8
                  : forms.identifyCustomerForm.getValues('document_type_id') ===
                    SpectrumDocumentType.RUC
                  ? 11
                  : 20
              }
              type={
                Array.from([
                  SpectrumDocumentType.RUC,
                  SpectrumDocumentType.DNI,
                ]).includes(
                  forms.identifyCustomerForm.getValues('document_type_id')
                )
                  ? 'number'
                  : 'alphanumeric'
              }
              form={forms.identifyCustomerForm}
            />
          </div>
        </div>
        <p className='mt-12 font-bold leading-none text-primary-900'>
          Asesor(a) de Inversiones
        </p>
        <p className='mt-6 text-primary-900'>
          En caso cuentes con un Asesor(a) de Inversiones, por favor selecciona
          su nombre.{' '}
          <span className='font-bold'>
            En caso contrario, da clic en el botón siguiente.
          </span>
        </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingIdentify ? (
              <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                  <Spinner />
                </div>
              </div>
            ) : (
              <Select
                keyDisplay='fullname'
                keySearchCondition='id'
                keySearchValue='fullname'
                keyValue='id'
                list={
                  businessExecutiveData?.data?.filter(
                    (e) => e.status === GeneralStatusEnum.ACTIVATED
                  ) ?? []
                }
                disabled={isLoadingBusinessExecutive}
                name='business_executive_id'
                onChange={(business_executive_id: number) => {
                  forms.identifyCustomerForm.setValue(
                    'business_executive_id',
                    business_executive_id
                  );
                }}
                placeholder='Asesor(a) de Inversiones'
                form={forms.identifyCustomerForm}
              />
            )}
          </div>
        </div>
      </div>
      <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
        <Button
          handleClick={() => setOpenModalCancel(true)}
          title='Cancelar'
          alternative
          noBorder
          className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:w-auto md:self-auto'
        />
        <Button
          disabled={
            mutations.identifyCustomerMutation.isLoading ||
            isLoadingIdentify ||
            forms.identifyCustomerForm.getValues('document_type_id') === '' ||
            (forms.identifyCustomerForm.getValues('number_document')
              ? !(
                  forms.identifyCustomerForm.getValues('document_type_id') ===
                  SpectrumDocumentType.DNI
                    ? [8, 9]
                    : forms.identifyCustomerForm.getValues(
                        'document_type_id'
                      ) === SpectrumDocumentType.RUC
                    ? [11, 12]
                    : Array.from(Array(13).keys()).map((e) => e + 8)
                ).includes(
                  forms.identifyCustomerForm.getValues('number_document').length
                )
              : true)
          }
          className='w-4/5 self-center md:w-auto'
          type='submit'
          handleClick={() => {
            if (
              !Array.from([
                SpectrumDocumentType.DNI,
                SpectrumDocumentType.CE,
              ]).includes(
                forms.identifyCustomerForm.getValues('document_type_id')
              )
            ) {
              modal.setOpenModalDocument(true);
              return;
            }

            localStorage.setItem(
              'current_document_type',
              forms.identifyCustomerForm.getValues('document_type_id')
            );

            submitHandlers.submitIdentifyCustomer(
              forms.identifyCustomerForm.getValues(),
              typeDocumentData!
            );
          }}
          iconEnd='/icons/ArrowRight.svg'
          loader={mutations.identifyCustomerMutation.isLoading}
          title='Siguiente'
        />
      </div>
      <Modal
        isOpen={modal.openModalDocument}
        title='Te contactaremos con un ejecutivo para continuar con tu suscripción.'
        setIsOpen={modal.setOpenModalDocument}
        customIcon={<IconDanger className='mb-1' />}
        confirmationText='Enviar mi información'
        confirmationCustomFunction={() =>
          submitHandlers.submitIdentifyCustomer(
            forms.identifyCustomerForm.getValues(),
            typeDocumentData!
          )
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
    </div>
  );
};

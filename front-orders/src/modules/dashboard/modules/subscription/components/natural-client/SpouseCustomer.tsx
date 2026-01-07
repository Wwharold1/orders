/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import React, { FC, useLayoutEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Spinner } from '@/common/components';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { FormStepsEnum, SpectrumDocumentType } from '@/common/enums';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import {
  IDocumentTypeResponse,
  INationalitiesResponse,
  IRegimeTypeResponse,
  ISpouseCustomerResponse,
} from '@/common/interfaces';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { NaturalClientFormEnum } from '@/modules/dashboard/modules/subscription/enum/natural.client.form.enum';
import { setNaturalClientTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { ClientInfoService } from '@/services/ClientInfoService';
import { NaturalClientService } from '@/services/NaturalClientService';

interface IProps {
  setOpenModalCancel: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
  update: boolean;
  state: {
    isSpoused: boolean;
    setAnuallyUpdateData: (
      state: any,
      cb?: ((state: any) => void) | undefined
    ) => void;
    anuallyUpdateData: any;
  };
}

export const SpouseCustomer: FC<IProps> = ({
  setOpenModalCancel,
  state,
  update,
}) => {
  const { form_steps } = useAppSelector((state) => state.session);

  const isEnabled = form_steps.find(
    (e) => e.description === FormStepsEnum.CONYUGE
  )?.status;
  const { isFetching } = useQuery<ISpouseCustomerResponse>(
    ['get-spouse-customer'],
    () => NaturalClientService().getSpouseCustomer(),
    {
      enabled: form_steps.find((e) => e.description === FormStepsEnum.CONYUGE)
        ?.status,
      onSuccess: (res) => {
        if (res) {
          if (Object.keys(res).length > 0) {
            delete res.data.customer_id;
            delete res.data.id;

            for (const key of Object.keys(res.data)) {
              const index =
                key as keyof typeof forms.spouseClientForm.getValues;
              forms.spouseClientForm.setValue(index, res.data[index]);
            }
          }
        }
      },
    }
  );
  const { data: regimeTypeData, isLoading: loadRegime } =
    useQuery<IRegimeTypeResponse>(['regime-type-list'], () =>
      ClientInfoService().getRegimeType()
    );
  const { data: typeDocumentData, isLoading: loadType } =
    useQuery<IDocumentTypeResponse>(['type-document-list'], () =>
      ClientInfoService().getDocumentType()
    );
  const { data: nationalitiesData, isLoading: loadNationality } =
    useQuery<INationalitiesResponse>(['nationalities-list'], () =>
      ClientInfoService().getNationalities()
    );
  const { forms, submitHandlers, mutations } = useNaturalClient();
  const dispatch = useAppDispatch();
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );

  useFormPersist(NaturalClientFormEnum.SPOUSE_CUSTOMER_FORM, {
    watch: forms.spouseClientForm.watch,
    setValue: forms.spouseClientForm.setValue,
    storage: window.localStorage,
  });

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
  }, []);

  const getRequiredValues = () => {
    const values = forms.spouseClientForm.getValues();

    delete values.middlename;

    return values;
  };

  const loadSpouse =
    loadNationality ||
    loadRegime ||
    loadType ||
    (isEnabled ? isFetching : false);

  return (
    <div>
      <div className='bg-white py-10'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Usuario casado{' '}
        </p>
        <p className='mt-8 font-bold text-primary-900'>Tipo de régimen</p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {loadSpouse ? (
              <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                  <Spinner />
                </div>
              </div>
            ) : (
              <Select
                keyDisplay='description'
                keySearchCondition='id'
                keySearchValue='description'
                keyValue='id'
                list={(regimeTypeData?.data as any) ?? []}
                name='regime_type_id'
                onChange={(regime_type_id: number) => {
                  forms.spouseClientForm.setValue(
                    'regime_type_id',
                    regime_type_id
                  );
                }}
                placeholder='Tipo de régimen'
                form={forms.spouseClientForm}
              />
            )}
          </div>
        </div>
        <p className='mt-12 font-bold text-primary-900'>Datos del cónyuge</p>
        <p className='mt-4 text-primary-900'>
          Responde las siguientes preguntas. Completa la información como
          aparece en tu documento de identidad.
        </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.spouseClientForm.register}
              error={forms.spouseClientForm.formState.errors}
              name='name'
              placeholder='Primer nombre'
              noPadding
              type='text'
              isLoading={loadSpouse}
              form={forms.spouseClientForm}
            />
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.spouseClientForm.register}
              error={forms.spouseClientForm.formState.errors}
              name='middlename'
              placeholder='Segundo Nombre (opcional)'
              noPadding
              type='text'
              isLoading={loadSpouse}
              form={forms.spouseClientForm}
            />
          </div>
        </div>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.spouseClientForm.register}
              error={forms.spouseClientForm.formState.errors}
              name='surname'
              placeholder='Apellido paterno'
              noPadding
              type='text'
              isLoading={loadSpouse}
              form={forms.spouseClientForm}
            />
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.spouseClientForm.register}
              error={forms.spouseClientForm.formState.errors}
              name='lastname'
              placeholder='Apellido materno'
              noPadding
              type='text'
              isLoading={loadSpouse}
              form={forms.spouseClientForm}
            />
          </div>
        </div>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {loadSpouse ? (
              <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                  <Spinner />
                </div>
              </div>
            ) : (
              <Select
                keyDisplay='description'
                keySearchCondition='id'
                keySearchValue='description'
                keyValue='id'
                list={(typeDocumentData?.data as any) ?? []}
                name='type_document_id'
                onChange={(type_document_id: number) => {
                  forms.spouseClientForm.setValue(
                    'type_document_id',
                    type_document_id
                  );
                  if (
                    forms.spouseClientForm.getValues('document_number').length >
                    1
                  ) {
                    forms.spouseClientForm.resetField('document_number');
                  }
                }}
                placeholder='Tipo de documento'
                form={forms.spouseClientForm}
              />
            )}
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.spouseClientForm.register}
              error={forms.spouseClientForm.formState.errors}
              name='document_number'
              placeholder='N.° de documento'
              noPadding
              noWhiteSpace
              isLoading={loadSpouse}
              max={
                (typeDocumentData?.data?.find(
                  (e) =>
                    e.id ===
                    forms.spouseClientForm.getValues('type_document_id')
                )?.code as SpectrumDocumentType) === SpectrumDocumentType.DNI
                  ? 8
                  : (typeDocumentData?.data?.find(
                      (e) =>
                        e.id ===
                        forms.spouseClientForm.getValues('type_document_id')
                    )?.code as SpectrumDocumentType) ===
                    SpectrumDocumentType.RUC
                  ? 11
                  : 20
              }
              type={
                Array.from([
                  SpectrumDocumentType.RUC,
                  SpectrumDocumentType.DNI,
                ]).includes(
                  typeDocumentData?.data?.find(
                    (e) =>
                      e.id ===
                      forms.spouseClientForm.getValues('type_document_id')
                  )?.code as SpectrumDocumentType
                )
                  ? 'number'
                  : 'alphanumeric'
              }
              form={forms.spouseClientForm}
            />
          </div>
        </div>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {loadSpouse ? (
              <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                  <Spinner />
                </div>
              </div>
            ) : (
              <Select
                keyDisplay='description'
                keySearchCondition='id'
                keySearchValue='description'
                keyValue='id'
                list={(nationalitiesData?.data as any) ?? []}
                name='nationality_id'
                onChange={(nationality_id: number) => {
                  forms.spouseClientForm.setValue(
                    'nationality_id',
                    nationality_id
                  );
                }}
                placeholder='Nacionalidad'
                form={forms.spouseClientForm}
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
          className='order-2 mt-4 hidden w-full md:order-none md:mt-0 md:block md:w-auto'
        />
        <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            iconStart='/icons/ArrowLeft.svg'
            alternative
            handleClick={() =>
              dispatch(setNaturalClientTab((naturalClientTab - 1) as any))
            }
            title='Anterior'
          />
          <Button
            className='w-4/5 self-center  md:w-auto'
            type='submit'
            handleClick={() => {
              if (update) {
                dispatch(setNaturalClientTab(4));
                state.setAnuallyUpdateData({
                  ...state.anuallyUpdateData,
                  spouse_customer: forms.spouseClientForm.getValues(),
                });
                return;
              }
              submitHandlers.submitSpouseCustomer(
                forms.spouseClientForm.getValues()
              );
            }}
            loader={mutations.spouseCustomerMutation.isLoading}
            disabled={
              Object.values(getRequiredValues()).includes('') ||
              Object.values(getRequiredValues()).length < 7 ||
              Object.values(forms.spouseClientForm.getValues()).includes(0) ||
              mutations.spouseCustomerMutation.isLoading ||
              (forms.spouseClientForm.getValues('document_number')
                ? !(
                    forms.spouseClientForm.getValues('type_document_id') ===
                    SpectrumDocumentType.DNI
                      ? [8, 9]
                      : (typeDocumentData?.data?.find(
                          (e) =>
                            e.id ===
                            forms.spouseClientForm.getValues('type_document_id')
                        )?.code as SpectrumDocumentType) ===
                        SpectrumDocumentType.RUC
                      ? [11, 12]
                      : Array.from(Array(13).keys()).map((e) => e + 8)
                  ).includes(
                    forms.spouseClientForm.getValues('document_number').length
                  )
                : true) ||
              loadSpouse
            }
            iconEnd='/icons/ArrowRight.svg'
            title='Siguiente'
          />
        </div>
      </div>
    </div>
  );
};

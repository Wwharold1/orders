/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import router from 'next/router';
import React, { FC, useLayoutEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Spinner } from '@/common/components';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import {
  ICivilStatusResponse,
  ICountryResponse,
  IGenderResponse,
  IInstructionGradeResponse,
  INationalitiesResponse,
  IPersonalInformationResponse,
} from '@/common/interfaces';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { NaturalClientFormEnum } from '@/modules/dashboard/modules/subscription/enum/natural.client.form.enum';
import { setNaturalClientTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { ClientInfoService } from '@/services/ClientInfoService';
import { NaturalClientService } from '@/services/NaturalClientService';

const formatDate = (date: Date) => {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

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

export const PersonalInformation: FC<IProps> = ({
  setOpenModalCancel,
  state,
  update,
}) => {
  const { forms, submitHandlers, mutations } = useNaturalClient();
  const dispatch = useAppDispatch();
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
  }, []);

  const { data: genderData, isLoading: loadGender } = useQuery<IGenderResponse>(
    ['genders-list'],
    () => ClientInfoService().getGenders()
  );
  const { data: civilStatusData, isLoading: loadCivil } =
    useQuery<ICivilStatusResponse>(['civil-status-list'], () =>
      ClientInfoService().getCivilStatus()
    );
  const { data: nationalitiesData, isLoading: loadNationalities } =
    useQuery<INationalitiesResponse>(['nationalities-list'], () =>
      ClientInfoService().getNationalities()
    );
  const { data: instructionGradeData, isLoading: loadInstruction } =
    useQuery<IInstructionGradeResponse>(['instruction-grade-list'], () =>
      ClientInfoService().getInstructionGrade()
    );
  const { data: countryData, isLoading: loadCountry } =
    useQuery<ICountryResponse>(['countries-list'], () =>
      ClientInfoService().getCountries()
    );

  const getEnabled =
    !!civilStatusData &&
    !!nationalitiesData &&
    !!instructionGradeData &&
    !!countryData;

  const isFromProfile = router.query.profile;
  const { isFetching } = useQuery<IPersonalInformationResponse>(
    ['get-personal-info'],
    () => NaturalClientService().getProfileCustomer(),
    {
      enabled: getEnabled,
      onSuccess: (res) => {
        if (res.data) {
          delete res.data.customer_id;
          delete res.data.id;
          delete res.data.number_document;
          delete res.data.document_type_id;

          for (const key of Object.keys(res.data)) {
            const index =
              key as keyof typeof forms.personalInformationForm.getValues;
            forms.personalInformationForm.setValue(index, res.data[index]);
          }
          forms.personalInformationForm.setValue(
            'birthdate',
            formatDate(new Date(res.data.birthdate))
          );
        }
      },
    }
  );

  useFormPersist(NaturalClientFormEnum.PERSONAL_INFORMATION_FORM, {
    watch: forms.personalInformationForm.watch,
    setValue: forms.personalInformationForm.setValue,
    storage: window.localStorage,
  });

  const getRequiredValues = () => {
    const values = forms.personalInformationForm.getValues();
    delete values.middlename;

    return values;
  };

  const isLoadingPersonal =
    loadGender ||
    loadCivil ||
    loadNationalities ||
    loadInstruction ||
    loadCountry ||
    (getEnabled ? isFetching : false);

  return (
    <div>
      <div className='bg-white py-10'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Identificación del cliente
        </p>
        <p className='mt-6 text-primary-900'>
          Responde las siguientes preguntas. Completa la información{' '}
          <span className='font-bold'>
            como aparece en tu documento de identidad.{' '}
          </span>
        </p>
        <div className='mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              isLoading={isLoadingPersonal}
              formRegister={forms.personalInformationForm.register}
              error={forms.personalInformationForm.formState.errors}
              name='name'
              placeholder='Primer nombre'
              noPadding
              max={50}
              disabled
              type='text'
              form={forms.personalInformationForm}
            />
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              isLoading={isLoadingPersonal}
              formRegister={forms.personalInformationForm.register}
              error={forms.personalInformationForm.formState.errors}
              name='middlename'
              placeholder='Segundo nombre (opcional)'
              noPadding
              disabled
              max={50}
              type='text'
              form={forms.personalInformationForm}
            />
          </div>
        </div>
        <div className='mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              isLoading={isLoadingPersonal}
              formRegister={forms.personalInformationForm.register}
              error={forms.personalInformationForm.formState.errors}
              name='surname'
              placeholder='Apellido paterno'
              noPadding
              disabled
              max={50}
              type='text'
              form={forms.personalInformationForm}
            />
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              isLoading={isLoadingPersonal}
              formRegister={forms.personalInformationForm.register}
              error={forms.personalInformationForm.formState.errors}
              name='lastname'
              placeholder='Apellido materno'
              noPadding
              disabled
              max={50}
              type='text'
              form={forms.personalInformationForm}
            />
          </div>
        </div>
        <div className='mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingPersonal ? (
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
                list={(genderData?.data as any) ?? []}
                name='gender_id'
                onChange={(gender_id: number) => {
                  forms.personalInformationForm.setValue(
                    'gender_id',
                    gender_id
                  );
                }}
                disabled
                placeholder='Sexo'
                form={forms.personalInformationForm}
              />
            )}
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingPersonal ? (
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
                list={(civilStatusData?.data as any) ?? []}
                name='civil_status_id'
                onChange={(civil_status_id: number) => {
                  forms.personalInformationForm.setValue(
                    'civil_status_id',
                    civil_status_id
                  );
                }}
                placeholder='Estado civil'
                form={forms.personalInformationForm}
              />
            )}
          </div>
        </div>
        <div className='mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              isLoading={isLoadingPersonal}
              formRegister={forms.personalInformationForm.register}
              error={forms.personalInformationForm.formState.errors}
              name='birthdate'
              placeholder='Fecha de nacimiento'
              noPadding
              noWhiteSpace
              type='date'
              disabled
              form={forms.personalInformationForm}
            />
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingPersonal ? (
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
                list={(countryData?.data as any) ?? []}
                name='place_birth'
                onChange={(place_birth: number) => {
                  forms.personalInformationForm.setValue(
                    'place_birth',
                    place_birth
                  );
                }}
                disabled={!!update}
                placeholder='Lugar de nacimiento'
                form={forms.personalInformationForm}
              />
            )}
          </div>
        </div>
        <div className='mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingPersonal ? (
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
                  forms.personalInformationForm.setValue(
                    'nationality_id',
                    nationality_id
                  );
                }}
                placeholder='Nacionalidad'
                form={forms.personalInformationForm}
              />
            )}
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingPersonal ? (
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
                list={(instructionGradeData?.data as any) ?? []}
                name='instruction_grade_id'
                onChange={(instruction_grade_id: number) => {
                  forms.personalInformationForm.setValue(
                    'instruction_grade_id',
                    instruction_grade_id
                  );
                }}
                placeholder='Grado de instrucción'
                form={forms.personalInformationForm}
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
          className='order-2 mt-4 hidden w-full ring-inset md:order-none md:mt-0 md:block md:w-auto'
        />
        <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
          {!isFromProfile && (
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
          )}
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            iconEnd='/icons/ArrowRight.svg'
            handleClick={() => {
              if (update) {
                dispatch(setNaturalClientTab(1));
                state.setAnuallyUpdateData({
                  ...state.anuallyUpdateData,
                  civil_status_id:
                    forms.personalInformationForm.getValues('civil_status_id'),
                  instruction_grade_id: forms.personalInformationForm.getValues(
                    'instruction_grade_id'
                  ),
                  nationality_id:
                    forms.personalInformationForm.getValues('nationality_id'),
                });
                return;
              }
              submitHandlers.submitPersonalInformation(
                forms.personalInformationForm.getValues(),
                civilStatusData!
              );
            }}
            loader={mutations.personalInformationMutation.isLoading}
            disabled={
              Object.values(getRequiredValues()).includes(null as any)
                ? true
                : Object.values(getRequiredValues())
                    .map((e: any) => e.toString().trim())
                    .includes('') ||
                  Object.values(forms.personalInformationForm.getValues())
                    .length < 10 ||
                  Object.values(
                    forms.personalInformationForm.getValues()
                  ).includes(0) ||
                  mutations.personalInformationMutation.isLoading ||
                  isLoadingPersonal
            }
            title='Siguiente'
          />
        </div>
      </div>
    </div>
  );
};

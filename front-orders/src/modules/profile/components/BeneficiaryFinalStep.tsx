/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { FC, useEffect, useLayoutEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Spinner } from '@/common/components';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { FormStepsEnum } from '@/common/enums/form-steps.enum';
import { AUTH_LOCAL_STORAGE_KEY } from '@/common/helper';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import {
  ICivilStatusResponse,
  ICountryResponse,
  IDepartmentResponse,
  IDistrictResponse,
  IDocumentTypeResponse,
  INationalitiesResponse,
  IPersonalInformationResponse,
  IProvinceResponse,
  IRegimeTypeResponse,
} from '@/common/interfaces';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { NaturalClientFormEnum } from '@/modules/dashboard/modules/subscription/enum/natural.client.form.enum';
import {
  setChangeFinalBeneficiaryTab,
  setFormBeneficiaryFinal,
} from '@/modules/dashboard/slice/finalBeneficiarySlice';
import { ClientInfoService } from '@/services/ClientInfoService';
import { NaturalClientService } from '@/services/NaturalClientService';

interface IProps {
  setOpenModalCancel: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
}

export const FinalBeneficiaryProfileStep: FC<IProps> = ({
  setOpenModalCancel,
}) => {
  const [isBeneficiary, setIsBeneficiary] = useStateCallback<boolean>(false);
  const [selectCivil, setSelectCivil] = useStateCallback<number>(1);
  const dispatch = useAppDispatch();
  const { contextTabs: _contextTabs } = useAppSelector(
    (state) => state.subscription
  );
  const { naturalClientTab: _naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );
  const { forms, mutations } = useNaturalClient();

  const { form_steps } = useAppSelector((state) => state.session);
  const [isEnabled, setIsEnabled] = useStateCallback(
    form_steps.find((e) => e.description === FormStepsEnum.FINAL_BENEFICIARY)
      ?.status
  );

  const queryClient = useQueryClient();

  const { data: countryData, isLoading: loadCountry } =
    useQuery<ICountryResponse>(
      ['country-list'],
      () => ClientInfoService().getCountries(),
      {
        enabled: true,
        cacheTime: Infinity,
        staleTime: Infinity,
      }
    );

  const { data: nationalitiesData, isLoading: loadNationality } =
    useQuery<INationalitiesResponse>(
      ['nationalities-list'],
      () => ClientInfoService().getNationalities(),
      {
        enabled: true,
        cacheTime: Infinity,
        staleTime: Infinity,
      }
    );

  const { data: typeDocumentData, isLoading: isLoadingTypeDocument } =
    useQuery<IDocumentTypeResponse>(
      ['type-document-list'],
      () => ClientInfoService().getDocumentType(),
      {
        enabled: true,
        cacheTime: Infinity,
        staleTime: Infinity,
      }
    );

  const { data: departmentData, isLoading: loadDepartment } =
    useQuery<IDepartmentResponse>(
      ['department-list'],
      () => ClientInfoService().getDepartments(),
      {
        enabled: true,
        onSuccess: () => {
          if (!isEnabled) {
            queryClient.setQueryData(['province-list'], []);
            queryClient.setQueryData(['district-list'], []);
          }
        },
        cacheTime: Infinity,
        staleTime: Infinity,
      }
    );

  const { data: civilStatusData, isLoading: _loadCivil } =
    useQuery<ICivilStatusResponse>(['civil-status-list'], () =>
      ClientInfoService().getCivilStatus()
    );

  const { data: regimeTypeData, isLoading: loadRegime } =
    useQuery<IRegimeTypeResponse>(['regime-type-list'], () =>
      ClientInfoService().getRegimeType()
    );

  const {
    data: provinceData,
    isRefetching: refetchProvince,
    isLoading: loadProvince,
  } = useQuery<IProvinceResponse>(
    ['province-list'],
    () =>
      ClientInfoService().getProvinces(
        forms.finalBeneficiaryForm
          .getValues('contact_department_id')
          ?.toString() ?? ''
      ),
    {
      enabled: !!forms.finalBeneficiaryForm.getValues('contact_department_id'),
      onSuccess: () => {
        if (!isEnabled) {
          queryClient.setQueryData(['district-list'], []);
        }
      },
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  const { data: profileData, isFetching: loadProfile } =
    useQuery<IPersonalInformationResponse>(['get-personal-info'], () =>
      NaturalClientService().getProfileCustomer()
    );

  const {
    data: districtData,
    isRefetching: refetchDistrict,
    isLoading: loadDistrict,
  } = useQuery<IDistrictResponse>(
    ['district-list'],
    () =>
      ClientInfoService().getDistricts(
        forms.finalBeneficiaryForm.getValues('contact_province_id').toString()
      ),
    {
      enabled: !!forms.finalBeneficiaryForm.getValues('contact_province_id'),
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  function getToday(): string {
    const date = new Date();

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month < 10) {
      return `${day}/0${month}/${year}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  }

  const isLoading =
    loadDepartment ||
    loadDistrict ||
    loadProvince ||
    loadCountry ||
    isLoadingTypeDocument ||
    loadRegime ||
    loadProfile;

  useEffect(() => {
    if (
      isEnabled &&
      !loadDepartment &&
      !loadDistrict &&
      !loadProvince &&
      !loadCountry &&
      !isLoadingTypeDocument
    ) {
      setIsEnabled(false);
    }
  }, [loadDepartment, loadDistrict, loadProvince]);

  useFormPersist(NaturalClientFormEnum.FINAL_BENEFICIARY_FORM, {
    watch: forms.finalBeneficiaryForm.watch,
    setValue: forms.finalBeneficiaryForm.setValue,
    storage: window.localStorage,
  });

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
    setIsBeneficiary(
      forms.finalBeneficiaryForm.getValues('is_final_beneficiary') ??
        isBeneficiary
    );

    forms.finalBeneficiaryForm.setValue('is_final_beneficiary', isBeneficiary);
    setSelectCivil(selectCivil ?? 1);
    forms.finalBeneficiaryForm.setValue('civil_status_id', selectCivil ?? 1);
  }, []);

  return (
    <div>
      <div className='bg-white py-10'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Beneficiario Final{' '}
        </p>
        <p className='mt-6 text-primary-900'>
          El beneficiario final es la persona natural que, en última instancia,
          controla o se beneficia de las inversiones de una entidad. Su
          identificación es clave para la transparencia y la prevención de
          lavado de dinero. ¿Eres el beneficiario final de las suscripciones que
          realizarás?
        </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div
            className={clsx(
              'col-span-3 flex w-full items-start space-x-2 rounded-l md:col-span-1'
            )}
          >
            <div
              onClick={() => {
                setIsBeneficiary(true);
                forms.finalBeneficiaryForm.setValue(
                  'is_final_beneficiary',
                  true
                );
              }}
              className={clsx(
                'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                isBeneficiary ? 'border-[#0066CC]' : 'border-neutral-200'
              )}
            >
              {isBeneficiary && (
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
              )}
            </div>
            <div>
              <span className='text-primary-900'>Si</span>
            </div>
          </div>
          <div
            className={clsx(
              'col-span-3 flex w-full items-start space-x-2 rounded-l md:col-span-1'
            )}
          >
            <div
              onClick={() => {
                setIsBeneficiary(false);
                forms.finalBeneficiaryForm.setValue(
                  'is_final_beneficiary',
                  false
                );
                forms.finalBeneficiaryForm.reset();
              }}
              className={clsx(
                'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                !isBeneficiary ? 'border-[#0066CC]' : 'border-neutral-200'
              )}
            >
              {!isBeneficiary && (
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
              )}
            </div>
            <div>
              <span className='text-primary-900'>No</span>
            </div>
          </div>
        </div>

        {!isBeneficiary ? (
          <div>
            <div className='bg-white'>
              <h4 className='mr-5 mt-5 inline-flex text-sm font-bold text-primary-900'>
                Fecha de formato:
              </h4>
              <span className='mr-10 inline-flex text-sm  text-primary-900'>
                {getToday()}
              </span>
              <p className='mr-5 inline-flex text-sm font-bold text-primary-900'>
                Nombre del Títular:
              </p>
              <span className='inline-flex text-sm text-primary-900'>
                {JSON.parse(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)!)
                  ? JSON.parse(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)!)
                      .user.name
                  : ''}
              </span>
            </div>
            <div className='bg-white py-4'>
              <p className='mt-1 text-sm font-bold text-primary-900'>
                Datos del beneficiario final
              </p>

              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='name_beneficiary'
                    placeholder='Nombre'
                    noPadding
                    type='text'
                    isLoading={false}
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.spouseClientForm.formState.errors}
                    name='lastname_beneficiary'
                    placeholder='Apellidos'
                    noPadding
                    type='text'
                    isLoading={false}
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
              </div>
              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    isLoading={false}
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='date_birth'
                    placeholder='Fecha de nacimiento'
                    noPadding
                    noWhiteSpace
                    type='date'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
                <div className='relative col-span-12 md:col-span-6'>
                  {(isEnabled ? isLoading : loadCountry) ? (
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
                      name='country_id'
                      onChange={(country_id: number) => {
                        forms.finalBeneficiaryForm.setValue(
                          'country_id',
                          country_id
                        );
                      }}
                      placeholder='País de residencia'
                      disabled={!countryData?.data}
                      form={forms.finalBeneficiaryForm}
                    />
                  )}
                </div>
              </div>

              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  {(isEnabled ? isLoading : loadNationality) ? (
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
                        forms.finalBeneficiaryForm.setValue(
                          'nationality_id',
                          nationality_id
                        );
                      }}
                      placeholder='Nacionalidad'
                      disabled={!nationalitiesData?.data}
                      form={forms.finalBeneficiaryForm}
                    />
                  )}
                </div>
                <div className='relative col-span-12 md:col-span-3'>
                  {isLoadingTypeDocument ? (
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
                      disabled={isLoadingTypeDocument}
                      onChange={(tipoIdentidad: string) => {
                        forms.finalBeneficiaryForm.setValue(
                          'document_type_id',
                          tipoIdentidad
                        );
                        if (
                          forms.finalBeneficiaryForm.getValues(
                            'document_number'
                          )
                        ) {
                          forms.finalBeneficiaryForm.resetField(
                            'document_number'
                          );
                        }
                      }}
                      placeholder='Tipo de doc.'
                      form={forms.finalBeneficiaryForm}
                    />
                  )}
                </div>
                <div className='relative col-span-12 md:col-span-3'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='document_number'
                    placeholder='N.° de documento'
                    noPadding
                    noWhiteSpace
                    max={9}
                    type='number'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
              </div>
              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='nit'
                    placeholder='NIT'
                    noPadding
                    noWhiteSpace
                    max={9}
                    type='number'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='ruc'
                    placeholder='RUC'
                    noPadding
                    noWhiteSpace
                    max={9}
                    type='number'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
              </div>

              <p className='mb-5 mt-5 text-sm font-bold text-primary-900'>
                Estado civil
              </p>

              <div className=' mt-5 grid grid-cols-7 gap-x-5 gap-y-5 md:gap-y-0'>
                {civilStatusData?.data?.map(function (object, i) {
                  return (
                    <div
                      key={i}
                      className={clsx(
                        'col-span-3 flex w-full items-start space-x-2 rounded-l md:col-span-1'
                      )}
                    >
                      <div
                        onClick={() => {
                          setSelectCivil(object.id);
                          forms.finalBeneficiaryForm.setValue(
                            'civil_status_id',
                            object.id
                          );
                        }}
                        className={clsx(
                          'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                          selectCivil == object.id
                            ? 'border-[#0066CC]'
                            : 'border-neutral-200'
                        )}
                      >
                        {selectCivil == object.id && (
                          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
                        )}
                      </div>
                      <div>
                        <span className='text-primary-900'>
                          {object.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectCivil == 2 || selectCivil == 5 ? (
                <div>
                  <p className='mb-5 mt-5 text-sm font-bold text-primary-900'>
                    Datos del cónyuge
                  </p>

                  <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                    <div className='relative col-span-12 md:col-span-6'>
                      <Input
                        formRegister={forms.finalBeneficiaryForm.register}
                        error={forms.finalBeneficiaryForm.formState.errors}
                        name='name_spouse'
                        placeholder='Nombres'
                        noPadding
                        noWhiteSpace
                        type='text'
                        form={forms.finalBeneficiaryForm}
                      />
                    </div>
                    <div className='relative col-span-12 md:col-span-6'>
                      <Input
                        formRegister={forms.finalBeneficiaryForm.register}
                        error={forms.finalBeneficiaryForm.formState.errors}
                        name='lastname_spouse'
                        placeholder='Apellidos'
                        noPadding
                        noWhiteSpace
                        max={9}
                        type='text'
                        form={forms.finalBeneficiaryForm}
                      />
                    </div>
                  </div>
                  <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                    <div className='relative col-span-12 md:col-span-3'>
                      {isLoadingTypeDocument ? (
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
                          name='document_type_spouse_id'
                          disabled={isLoadingTypeDocument}
                          onChange={(tipoIdentidad: string) => {
                            forms.finalBeneficiaryForm.setValue(
                              'document_type_spouse_id',
                              tipoIdentidad
                            );
                            if (
                              forms.finalBeneficiaryForm.getValues(
                                'document_number_spouse'
                              )
                            ) {
                              forms.finalBeneficiaryForm.resetField(
                                'document_number_spouse'
                              );
                            }
                          }}
                          placeholder='Tipo de doc.'
                          form={forms.finalBeneficiaryForm}
                        />
                      )}
                    </div>
                    <div className='relative col-span-12 md:col-span-3'>
                      <Input
                        formRegister={forms.finalBeneficiaryForm.register}
                        error={forms.finalBeneficiaryForm.formState.errors}
                        name='document_number_spouse'
                        placeholder='N.° de documento'
                        noPadding
                        noWhiteSpace
                        max={9}
                        type='number'
                        form={forms.finalBeneficiaryForm}
                      />
                    </div>
                  </div>
                  <p className='mb-5 mt-5 text-sm font-bold text-primary-900'>
                    Sobre el régimen
                  </p>

                  <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                    <div className='relative col-span-12 md:col-span-6'>
                      {loadRegime ? (
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
                            forms.finalBeneficiaryForm.setValue(
                              'regime_type_id',
                              regime_type_id
                            );
                          }}
                          placeholder='Tipo de régimen'
                          form={forms.finalBeneficiaryForm}
                        />
                      )}
                    </div>
                    <div className='relative col-span-12 md:col-span-6'>
                      <Input
                        isLoading={false}
                        formRegister={forms.finalBeneficiaryForm.register}
                        error={forms.finalBeneficiaryForm.formState.errors}
                        name='date_property_regime'
                        placeholder='Fecha de inicio'
                        noPadding
                        noWhiteSpace
                        type='date'
                        form={forms.finalBeneficiaryForm}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              <p className='mb-5 mt-10 text-sm font-bold text-primary-900'>
                Datos de contacto del beneficiario final
              </p>

              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='contact_email'
                    placeholder='Correo eletrónico'
                    noPadding
                    noWhiteSpace
                    type='text'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='contact_phone'
                    placeholder='Número telefónico'
                    noPadding
                    noWhiteSpace
                    max={9}
                    type='number'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
              </div>

              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  {(isEnabled ? isLoading : loadCountry) ? (
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
                      name='contact_country_id'
                      onChange={(contact_country_id: number) => {
                        forms.finalBeneficiaryForm.setValue(
                          'contact_country_id',
                          contact_country_id
                        );
                      }}
                      placeholder='País'
                      disabled={!countryData?.data}
                      form={forms.finalBeneficiaryForm}
                    />
                  )}
                </div>
                <div className='relative col-span-12 md:col-span-6'>
                  {(isEnabled ? isLoading : loadDepartment) ? (
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
                      list={(departmentData?.data as any) ?? []}
                      name='contact_department_id'
                      onChange={(department_id: number) => {
                        forms.finalBeneficiaryForm.setValue(
                          'contact_department_id',
                          department_id
                        );
                        forms.finalBeneficiaryForm.setValue(
                          'contact_province_id',
                          0
                        );
                        forms.finalBeneficiaryForm.setValue(
                          'contact_district_id',
                          0
                        );
                        queryClient.setQueryData(['province-list'], []);
                        queryClient.setQueryData(['district-list'], []);
                        queryClient.invalidateQueries(['province-list']);
                        queryClient.invalidateQueries(['district-list']);
                      }}
                      placeholder='Departamento'
                      disabled={!departmentData?.data}
                      form={forms.finalBeneficiaryForm}
                    />
                  )}
                </div>
              </div>

              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  {(isEnabled ? isLoading : refetchProvince) ? (
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
                      list={(provinceData?.data as any) ?? []}
                      name='contact_province_id'
                      onChange={(province_id: number) => {
                        forms.finalBeneficiaryForm.setValue(
                          'contact_province_id',
                          province_id
                        );
                        forms.finalBeneficiaryForm.setValue(
                          'contact_district_id',
                          0
                        );
                        queryClient.setQueryData(['district-list'], []);
                        queryClient.invalidateQueries(['district-list']);
                      }}
                      disabled={!provinceData?.data}
                      placeholder='Provincia'
                      form={forms.finalBeneficiaryForm}
                    />
                  )}
                </div>
                <div className='relative col-span-12 md:col-span-6'>
                  {(isEnabled ? isLoading : refetchDistrict) ? (
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
                      list={(districtData?.data as any) ?? []}
                      name='contact_district_id'
                      disabled={!districtData?.data}
                      onChange={(district_id: number) => {
                        forms.finalBeneficiaryForm.setValue(
                          'contact_district_id',
                          district_id
                        );
                      }}
                      placeholder='Distrito'
                      form={forms.finalBeneficiaryForm}
                    />
                  )}
                </div>
              </div>

              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='contact_address'
                    placeholder='Dirección'
                    noPadding
                    isLoading={isLoading}
                    type='text'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
                <div className='relative col-span-12 md:col-span-6'>
                  <Input
                    formRegister={forms.finalBeneficiaryForm.register}
                    error={forms.finalBeneficiaryForm.formState.errors}
                    name='contact_postal_code'
                    placeholder='Código postal'
                    noPadding
                    max={5}
                    isLoading={isLoading}
                    type='text'
                    form={forms.finalBeneficiaryForm}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
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
            className=' w-full md:w-auto'
            type='submit'
            iconEnd='/icons/ArrowRight.svg'
            title='Siguiente'
            handleClick={() => {
              // if (update) {
              //   dispatch(setNaturalClientTab((naturalClientTab + 1) as any));
              //   state.setAnuallyUpdateData({
              //     ...state.anuallyUpdateData,
              //     final_beneficiary: forms.finalBeneficiaryForm.getValues(),
              //   });
              //   return;
              // }

              const lsValue = JSON.parse(
                localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)!
              );
              forms.finalBeneficiaryForm.setValue(
                'date_format',
                new Date().toISOString()
              );

              if (isBeneficiary) {
                forms.finalBeneficiaryForm.setValue(
                  'name_beneficiary',
                  profileData?.data.name
                    ? profileData?.data.name +
                        ' ' +
                        profileData?.data.middlename
                    : ''
                );
                forms.finalBeneficiaryForm.setValue(
                  'lastname_beneficiary',
                  profileData?.data.surname
                    ? profileData?.data.surname +
                        ' ' +
                        profileData?.data.lastname
                    : ''
                );
                forms.finalBeneficiaryForm.setValue(
                  'country_id',
                  profileData?.data.place_birth ?? 6
                );
                forms.finalBeneficiaryForm.setValue(
                  'date_birth',
                  profileData?.data.birthdate ?? ''
                );
                forms.finalBeneficiaryForm.setValue(
                  'nationality_id',
                  profileData?.data.nationality_id ?? 1
                );
                forms.finalBeneficiaryForm.setValue(
                  'document_number',
                  profileData?.data.number_document ?? ''
                );
                forms.finalBeneficiaryForm.setValue('nit', '');
                forms.finalBeneficiaryForm.setValue('ruc', '');

                forms.finalBeneficiaryForm.setValue(
                  'civil_status_id',
                  profileData?.data.civil_status_id ?? 1
                );

                forms.finalBeneficiaryForm.setValue(
                  'contact_email',
                  lsValue.user.email
                );
                forms.finalBeneficiaryForm.setValue(
                  'contact_phone',
                  lsValue.user.phone_number
                );
                forms.finalBeneficiaryForm.setValue(
                  'contact_address',
                  'direccion'
                );
                forms.finalBeneficiaryForm.setValue('contact_district_id', 535);
                forms.finalBeneficiaryForm.setValue('contact_province_id', 51);
                forms.finalBeneficiaryForm.setValue('contact_country_id', 6);
                forms.finalBeneficiaryForm.setValue(
                  'contact_postal_code',
                  '12312'
                );

                forms.finalBeneficiaryForm.setValue('name_spouse', undefined);
                forms.finalBeneficiaryForm.setValue(
                  'lastname_spouse',
                  undefined
                );
                forms.finalBeneficiaryForm.setValue(
                  'document_type_spouse',
                  undefined
                );
                forms.finalBeneficiaryForm.setValue(
                  'document_number_spouse',
                  undefined
                );
                forms.finalBeneficiaryForm.setValue(
                  'regime_type_id',
                  undefined
                );
                forms.finalBeneficiaryForm.setValue(
                  'date_property_regime',
                  undefined
                );
              }
              const dts: any = forms.finalBeneficiaryForm.getValues(
                'document_type_spouse'
              );
              forms.finalBeneficiaryForm.setValue(
                'document_type',
                typeDocumentData?.data.find(
                  (s) => s.id == profileData?.data.document_type_id
                )?.description ?? ''
              );
              forms.finalBeneficiaryForm.setValue(
                'document_type_spouse',
                typeDocumentData?.data.find((s) => s.id == dts)?.description ??
                  ''
              );

              forms.finalBeneficiaryForm.setValue(
                'legal_relationship',
                'Titular'
              );
              forms.finalBeneficiaryForm.setValue(
                'legal_position',
                'Partícipe'
              );

              if (lsValue) {
                forms.finalBeneficiaryForm.setValue(
                  'customer_id',
                  lsValue.user.id
                );
                forms.finalBeneficiaryForm.setValue(
                  'name_holder',
                  lsValue.user.name
                );
              }

              dispatch(
                setFormBeneficiaryFinal(forms.finalBeneficiaryForm.getValues())
              );
              dispatch(setChangeFinalBeneficiaryTab(1));
            }}
            loader={mutations.finalBeneficiaryMutation.isLoading}
            disabled={
              isBeneficiary
                ? false
                : mutations.spouseCustomerMutation.isLoading ||
                  isLoading ||
                  !forms.finalBeneficiaryForm.getValues('name_beneficiary') ||
                  !forms.finalBeneficiaryForm.getValues(
                    'lastname_beneficiary'
                  ) ||
                  !forms.finalBeneficiaryForm.getValues('country_id') ||
                  !forms.finalBeneficiaryForm.getValues('date_birth') ||
                  !forms.finalBeneficiaryForm.getValues('nationality_id') ||
                  !forms.finalBeneficiaryForm.getValues('document_type_id') ||
                  !forms.finalBeneficiaryForm.getValues('document_number') ||
                  !forms.finalBeneficiaryForm.getValues('contact_email') ||
                  !forms.finalBeneficiaryForm.getValues('contact_phone') ||
                  !forms.finalBeneficiaryForm.getValues('contact_address') ||
                  !forms.finalBeneficiaryForm.getValues(
                    'contact_district_id'
                  ) ||
                  !forms.finalBeneficiaryForm.getValues(
                    'contact_province_id'
                  ) ||
                  !forms.finalBeneficiaryForm.getValues('contact_country_id') ||
                  !forms.finalBeneficiaryForm.getValues(
                    'contact_postal_code'
                  ) ||
                  !!Object.values(forms.finalBeneficiaryForm.formState.errors)
                    .length ||
                  mutations.spouseCustomerMutation.isLoading ||
                  isLoading
            }
          />
        </div>
      </div>
    </div>
  );
};

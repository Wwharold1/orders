/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect, useLayoutEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Spinner } from '@/common/components';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { FormStepsEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import {
  IDepartmentResponse,
  IDistrictResponse,
  IHomeCustomerResponse,
  IProvinceResponse,
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

export const HomeCustomer: FC<IProps> = ({
  setOpenModalCancel,
  state,
  update,
}) => {
  const { forms, submitHandlers, mutations } = useNaturalClient();
  const queryClient = useQueryClient();
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );
  const { form_steps } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = useStateCallback(
    form_steps.find((e) => e.description === FormStepsEnum.RESIDENCIA)?.status
  );

  const { isFetching, data: dataHomeCustomer } =
    useQuery<IHomeCustomerResponse>(
      ['get-home-customer'],
      () => NaturalClientService().getHomeCustomer(),
      {
        // enabled:  isEnabled,
        onSuccess: (res) => {
          delete res.data.customer_id;
          delete res.data.id;
          delete res.data.district_text;
          delete res.data.city;

          for (const key of Object.keys(res.data)) {
            const index = key as keyof typeof forms.homeClientForm.getValues;
            forms.homeClientForm.setValue(index, res.data[index]);
          }
        },
      }
    );

  const { data: departmentData, isLoading: loadDepartment } =
    useQuery<IDepartmentResponse>(
      ['department-list'],
      () => ClientInfoService().getDepartments(),
      {
        enabled: isEnabled ? !!dataHomeCustomer : true,
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
  const {
    data: provinceData,
    isRefetching: refetchProvince,
    isLoading: loadProvince,
  } = useQuery<IProvinceResponse>(
    ['province-list'],
    () =>
      ClientInfoService().getProvinces(
        forms.homeClientForm.getValues('department_id').toString()
      ),
    {
      enabled: isEnabled
        ? !!dataHomeCustomer
        : !!forms.homeClientForm.getValues('department_id'),
      onSuccess: () => {
        if (!isEnabled) {
          forms.homeClientForm.setValue('district_id', 0);
          queryClient.setQueryData(['district-list'], []);
        }
      },
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
  const {
    data: districtData,
    isRefetching: refetchDistrict,
    isLoading: loadDistrict,
  } = useQuery<IDistrictResponse>(
    ['district-list'],
    () =>
      ClientInfoService().getDistricts(
        forms.homeClientForm.getValues('province_id').toString()
      ),
    {
      enabled: isEnabled
        ? !!dataHomeCustomer
        : !!forms.homeClientForm.getValues('province_id'),
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (isEnabled && !loadDepartment && !loadDistrict && !loadProvince) {
      setIsEnabled(false);
    }
  }, [loadDepartment, loadDistrict, loadProvince]);

  useFormPersist(NaturalClientFormEnum.HOME_CUSTOMER_FORM, {
    watch: forms.homeClientForm.watch,
    setValue: forms.homeClientForm.setValue,
    storage: window.localStorage,
  });

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
  }, []);

  const isLoading =
    loadDepartment || loadDistrict || loadProvince || isFetching;

  return (
    <div>
      <div className='bg-white py-10'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Residencia{' '}
        </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
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
                name='department_id'
                onChange={(department_id: number) => {
                  forms.homeClientForm.setValue('department_id', department_id);
                  forms.homeClientForm.setValue('province_id', 0);
                  forms.homeClientForm.setValue('district_id', 0);
                  queryClient.setQueryData(['province-list'], []);
                  queryClient.setQueryData(['district-list'], []);
                  queryClient.invalidateQueries(['province-list']);
                  queryClient.invalidateQueries(['district-list']);
                }}
                placeholder='Departamento'
                disabled={!departmentData?.data}
                form={forms.homeClientForm}
              />
            )}
          </div>
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
                name='province_id'
                onChange={(province_id: number) => {
                  forms.homeClientForm.setValue('province_id', province_id);
                  forms.homeClientForm.setValue('district_id', 0);
                  queryClient.setQueryData(['district-list'], []);
                  queryClient.invalidateQueries(['district-list']);
                }}
                disabled={!provinceData?.data}
                placeholder='Provincia'
                form={forms.homeClientForm}
              />
            )}
          </div>
        </div>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
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
                name='district_id'
                disabled={!districtData?.data}
                onChange={(district_id: number) => {
                  forms.homeClientForm.setValue('district_id', district_id);
                }}
                placeholder='Distrito'
                form={forms.homeClientForm}
              />
            )}
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.homeClientForm.register}
              error={forms.homeClientForm.formState.errors}
              name='address'
              placeholder='Dirección'
              noPadding
              isLoading={isLoading}
              type='text'
              form={forms.homeClientForm}
            />
          </div>
        </div>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.homeClientForm.register}
              error={forms.homeClientForm.formState.errors}
              name='dpto'
              placeholder='N.° de departamento (opcional)'
              noPadding
              isLoading={isLoading}
              type='text'
              form={forms.homeClientForm}
            />
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.homeClientForm.register}
              error={forms.homeClientForm.formState.errors}
              name='urb'
              placeholder='Urbanización (opcional)'
              noPadding
              isLoading={isLoading}
              type='text'
              form={forms.homeClientForm}
            />
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
            className='w-4/5 self-center md:w-auto'
            type='submit'
            handleClick={() => {
              if (update) {
                dispatch(setNaturalClientTab(3));
                state.setAnuallyUpdateData({
                  ...state.anuallyUpdateData,
                  home_customer: forms.homeClientForm.getValues(),
                });
                return;
              }

              submitHandlers.submitHomeCustomer(
                forms.homeClientForm.getValues()
              );
            }}
            loader={mutations.homeClientMutation.isLoading}
            disabled={
              mutations.homeClientMutation.isLoading ||
              (forms.homeClientForm.getValues('address')
                ? !(forms.homeClientForm.getValues('address').trim() !== '')
                : true) ||
              !forms.homeClientForm.getValues('department_id') ||
              !forms.homeClientForm.getValues('district_id') ||
              !forms.homeClientForm.getValues('province_id')
            }
            iconEnd='/icons/ArrowRight.svg'
            title='Siguiente'
          />
        </div>
      </div>
    </div>
  );
};

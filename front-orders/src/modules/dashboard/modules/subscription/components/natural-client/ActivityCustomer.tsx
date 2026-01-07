/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { FC, useLayoutEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Spinner } from '@/common/components';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import {
  FormStepsEnum,
  MonthlyIncomeData,
  MonthlyIncomeEnum,
} from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import {
  IActivityCustomerResponse,
  IEntryDateResponse,
  ITypeWorkerResponse,
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

export const ActivityCustomer: FC<IProps> = ({
  setOpenModalCancel,
  state,
  update,
}) => {
  const { forms, submitHandlers, mutations } = useNaturalClient();
  const { form_steps } = useAppSelector((state) => state.session);
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );
  const [selectedMonthly, setSelectedMonthly] =
    useStateCallback<MonthlyIncomeEnum | null>(
      (forms.activityClientForm.getValues(
        'monthly_income'
      ) as MonthlyIncomeEnum) || null
    );
  const { data: typeWorkerData, isLoading: isLoadingType } =
    useQuery<ITypeWorkerResponse>(['type-worker-list'], () =>
      ClientInfoService().getTypeWorker()
    );
  const { data: entryDateData, isLoading: isLoadingEntry } =
    useQuery<IEntryDateResponse>(['entry-date-list'], () =>
      ClientInfoService().getEntryDate()
    );

  const getEnabled =
    !!typeWorkerData &&
    !!entryDateData &&
    form_steps.find((e) => e.description === FormStepsEnum.ACTIVIDAD_CLIENTE)
      ?.status;
  const { isFetching } = useQuery<IActivityCustomerResponse>(
    ['get-activity-customer'],
    () => NaturalClientService().getActivityCustomer(),
    {
      enabled: getEnabled,
      onSuccess: (res) => {
        delete res.data.customer_id;
        delete res.data.id;

        for (const key of Object.keys(res.data)) {
          const index = key as keyof typeof forms.activityClientForm.getValues;
          forms.activityClientForm.setValue(index, res.data[index]);
        }
      },
    }
  );
  const dispatch = useAppDispatch();

  useFormPersist(NaturalClientFormEnum.ACTIVITY_CUSTOMER_FORM, {
    watch: forms.activityClientForm.watch,
    setValue: forms.activityClientForm.setValue,
    storage: window.localStorage,
    exclude: ['birthdate'],
  });

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
  }, []);

  useLayoutEffect(() => {
    setSelectedMonthly(
      forms.activityClientForm.watch('monthly_income') as MonthlyIncomeEnum
    );
  }, [forms.activityClientForm.watch('monthly_income')]);

  const isLoadingActivity =
    isLoadingType || isLoadingEntry || (getEnabled ? isFetching : false);

  return (
    <div>
      <div className='bg-white py-10'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Actividad del cliente{' '}
        </p>
        <p className='mt-8 font-bold text-primary-900'>Cuéntanos sobre ti </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingActivity ? (
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
                list={(typeWorkerData?.data as any) ?? []}
                name='type_worker_id'
                onChange={(type_worker_id: number) => {
                  forms.activityClientForm.setValue(
                    'type_worker_id',
                    type_worker_id
                  );
                }}
                placeholder='Tipo de trabajador'
                form={forms.activityClientForm}
              />
            )}
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.activityClientForm.register}
              error={forms.activityClientForm.formState.errors}
              name='occupation'
              placeholder='Ocupación'
              noPadding
              type='text'
              isLoading={isLoadingActivity}
              form={forms.activityClientForm}
            />
          </div>
        </div>
        <p className='mt-12 font-bold text-primary-900'>
          Sobre tu centro de labores
        </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.activityClientForm.register}
              error={forms.activityClientForm.formState.errors}
              name='business_name'
              placeholder='Razón social'
              noPadding
              type='text'
              isLoading={isLoadingActivity}
              form={forms.activityClientForm}
            />
          </div>
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              formRegister={forms.activityClientForm.register}
              error={forms.activityClientForm.formState.errors}
              name='position'
              placeholder='Puesto'
              noPadding
              type='text'
              isLoading={isLoadingActivity}
              form={forms.activityClientForm}
            />
          </div>
        </div>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div className='relative col-span-12 md:col-span-6'>
            {isLoadingActivity ? (
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
                list={(entryDateData?.data as any) ?? []}
                name='entry_date_id'
                onChange={(entry_date_id: number) => {
                  forms.activityClientForm.setValue(
                    'entry_date_id',
                    entry_date_id
                  );
                }}
                placeholder='Antigüedad'
                form={forms.activityClientForm}
              />
            )}
          </div>
        </div>
        <p className='mt-12 font-bold text-primary-900'>Ingreso mensual </p>
        <div className=' mt-5 grid grid-cols-1 gap-x-5 gap-y-5'>
          {MonthlyIncomeData.map((monthly, index) => {
            const isSelected = selectedMonthly === monthly.key;
            return (
              <div
                className={clsx('flex w-full items-start space-x-2 rounded-l')}
                key={index}
              >
                <div
                  onClick={() => {
                    setSelectedMonthly(monthly.key);
                    forms.activityClientForm.setValue(
                      'monthly_income',
                      monthly.key
                    );
                  }}
                  className={clsx(
                    'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                    isSelected ? 'border-[#0066CC]' : 'border-neutral-200'
                  )}
                >
                  {isSelected && (
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
                  )}
                </div>
                <div>
                  <span className='text-primary-900'>{monthly.title}</span>
                </div>
              </div>
            );
          })}
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
            iconEnd='/icons/ArrowRight.svg'
            handleClick={() => {
              if (update) {
                dispatch(setNaturalClientTab(2));
                state.setAnuallyUpdateData({
                  ...state.anuallyUpdateData,
                  activity_customer: forms.activityClientForm.getValues(),
                });
                return;
              }
              submitHandlers.submitActivityCustomer(
                forms.activityClientForm.getValues()
              );
            }}
            loader={mutations.activityClientMutation.isLoading}
            disabled={
              mutations.activityClientMutation.isLoading ||
              !!Object.values(forms.activityClientForm.formState.errors)
                .length ||
              Object.values(forms.activityClientForm.getValues()).length !==
                6 ||
              Object.values(forms.activityClientForm.getValues()).includes(
                ''
              ) ||
              Object.values(forms.activityClientForm.getValues()).includes(0) ||
              isLoadingActivity
            }
            title='Siguiente'
          />
        </div>
      </div>
    </div>
  );
};

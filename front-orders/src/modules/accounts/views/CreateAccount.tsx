/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import useFormPersist from 'react-hook-form-persist';

import { Button, Modal, Spinner } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import { ContextRoutesEnum, ContextSidebarEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import {
  IBankResponse,
  IMoneyTypeResponse,
  ITypeAccountResponse,
} from '@/common/interfaces';
import { IBankAccount } from '@/common/interfaces/bank.account.interface';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { BankAccountFormEnum } from '@/modules/accounts/enums/bank-account-menu.enum';
import { useAccounts } from '@/modules/accounts/hooks/useAccounts';
import { setSidebar } from '@/redux/common/layoutSlice';
import { ClientInfoService } from '@/services/ClientInfoService';

import { createAccountValidationSchema } from '../helpers/accountValidationSchemas';
import { MoneyTypeSpectrumEnum } from '../../dashboard/modules/subscription/enum/investment.enum';

export enum AccountModeEnum {
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
  CREATE_SECOND = 'CREATE_SECOND',
}

interface IProps {
  mode: AccountModeEnum;
}

export const CreateAccount: FC<IProps> = ({
  mode = AccountModeEnum.CREATE,
}) => {
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const [openModalInterrupt, setOpenModalInterrupt] =
    useStateCallback<boolean>(false);
  const dispatch = useAppDispatch();
  const funds = useAppSelector((state) => state.subscription.funds);
  const [selectedMain, setSelectedMain] = useStateCallback<boolean>(false);
  const { forms, mutations, submitHandlers, modals } = useAccounts();
  const [declarement, setDeclarement] = useStateCallback<boolean>(true);
  const router = useRouter();
  const [currency, setCurrency] =
    useStateCallback<MoneyTypeSpectrumEnum | null>(null);

  useEffect(() => {
    if (router.query.bankAccount) {
      const bankAccount = JSON.parse(
        router.query.bankAccount as string
      ) as IBankAccount;
      window.localStorage.removeItem(BankAccountFormEnum.UPDATE_BANK_ACCOUNT);
      Object.keys(bankAccount)
        .filter((e) =>
          Object.keys(createAccountValidationSchema.shape).includes(e)
        )
        .forEach((key) => {
          const index = key as keyof typeof forms.updateAccountForm.getValues;

          forms.updateAccountForm.setValue(index, bankAccount[index]);
        });

      forms.updateAccountForm.setValue('bank_id', bankAccount.bank.id);
      setSelectedMain(bankAccount.is_main);
      setDeclarement(true);
    }
  }, []);

  useEffect(() => {
    if (mode !== AccountModeEnum.UPDATE) {
      window.localStorage.removeItem(BankAccountFormEnum.UPDATE_BANK_ACCOUNT);
    }
  }, []);

  useFormPersist(BankAccountFormEnum.UPDATE_BANK_ACCOUNT, {
    watch: forms.updateAccountForm.watch,
    setValue: forms.updateAccountForm.setValue,
    storage: window.localStorage,
  });

  const { data: banksData, isLoading: isLoadingBanks } =
    useQuery<IBankResponse>(['bank-list'], () =>
      ClientInfoService().getBanks()
    );
  const { data: typeAccountData, isLoading: isLoadingTypeAccount } =
    useQuery<ITypeAccountResponse>(['type-account-list'], () =>
      ClientInfoService().getTypeAccount()
    );
  const { data: moneyTypeData, isLoading: isLoadingMoneyType } =
    useQuery<IMoneyTypeResponse>(['money-type-list'], () =>
      ClientInfoService().getMoneyType()
    );

  const isLoading =
    isLoadingBanks || isLoadingTypeAccount || isLoadingMoneyType;

  useEffect(() => {
    if (router.query.codFund && moneyTypeData?.data?.length) {
      const moneyType =
        MoneyTypeSpectrumEnum[
          funds.find((fund) => fund.codFund === router.query.codFund)!
            .spectrumFund.moneda as keyof typeof MoneyTypeSpectrumEnum
        ];
      setCurrency(moneyType);
      const moneyCode = moneyTypeData.data.find(
        (value) => value.code === moneyType
      )!;
      forms.createAccountForm.setValue('money_type', moneyCode.description);
    }
  }, [isLoading]);

  const form =
    mode === AccountModeEnum.CREATE
      ? forms.createAccountForm
      : forms.updateAccountForm;
  const mutation =
    mode === AccountModeEnum.CREATE
      ? mutations.createBankAccountMutation
      : mutations.updateBankAccountMutation;
  const submitHandler =
    mode === AccountModeEnum.CREATE
      ? submitHandlers.submitCreateAccount
      : submitHandlers.submitUpdateAccount;

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout routeBack={() => setOpenModalInterrupt(true)}>
        <div className='relative rounded-lg bg-white px-6'>
          <div className='bg-white py-9'>
            <p className='text-xl font-bold leading-none text-primary-900'>
              {mode === AccountModeEnum.CREATE
                ? 'Nueva cuenta'
                : 'Editar cuenta'}
            </p>
            <p className='mt-6 text-primary-900'>
              Agrega una cuenta bancaria para realizar el retiro, total o
              parcial, de tu inversión. Puedes agregar más cuentas y/o editarlas
              desde la sección "Cuentas" en el menú principal.
            </p>
            <p className='mt-6 text-primary-900'>
              Si la cuenta ingresada no corresponde a la misma moneda en la que
              se invierte tu fondo, PrudentialSAF Sociedad Administradora de
              Fondos S.A.C no es responsable por el tipo de cambio que se
              aplicará.
            </p>
            <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
              <div className='relative col-span-12 md:col-span-6'>
                {isLoading ? (
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
                    list={(banksData?.data as never) ?? []}
                    name='bank_id'
                    onChange={(bank_id: number) => {
                      form.setValue('bank_id', bank_id);
                    }}
                    placeholder='Entidad financiera'
                    form={form}
                  />
                )}
              </div>
              <div className='relative col-span-12 md:col-span-6'>
                {isLoading ? (
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
                    list={(typeAccountData?.data as never) ?? []}
                    name='account_type_id'
                    onChange={(account_type_id: number) => {
                      form.setValue('account_type_id', account_type_id);
                    }}
                    placeholder='Tipo de cuenta'
                    form={form}
                  />
                )}
              </div>
            </div>
            <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
              <div className='relative col-span-12 md:col-span-6'>
                {isLoading ? (
                  <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                    <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                    <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                      <Spinner />
                    </div>
                  </div>
                ) : (
                  <Select
                    keyDisplay='description'
                    keySearchCondition='description'
                    keySearchValue='description'
                    keyValue='description'
                    list={(moneyTypeData?.data as never) ?? []}
                    name='money_type'
                    onChange={(money_type: string) => {
                      form.setValue('money_type', money_type);
                    }}
                    placeholder='Moneda'
                    disabled={!!currency}
                    form={form}
                  />
                )}
              </div>
              <div className='relative col-span-12 md:col-span-6'>
                <Input
                  formRegister={form.register}
                  error={form.formState.errors}
                  name='account_number'
                  placeholder='N.° de cuenta'
                  noPadding
                  type='number'
                  max={20}
                  form={form}
                />
              </div>
            </div>
            <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
              <div className='relative col-span-12 md:col-span-6'>
                <Input
                  formRegister={form.register}
                  error={form.formState.errors}
                  name='cci'
                  placeholder='CCI'
                  noPadding
                  type='number'
                  max={20}
                  form={form}
                />
              </div>
            </div>
            {(mode === AccountModeEnum.UPDATE || router.query.hasAccount) && (
              <>
                <div className='mt-8'>
                  <p className='text-primary-900'>
                    ¿Deseas guardar esta cuenta como la principal para el
                    proceso de rescate?
                  </p>
                </div>
                <div className='mt-4 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                  <div
                    className={clsx(
                      'col-span-3 flex w-full items-start space-x-2 rounded-l md:col-span-1'
                    )}
                  >
                    <div
                      onClick={() => {
                        form.setValue('is_main', true);
                        setSelectedMain(true);
                      }}
                      className={clsx(
                        'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                        selectedMain ? 'border-[#0066CC]' : 'border-neutral-200'
                      )}
                    >
                      {selectedMain && (
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
                        form.setValue('is_main', false);
                        setSelectedMain(false);
                      }}
                      className={clsx(
                        'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                        !selectedMain
                          ? 'border-[#0066CC]'
                          : 'border-neutral-200'
                      )}
                    >
                      {!selectedMain && (
                        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
                      )}
                    </div>
                    <div>
                      <span className='text-primary-900'>No</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className='mt-12 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
              <div className='flex space-x-3'>
                <input
                  type='checkbox'
                  onChange={() => {
                    setDeclarement(!declarement);
                  }}
                  checked={declarement}
                  className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
                />
                <span className='text-primary-900'>
                  Declaro que soy el titular de la cuenta.
                </span>
              </div>
            </div>
          </div>
          <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
            <Button
              title='Cancelar'
              alternative
              noBorder
              handleClick={() => setOpenModalCancel(true)}
              className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
            />
            <Button
              className='w-4/5 self-center md:w-auto'
              type='submit'
              loader={mutation.isLoading}
              handleClick={() => {
                !router.query.hasAccount && form.setValue('is_main', true);
                submitHandler(form.getValues());
              }}
              disabled={
                mutation.isLoading ||
                !declarement ||
                isLoading ||
                Object.values(form.getValues())
                  .map((e) => e.toString().trim())
                  .includes('') ||
                Object.values(form.getValues()).length < 6 ||
                (form.getValues('cci') &&
                  !!(form.getValues('cci').length < 8)) ||
                (form.getValues('cci') &&
                  !!(form.getValues('account_number').length < 8)) ||
                Object.values(form.getValues()).includes(0)
              }
              title={
                mode === AccountModeEnum.CREATE
                  ? 'Guardar cuenta'
                  : 'Actualizar datos'
              }
            />
          </div>
        </div>
        <Modal
          isOpen={openModalCancel}
          title='¿Deseas cancelar la creación de una cuenta de rescate?'
          setIsOpen={setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() => router.back()}
          extended
          modalLength={550}
          secondaryConfirmationText='Volver'
        >
          <p className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </p>
        </Modal>
        <Modal
          isOpen={openModalInterrupt}
          title='¿Deseas salir sin agregar una cuenta de rescate?'
          setIsOpen={setOpenModalInterrupt}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() => {
            router.push(ContextRoutesEnum.DASHBOARD);
            dispatch(setSidebar(ContextSidebarEnum.ACCOUNTS));
          }}
          extended
          modalLength={550}
          secondaryConfirmationText='Volver'
        >
          <p className='text-neutral-600'>
            Si cierras el proceso ahora, tu información no se guardará.{' '}
          </p>
        </Modal>
        <Modal
          isOpen={modals.openExistBank}
          title='Cuenta no agregada'
          setIsOpen={modals.setOpenExistBank}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() => {
            modals.setOpenExistBank(false);
          }}
          extended
          modalLength={450}
        >
          <p className='text-neutral-600'>
            Ya existe una cuenta registrada con estos datos.{' '}
          </p>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

import { IconMore } from '@/common/components/icons/accounts/IconMore';
import { IconStar } from '@/common/components/icons/dashboard';
import { IconCheckCircle } from '@/common/components/icons/subscription/IconCheckCircle';
import { ContextRoutesEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import { IBankAccount } from '@/common/interfaces/bank.account.interface';
import { IRescueBankAccount } from '@/common/interfaces/rescue.interface';
import {
  BankAccountMenuEnum,
  BankAccountMenuOptions,
} from '@/modules/accounts/enums/bank-account-menu.enum';
import { setBankAccount } from '@/modules/rescue/slice/rescueSlice';

interface IProps {
  bankAccount?: IBankAccount | IRescueBankAccount;
  loading?: boolean;
  modals?: {
    setOpenDeleteBank: (
      state: boolean,
      cb?: ((state: boolean) => void) | undefined
    ) => void;
    setOpenSetMainBank: (
      state: boolean,
      cb?: ((state: boolean) => void) | undefined
    ) => void;
  };
  state?: {
    setSelectedAccount: (
      state: IBankAccount | null,
      cb?: ((state: IBankAccount | null) => void) | undefined
    ) => void;
    selectedAccount: IBankAccount | null;
  };
  rescue?: boolean;
}

export const BankAccountCard: FC<IProps> = ({
  bankAccount,
  loading,
  modals,
  state,
  rescue,
}) => {
  const dispatch = useAppDispatch();
  const [showBankNumber, setShowBankNumber] = useStateCallback<boolean>(false);
  const router = useRouter();
  const { currentRescue } = useAppSelector((state) => state.rescue);

  useEffect(() => {
    if (rescue) {
      setShowBankNumber(false);
    }
  }, []);

  const isSelected = bankAccount
    ? currentRescue?.bank_account_id === bankAccount.id
    : null;

  return (
    <>
      {(loading && !bankAccount) || loading ? (
        <div
          className={clsx(
            'col-span-12 mb-12 mr-2 animate-pulse rounded-lg border border-neutral-100 p-2 pb-6 md:mb-0 md:mr-0 lg:col-span-6'
          )}
        >
          <div className='bg-neutral-50/80 p-4'>
            <div className='h-6 w-3/12 rounded-lg bg-neutral-200 md:w-3/12'></div>

            <div className='mt-6 h-4 w-6/12 rounded-full bg-neutral-200 md:w-6/12'></div>
          </div>
          <div className='mx-4 mt-6 flex flex-col space-y-4'>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
            </div>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-2/12 rounded-full bg-neutral-200 md:w-2/12'></div>
            </div>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-5/12 rounded-full bg-neutral-200 md:w-5/12'></div>
            </div>
            <div>
              <div className='mt-3 h-3 w-3/12 rounded-full bg-neutral-200 md:w-3/12'></div>
              <div className='mt-1 h-3 w-8/12 rounded-full bg-neutral-200 md:w-8/12'></div>
            </div>
          </div>
        </div>
      ) : (
        !loading &&
        bankAccount && (
          <div
            className={clsx(
              'relative col-span-12 mr-0 rounded-lg border-[1.5px] bg-white p-2 pb-6 shadow-md md:mb-0 md:mr-0',
              isSelected && rescue
                ? 'border-primary-400'
                : 'border-neutral-100',
              rescue
                ? '!mr-4 mb-12 cursor-pointer md:!mr-0 lg:col-span-6'
                : 'lg:col-span-4'
            )}
            onClick={() => dispatch(setBankAccount(bankAccount.id))}
          >
            {isSelected && rescue && (
              <IconCheckCircle className='absolute -right-5 -top-5 z-30' />
            )}

            <div className='flex items-center justify-between bg-neutral-50/80 p-4 py-6'>
              <p className='text-lg font-bold leading-none text-primary-500'>
                {'bank_name' in bankAccount
                  ? bankAccount.bank_name
                  : bankAccount.bank.description}
              </p>
              {state && modals && !('bank_name' in bankAccount) && (
                <Menu as='div' className='relative z-10 inline-block text-left'>
                  <Menu.Button className='grid place-content-center rounded-full border border-primary-100 p-3 px-4 transition duration-150 ease-in-out hover:bg-neutral-100/50'>
                    <IconMore className='scale-110' />
                  </Menu.Button>
                  <Transition
                    enter='transition duration-100 ease-out'
                    enterFrom='transform scale-95 opacity-0'
                    enterTo='transform scale-100 opacity-100'
                    leave='transition duration-75 ease-out'
                    leaveFrom='transform scale-100 opacity-100'
                    leaveTo='transform scale-95 opacity-0'
                    className='z-10 h-full w-full'
                  >
                    <Menu.Items className='absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-neutral-50 focus:outline-none'>
                      {BankAccountMenuOptions.filter((option) =>
                        showBankNumber
                          ? option.type !== BankAccountMenuEnum.SHOW_BANK_DATA
                          : option.type !== BankAccountMenuEnum.HIDE_BANK_DATA
                      )
                        .filter((option) =>
                          bankAccount.is_main
                            ? option.type !==
                              BankAccountMenuEnum.SET_MAIN_ACCOUNT
                            : true
                        )
                        .map((option, index) => (
                          <Menu.Item key={index}>
                            {({ active }) => (
                              <div
                                className={clsx(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'flex cursor-pointer items-center justify-start space-x-2 px-3 py-4 text-left text-sm leading-none duration-150 ease-in'
                                )}
                                onClick={() => {
                                  state.setSelectedAccount(bankAccount);

                                  switch (option.type) {
                                    case BankAccountMenuEnum.HIDE_BANK_DATA:
                                      setShowBankNumber(false);
                                      break;
                                    case BankAccountMenuEnum.SHOW_BANK_DATA:
                                      setShowBankNumber(true);
                                      break;
                                    case BankAccountMenuEnum.EDIT_BANK_ACCOUNT:
                                      router.push(
                                        {
                                          pathname:
                                            ContextRoutesEnum.EDIT_ACCOUNT,
                                          query: {
                                            bankAccount:
                                              JSON.stringify(bankAccount),
                                          },
                                        },
                                        ContextRoutesEnum.EDIT_ACCOUNT
                                      );
                                      break;
                                    case BankAccountMenuEnum.DELETE_BANK_ACCOUNT:
                                      modals.setOpenDeleteBank(true);
                                      break;
                                    case BankAccountMenuEnum.SET_MAIN_ACCOUNT:
                                      modals.setOpenSetMainBank(true);
                                      break;
                                  }
                                }}
                              >
                                <option.icon
                                  fill='#67747B'
                                  className='mb-0.5'
                                />

                                <a className='text-neutral-500'>
                                  {option.title}
                                </a>
                              </div>
                            )}
                          </Menu.Item>
                        ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>

            <div className='mx-4 mt-4 flex items-center justify-end space-x-1 opacity-90'>
              {bankAccount.is_main && !rescue && (
                <>
                  <IconStar fill='#60B9E8' className='mb-0.5' />
                  <p className='text-sm font-bold leading-none text-primary-300'>
                    Principal
                  </p>
                </>
              )}
            </div>
            <div className='mx-4 mt-4 flex flex-col space-y-4'>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>
                  N.° DE CUENTA
                </h1>
                <p className='mt-1 text-lg font-bold text-primary-900'>
                  {!showBankNumber
                    ? '•••• ' +
                      bankAccount.account_number?.slice(
                        bankAccount.account_number?.length - 4,
                        bankAccount.account_number?.length
                      )
                    : bankAccount.account_number}
                </p>
              </div>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>
                  N.° DE CCI
                </h1>
                <p className='mt-1 text-lg font-bold text-primary-900'>
                  {!showBankNumber
                    ? '•••• ' +
                      bankAccount.cci?.slice(
                        bankAccount.cci?.length - 4,
                        bankAccount.cci?.length
                      )
                    : bankAccount.cci}
                </p>
              </div>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>
                  TIPO DE CUENTA
                </h1>
                <p className='mt-1 text-lg font-bold text-primary-900'>
                  {'bank_name' in bankAccount
                    ? bankAccount.account_type
                    : bankAccount.account_type.description}
                </p>
              </div>
              <div>
                <h1 className='text-sm font-bold text-neutral-300'>MONEDA</h1>
                <p className='mt-1 text-lg font-bold text-primary-900'>
                  {bankAccount.money_type}
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

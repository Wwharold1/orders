/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { Card, Modal } from '@/common/components';
import { IconBankCard } from '@/common/components/icons/accounts/IconBankCard';
import { IconCardDeclined } from '@/common/components/icons/accounts/IconCardDeclined';
import { IconMonetization } from '@/common/components/icons/accounts/IconMonetization';
import { MediaQueryEnum } from '@/common/enums';
import { useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { IBankAccountResponse } from '@/common/interfaces/bank.account.interface';
import { BankAccountCards } from '@/modules/accounts/components/BankAccountCards';
import { useAccounts } from '@/modules/accounts/hooks/useAccounts';
import { BankAccountService } from '@/services/BankAccountService';

export const BankAccounts = () => {
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const { mutations, state } = useAccounts();

  const [openNoSubscriptionModal, setOpenNoSubscriptionModal] =
    useStateCallback<boolean>(false);
  const [openLimitBanks, setOpenLimitBanks] = useStateCallback<boolean>(false);
  const [openDeleteBank, setOpenDeleteBank] = useStateCallback<boolean>(false);
  const [openSetMainBank, setOpenSetMainBank] =
    useStateCallback<boolean>(false);
  /*   const hasSubscription = useAppSelector(
    (state) => state.subscription.hasSubscription
  ); */

  const {
    data: bankAccountData,
    isLoading: isLoadingBankAccount,
    isRefetching: isRefetchingBankAccount,
  } = useQuery<IBankAccountResponse>(['bank-account-list'], () =>
    BankAccountService().getBankAccounts()
  );

  const modals = { setOpenDeleteBank, setOpenSetMainBank };

  return (
    <>
      {isLoadingBankAccount ||
      isRefetchingBankAccount ||
      mutations.deleteBankAccountMutation.isLoading ||
      mutations.setMainBankAccountMutation.isLoading ? (
        <div className='col-span-12 min-h-fit rounded-xl bg-white'>
          <div className='animate-pulse rounded-[4px] bg-gradient-to-br p-3 text-white'>
            <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
            <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
              <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
              <div className='mt-1 h-4 w-5/12 rounded-full bg-neutral-200'></div>
            </h6>
            <div className='mt-5 py-3 pt-2'>
              <div className='mt-1 flex justify-between'>
                <div className='h-8 w-3/12 rounded-full bg-neutral-200'></div>
              </div>
            </div>
          </div>{' '}
        </div>
      ) : bankAccountData?.data?.length ? (
        <div className='mb-12'>
          {/* <div className='mb-6 flex items-center justify-end'>
            <Button
              title='Agregar cuenta'
              alternative
              noBorder
              iconStart='/icons/addBank.svg'
              className='!bg-opacity-35 !px-5'
              disabled
              handleClick={() => {
                bankAccountData?.data?.length >= 5
                  ? setOpenLimitBanks(true)
                  : router.push(
                      {
                        pathname: ContextRoutesEnum.ADD_ACCOUNT,
                        query: { hasAccount: true },
                      },
                      ContextRoutesEnum.ADD_ACCOUNT
                    );
              }}
            />
          </div> */}
          <BankAccountCards
            banks={bankAccountData?.data}
            modals={modals}
            loading={
              isLoadingBankAccount ||
              isRefetchingBankAccount ||
              mutations.deleteBankAccountMutation.isLoading
            }
            state={state}
          />
        </div>
      ) : (
        <Card
          title='No tienes cuentas registradas'
          content='Agrega una cuenta bancaria para  realizar el rescate de tus fondos. Recuerda que debes ser el titular de la cuenta.'
          // buttonTitle='Agregar cuenta bancaria'
          // buttonHandleClick={() => {
          //   if (!hasSubscription) {
          //     setOpenNoSubscriptionModal(true);
          //   } else {
          //     router.push(ContextRoutesEnum.ADD_ACCOUNT);
          //   }
          // }}
          size={1}
        />
      )}

      <Modal
        isOpen={openNoSubscriptionModal}
        setIsOpen={setOpenNoSubscriptionModal}
        title='Realiza tu primera inversión para crear una cuenta'
        subtitle='Una vez que hayas realizado tu primera inversión podrás crear tu primera cuenta.'
        confirmationText='Aceptar'
        customIcon={<IconMonetization />}
        extended
        modalLength={450}
      />
      <Modal
        isOpen={openLimitBanks}
        setIsOpen={setOpenLimitBanks}
        title='Has alcanzado el límite de cinco (5) cuentas'
        subtitle='Si deseas agregar una cuenta nueva, deberás eliminar alguna anterior.'
        confirmationText='Aceptar'
        customIcon={<IconBankCard />}
        extended
        modalLength={450}
      />
      <Modal
        isOpen={openDeleteBank}
        title='Eliminar cuenta bancaria'
        setIsOpen={setOpenDeleteBank}
        customIcon={<IconCardDeclined className='mb-1' />}
        confirmationText='Eliminar'
        confirmationCustomFunction={() => {
          mutations.deleteBankAccountMutation.mutate(state.selectedAccount!.id);
        }}
        extended={isMdDown}
        modalLength={400}
        secondaryConfirmationText='Cancelar'
      >
        <p className='text-neutral-600'>
          ¿Deseas eliminar esta cuenta bancaria?
        </p>
      </Modal>

      <Modal
        isOpen={openSetMainBank}
        title='Elegir como principal'
        setIsOpen={setOpenSetMainBank}
        customIcon={<IconCardDeclined className='mb-1' />}
        confirmationText='Aceptar'
        confirmationCustomFunction={() => {
          mutations.setMainBankAccountMutation.mutate();
        }}
        extended={isMdDown}
        modalLength={400}
        secondaryConfirmationText='Cancelar'
      >
        <p className='text-neutral-600'>
          ¿Deseas guardar esta cuenta como la principal para el proceso de
          rescate?
        </p>
      </Modal>
    </>
  );
};

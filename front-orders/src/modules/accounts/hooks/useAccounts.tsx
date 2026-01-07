/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

import { notifyInfo } from '@/common/components';
import {
  ContextRoutesEnum,
  ContextSplashEnum,
  CreateAccountErrorsDictionary,
} from '@/common/enums';
import {
  useAppDispatch,
  useStateCallback,
  useStatePersist,
} from '@/common/hooks';
import { IBankAccount } from '@/common/interfaces/bank.account.interface';
import { BankAccountFormEnum } from '@/modules/accounts/enums/bank-account-menu.enum';
import {
  createAccountValidationSchema,
  TCreateAccountForm,
  TUpdateAccountForm,
} from '@/modules/accounts/helpers/accountValidationSchemas';
import { setSplash } from '@/redux/common/layoutSlice';
import { BankAccountService } from '@/services/BankAccountService';

export const useAccounts = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const [openExistBank, setOpenExistBank] = useStateCallback<boolean>(false);
  const [selectedAccount, setSelectedAccount] =
    useStatePersist<IBankAccount | null>(null, 'selected-account');
  const router = useRouter();

  const createAccountForm = useForm<TCreateAccountForm>({
    resolver: zodResolver(createAccountValidationSchema),
    mode: 'onChange',
    defaultValues: {
      is_main: false,
    },
  });
  const updateAccountForm = useForm<TUpdateAccountForm>({
    resolver: zodResolver(createAccountValidationSchema),
    mode: 'onChange',
  });

  const createBankAccountMutation = useMutation(
    () =>
      dispatch(
        BankAccountService().createBankAccount(createAccountForm.getValues())
      ),
    {
      onSuccess: ({ payload }) => {
        if (
          payload.message ===
            CreateAccountErrorsDictionary.ACCOUNT_NUMBER_EXISTS ||
          payload.message === CreateAccountErrorsDictionary.CCI_EXISTS
        ) {
          setOpenExistBank(true);
          return;
        }
        dispatch(
          setSplash({
            type: ContextSplashEnum.BANK_ACCOUNT_CREATED,
            show: true,
          })
        );
        setTimeout(() => {
          router.query.redirect
            ? router.push(ContextRoutesEnum.ADD_RESCUE)
            : router.push(ContextRoutesEnum.DASHBOARD);
        }, 4800);
      },
    }
  );
  const deleteBankAccountMutation = useMutation(
    (selectedBankId: number) =>
      dispatch(BankAccountService().deleteBankAccount(selectedBankId)),
    {
      onSuccess: () => {
        notifyInfo({
          title: 'Cuenta bancaria eliminada',
          subtitle: 'La cuenta bancaria fue eliminada.',
        });
        queryClient.invalidateQueries(['bank-account-list']);
      },
    }
  );
  const updateBankAccountMutation = useMutation(
    () =>
      BankAccountService().updateBankAccount(
        selectedAccount!.id,
        updateAccountForm.getValues()
      ),
    {
      onSuccess: () => {
        notifyInfo({
          title: 'Cuenta bancaria guardada',
          subtitle: 'La cuenta bancaria fue guardada correctamente.',
        });
        window.localStorage.removeItem(BankAccountFormEnum.UPDATE_BANK_ACCOUNT);
        router.back();
        queryClient.invalidateQueries(['bank-account-list']);
      },
    }
  );
  const setMainBankAccountMutation = useMutation(
    () =>
      BankAccountService().updateBankAccount(selectedAccount!.id, {
        bank_id: selectedAccount?.bank.id,
        account_type_id: selectedAccount?.account_type_id,
        money_type: selectedAccount?.money_type,
        is_main: true,
      } as TUpdateAccountForm),
    {
      onSuccess: () => {
        notifyInfo({
          title: 'Información actualizada',
          subtitle:
            'Los datos de la cuenta bancaria fueron actualizados correctamente.',
        });
        queryClient.invalidateQueries(['bank-account-list']);
      },
    }
  );

  const submitCreateAccount: SubmitHandler<TCreateAccountForm> = () => {
    createBankAccountMutation.mutate();
  };
  const submitUpdateAccount: SubmitHandler<TUpdateAccountForm> = () => {
    updateBankAccountMutation.mutate();
  };

  return {
    forms: {
      createAccountForm,
      updateAccountForm,
    },
    mutations: {
      createBankAccountMutation,
      deleteBankAccountMutation,
      setMainBankAccountMutation,
      updateBankAccountMutation,
    },
    submitHandlers: {
      submitCreateAccount,
      submitUpdateAccount,
    },
    state: {
      setSelectedAccount,
      selectedAccount,
    },
    modals: {
      openExistBank,
      setOpenExistBank,
    },
  };
};

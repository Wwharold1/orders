import React, { FC } from 'react';

import { IBankAccount } from '@/common/interfaces/bank.account.interface';
import { IRescueBankAccount } from '@/common/interfaces/rescue.interface';
import { BankAccountCard } from '@/modules/accounts/components/BankAccountCard';

interface IProps {
  banks: IBankAccount[] | IRescueBankAccount[] | undefined;
  loading: boolean;
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

export const BankAccountCards: FC<IProps> = ({
  banks,
  loading,
  modals,
  state,
  rescue,
}) => {
  return (
    <>
      {!loading && banks && (
        <div className='grid grid-cols-12 gap-6'>
          {banks.map((bank, index) => {
            return (
              <BankAccountCard
                bankAccount={bank}
                key={index}
                modals={modals}
                state={state}
                rescue={rescue}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

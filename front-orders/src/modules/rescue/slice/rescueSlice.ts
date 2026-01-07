import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IFund } from '@/common/interfaces';
import { TCreateRescueForm } from '@/modules/rescue/helpers/rescueValidationSchemas';

import { IRescueDetailData } from '../../../common/interfaces/rescue.interface';

interface RescueState {
  hasBankAccount: boolean;
  currentFund: IFund | null;
  rescueDetail: IRescueDetailData | null;
  currentRescue: Partial<TCreateRescueForm> | null;
  moneyTypes: string[];
  currentMoneyType: string | null;
}

const initialState: RescueState = {
  hasBankAccount: false,
  rescueDetail: null,
  currentRescue: null,
  currentFund: null,
  moneyTypes: [],
  currentMoneyType: null,
};

export const rescueSlice = createSlice({
  name: 'rescue',
  initialState,
  reducers: {
    setHasBankAccount: (state, action: PayloadAction<boolean>) => {
      state.hasBankAccount = action.payload;
    },
    setRescueDetail: (
      state,
      action: PayloadAction<IRescueDetailData | null>
    ) => {
      state.rescueDetail = action.payload;
    },
    setCurrentRescue: (
      state,
      action: PayloadAction<Partial<TCreateRescueForm | null>>
    ) => {
      state.currentRescue = action.payload;
    },
    setBankAccount: (state, action: PayloadAction<number>) => {
      const bankAccount = state.rescueDetail?.bank_accounts.find(
        (bankAccount) => bankAccount.id === action.payload
      );

      if (bankAccount) {
        state.currentRescue = {
          ...state.currentRescue,
          bank_account_id: bankAccount.id,
        };
      }
    },
    setCurrentRescueFund: (state, action: PayloadAction<IFund>) => {
      state.currentFund = action.payload;
    },
    setMoneyTypes: (state, action: PayloadAction<string[]>) => {
      state.moneyTypes = action.payload;
    },
    setCurrentMoneyType: (state, action: PayloadAction<string | null>) => {
      state.currentMoneyType = action.payload;
    },
  },
});

export const {
  setHasBankAccount,
  setRescueDetail,
  setCurrentRescue,
  setBankAccount,
  setCurrentRescueFund,
  setMoneyTypes,
  setCurrentMoneyType,
} = rescueSlice.actions;
export default rescueSlice.reducer;

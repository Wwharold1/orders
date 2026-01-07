import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ContextTabs, ITabs } from '@/common/enums';
import { IFund, IListFundsByCustomer } from '@/common/interfaces';
import {
  IAmountMinInversion,
  ICollectorAccount,
  IFundOrigin,
  ISubscription,
  ISuscriptionPending,
} from '@/common/interfaces/subscription.interface';

interface GlobalConfigState {
  funds: IFund[];
  currentFund: IFund | null;
  pendingSubscription: ISuscriptionPending | null;
  recommendedFunds: IFund[];
  currentSubscription: ISubscription | null;
  currentCollector: ICollectorAccount | null;
  hasSubscription: boolean | null;
  subscriptions: IListFundsByCustomer | null;
  contextTabs: ITabs[];
  disabledButton: boolean;
  files: object;
  isLoadigSerie: boolean;
  hasToChangeInvestmentTab: boolean;
  fundsOriginList: IFundOrigin[] | null;
  id?: number;
  amountMinInversion: IAmountMinInversion | null;
  amountMinInversionB: IAmountMinInversion | null;
}

const initialState: GlobalConfigState = {
  currentFund: null,
  funds: [],
  pendingSubscription: null,
  recommendedFunds: [],
  currentSubscription: null,
  contextTabs: ContextTabs,
  currentCollector: null,
  hasSubscription: false,
  subscriptions: null,
  disabledButton: false,
  files: {},
  isLoadigSerie: false,
  hasToChangeInvestmentTab: false,
  fundsOriginList: null,
  amountMinInversion: null,
  amountMinInversionB: null,
};

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setCurrentFund: (state, action: PayloadAction<IFund>) => {
      state.currentFund = action.payload;
    },
    setCurrentSubscription: (
      state,
      action: PayloadAction<ISubscription | null>
    ) => {
      state.currentSubscription = action.payload;
    },
    setCurrentCollector: (
      state,
      action: PayloadAction<ICollectorAccount | null>
    ) => {
      state.currentCollector = action.payload;
    },
    setFunds: (state, action: PayloadAction<IFund[]>) => {
      const images = [
        {
          card: 'card-primario.jpg',
          header: 'header-primario.jpg',
        },
        {
          card: 'card-turquesa.jpg',
          header: 'header-turquesa.jpg',
        },
        {
          card: 'card-secundario.jpg',
          header: 'header-secundario.jpg',
        },
        {
          card: 'card-gris-y-azul.jpg',
          header: 'header-gris-y-azul.jpg',
        },
        {
          card: 'card-azul.jpg',
          header: 'header-azul.jpg',
        },
      ];

      let i = -1;
      state.funds = action.payload?.map((fund) => {
        i === images.length - 1 ? (i = 0) : i++;
        return {
          ...fund,
          imageCard: `/images/funds/${images[i].card}`,
          imageHeader: `/images/funds/${images[i].header}`,
        };
      });
    },
    setRecommendedFunds: (state, action: PayloadAction<IFund[]>) => {
      state.recommendedFunds = action.payload;
    },
    hasSubscription: (state, action: PayloadAction<boolean>) => {
      state.hasSubscription = action.payload;
    },
    setSubscriptions: (state, action: PayloadAction<IListFundsByCustomer>) => {
      state.subscriptions = action.payload;
    },
    setFile: (state, action: PayloadAction<object>) => {
      state.files = action.payload;
    },
    setContextTabs: (state, action: PayloadAction<ITabs[]>) => {
      state.contextTabs = action.payload;
    },
    toggleDisabledButton: (state, action: PayloadAction<boolean>) => {
      state.disabledButton = action.payload;
    },
    setPendingSubscription: (
      state,
      action: PayloadAction<ISuscriptionPending | null>
    ) => {
      state.pendingSubscription = action.payload;
    },
    setLoadingSerie: (state, action: PayloadAction<boolean>) => {
      state.isLoadigSerie = action.payload;
    },
    setHasToChangeInvestmentTab: (state, action: PayloadAction<boolean>) => {
      state.hasToChangeInvestmentTab = action.payload;
    },
    setFundsOriginList: (state, action: PayloadAction<IFundOrigin[]>) => {
      state.fundsOriginList = action.payload;
    },
    setAmountMinInversion: (
      state,
      action: PayloadAction<IAmountMinInversion | null>
    ) => {
      state.amountMinInversion = action.payload;
    },
    setAmountMinInversionB: (
      state,
      action: PayloadAction<IAmountMinInversion | null>
    ) => {
      state.amountMinInversionB = action.payload;
    },
  },
});

export const {
  setCurrentFund,
  setRecommendedFunds,
  setCurrentSubscription,
  setCurrentCollector,
  setPendingSubscription,
  setHasToChangeInvestmentTab,
  hasSubscription,
  setFunds,
  setFile,
  setSubscriptions,
  setContextTabs,
  toggleDisabledButton,
  setLoadingSerie,
  setFundsOriginList,
  setAmountMinInversionB,
  setAmountMinInversion,
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

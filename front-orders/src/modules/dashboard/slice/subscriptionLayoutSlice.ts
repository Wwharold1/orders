import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InvestmentTabs, ITabs } from '@/common/enums';
import { TabInvestmentSubscriptionEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';

interface SubscriptionLayoutState {
  naturalClientTab: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  investmentTab: TabInvestmentSubscriptionEnum;
  investmentTabs: ITabs[];
  isOpenToc: boolean;
}

const initialState: SubscriptionLayoutState = {
  naturalClientTab: 0,
  investmentTab: 0,
  investmentTabs: InvestmentTabs,
  isOpenToc: false,
};

export const subscriptionLayoutSlice = createSlice({
  name: 'subscription_layout',
  initialState,
  reducers: {
    setNaturalClientTab: (
      state,
      action: PayloadAction<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>
    ) => {
      state.naturalClientTab = action.payload;
    },
    setInvestmentTab: (
      state,
      action: PayloadAction<TabInvestmentSubscriptionEnum>
    ) => {
      state.investmentTab = action.payload;
    },
    toggleIsOpenToc: (state) => {
      state.isOpenToc = !state.isOpenToc;
    },
  },
});

export const { setNaturalClientTab, setInvestmentTab, toggleIsOpenToc } =
  subscriptionLayoutSlice.actions;
export default subscriptionLayoutSlice.reducer;

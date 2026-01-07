import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ChangeRiskTabs, ITabs } from '@/common/enums';
import { IProfileResponse, IProfilesRisk } from '@/common/interfaces';

interface GlobalConfigState {
  customer_risk: IProfileResponse | IProfilesRisk | null;
  changeRiskTab: 0 | 1;
  changeRiskTabs: ITabs[];
  selectedCustomerRisk: IProfilesRisk | null;
  isFromOpenYourAccount: boolean;
}

const initialState: GlobalConfigState = {
  customer_risk: null,
  changeRiskTab: 0,
  changeRiskTabs: ChangeRiskTabs,
  selectedCustomerRisk: null,
  isFromOpenYourAccount: false,
};

export const riskProfileSlice = createSlice({
  name: 'risk_profile',
  initialState,
  reducers: {
    setCustomerRisk: (state, action: PayloadAction<IProfileResponse>) => {
      state.customer_risk = action.payload;
    },
    setSelectedCustomerRisk: (state, action: PayloadAction<IProfilesRisk>) => {
      state.selectedCustomerRisk = action.payload;
    },
    setChangeRiskTab: (state, action: PayloadAction<0 | 1>) => {
      state.changeRiskTab = action.payload;
    },
    setIsFromOpenYourAccount: (state, action: PayloadAction<boolean>) => {
      state.isFromOpenYourAccount = action.payload;
    },
  },
});

export const {
  setCustomerRisk,
  setSelectedCustomerRisk,
  setChangeRiskTab,
  setIsFromOpenYourAccount,
} = riskProfileSlice.actions;
export default riskProfileSlice.reducer;

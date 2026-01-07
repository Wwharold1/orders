/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ConfigurationListEnum, IConfigurationList } from '@/common/interfaces';

interface GlobalConfigState {
  terms_conditions: string;
  privacy_policy: string;
  admin_contract: string;
  disclaimer: string;
  email: string;
  phone_number: string;
}

const initialState: GlobalConfigState = {
  terms_conditions: '',
  privacy_policy: '',
  admin_contract: '',
  disclaimer: '',
  email: '',
  phone_number: '',
};

export const globalSlice = createSlice({
  name: 'global_config',
  initialState,
  reducers: {
    setGlobalDocuments: (
      state,
      action: PayloadAction<Partial<GlobalConfigState>>
    ) => {
      state.admin_contract = action.payload
        ? action.payload.admin_contract!
        : '';
      state.privacy_policy = action.payload
        ? action.payload.privacy_policy!
        : '';
      state.terms_conditions = action.payload
        ? action.payload.terms_conditions!
        : '';
    },
    setConfiguration: (state, action: PayloadAction<IConfigurationList[]>) => {
      state.disclaimer = action.payload.find(
        (e) => e.title === ConfigurationListEnum.DISCLAIMER
      )!.description;
      state.email = action.payload.find(
        (e) => e.title === ConfigurationListEnum.EMAIL
      )!.description;
      state.phone_number = action.payload.find(
        (e) => e.title === ConfigurationListEnum.PHONE
      )!.description;
    },
  },
});

export const { setGlobalDocuments, setConfiguration } = globalSlice.actions;
export default globalSlice.reducer;

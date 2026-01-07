import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PaymentMethodEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';

interface GlobalConfigState {
  paymentMethod: PaymentMethodEnum;
  isLoading: boolean;
  contextPaymentMethods: PaymentMethodEnum[];
}

const contextPaymentMethods = Object.values(PaymentMethodEnum);

const initialState: GlobalConfigState = {
  paymentMethod: PaymentMethodEnum.TRANSFER,
  isLoading: false,
  contextPaymentMethods: contextPaymentMethods,
};

export const paymentMethodSlice = createSlice({
  name: 'payment_method',
  initialState,
  reducers: {
    setPaymentMethod: (
      state,
      action: PayloadAction<
        PaymentMethodEnum.TRANSFER | PaymentMethodEnum.ONLINE
      >
    ) => {
      state.paymentMethod = action.payload;
    },
    setPaymentMethodLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setPaymentMethod, setPaymentMethodLoading } =
  paymentMethodSlice.actions;
export default paymentMethodSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IListOrderResponse } from '@/common/interfaces';


interface GlobalConfigState {
  orders: IListOrderResponse | null;
}

const initialState: GlobalConfigState = {
    orders: null
};

export const orderSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<IListOrderResponse>) => {
      state.orders = action.payload;
    },
  },
});

export const {
  setSubscriptions,
} = orderSlice.actions;
export default orderSlice.reducer;

// redux/slices/subscriptionSerieSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SerieState {
  serieCodigo: string;
}

const initialState: SerieState = {
  serieCodigo: '',
};

export const subscriptionSerieSlice = createSlice({
  name: 'subscriptionSerie',
  initialState,
  reducers: {
    setSerieCodigo: (state, action: PayloadAction<{ serieCodigo: string }>) => {
      state.serieCodigo = action.payload.serieCodigo;
    },
  },
});

export const { setSerieCodigo } = subscriptionSerieSlice.actions;
export default subscriptionSerieSlice.reducer;

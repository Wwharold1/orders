import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITabs, RescueTabs } from '@/common/enums';

interface RescueLayoutState {
  rescueTab: 0 | 1;
  rescueTabs: ITabs[];
}

const initialState: RescueLayoutState = {
  rescueTab: 0,
  rescueTabs: RescueTabs,
};

export const rescueLayoutSlice = createSlice({
  name: 'rescue_layout',
  initialState,
  reducers: {
    setRescueTab: (state, action: PayloadAction<0 | 1>) => {
      state.rescueTab = action.payload;
    },
  },
});

export const { setRescueTab } = rescueLayoutSlice.actions;
export default rescueLayoutSlice.reducer;

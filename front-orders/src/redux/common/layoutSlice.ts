import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ContextBottomSidebarEnum,
  ContextSidebarEnum,
  ContextSplashEnum,
  DeviceTypeEnum,
} from '@/common/enums';
import { ISplashSchema } from '@/common/interfaces';

interface LayoutState {
  splash: ISplashSchema;
  sidebar: ContextSidebarEnum | ContextBottomSidebarEnum;
  sidebarOpened: boolean;
  deviceType: DeviceTypeEnum | null;
  openedAnuallyUpdate: boolean;
}

const initialState: LayoutState = {
  splash: {
    show: false,
    type: ContextSplashEnum.AUTH,
  },
  sidebar: ContextSidebarEnum.HOME,
  sidebarOpened: true,
  deviceType: null,
  openedAnuallyUpdate: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSplash: (state) => {
      state.splash.show = !state.splash.show;
    },
    setSplash: (state, { payload }: PayloadAction<ISplashSchema>) => {
      state.splash = payload;
    },
    setDeviceType: (state, { payload }: PayloadAction<DeviceTypeEnum>) => {
      state.deviceType = payload;
    },
    setSidebar: (
      state,
      { payload }: PayloadAction<ContextSidebarEnum | ContextBottomSidebarEnum>
    ) => {
      state.sidebar = payload;
    },
    toggleSidebarOpened: (state) => {
      state.sidebarOpened = !state.sidebarOpened;
    },
    toggleOpenedAnuallyUpdate: (state, { payload }: PayloadAction<boolean>) => {
      state.openedAnuallyUpdate = payload;
    },
  },
});

export const {
  toggleSplash,
  setSplash,
  setSidebar,
  toggleSidebarOpened,
  setDeviceType,
  toggleOpenedAnuallyUpdate,
} = layoutSlice.actions;
export default layoutSlice.reducer;

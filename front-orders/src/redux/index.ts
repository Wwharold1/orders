import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import globalReducer from './common/globalSlice';
import layoutReducer from './common/layoutSlice';
import sessionReducer from '../modules/auth/slice/authSlice';
import orderReducer from '../modules/dashboard/slice/orderSlice';

const persistConfig = (key: string) => {
  return {
    key,
    storage,
  };
};

const persistedSessionReducer = persistReducer(
  persistConfig('session'),
  sessionReducer
);
const persistedLayoutReducer = persistReducer(
  persistConfig('layout'),
  layoutReducer
);
const persistedGlobalReducer = persistReducer(
  persistConfig('global'),
  globalReducer
);
const persitedOrderReducer = persistReducer(
  persistConfig('order'),
  orderReducer
);

export const store = configureStore({
  reducer: {
    session: persistedSessionReducer,
    layout: persistedLayoutReducer,
    global: persistedGlobalReducer,
    order: persitedOrderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PERSIST, PAUSE, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

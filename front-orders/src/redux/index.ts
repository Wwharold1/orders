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
import finalBeneficiaryProfileReducer from '../modules/dashboard/slice/finalBeneficiarySlice';
import paymentMethodReducer from '../modules/dashboard/slice/paymentMethodSlice';
import riskProfileReducer from '../modules/dashboard/slice/riskProfileSlice';
import subscriptionLayoutReducer from '../modules/dashboard/slice/subscriptionLayoutSlice';
import subscriptionSerieSlice from '../modules/dashboard/slice/subscriptionSerieSlice';
import subscriptionReducer from '../modules/dashboard/slice/subscriptionSlice';
import rescueLayoutReducer from '../modules/rescue/slice/rescueLayoutSlice';
import rescueReducer from '../modules/rescue/slice/rescueSlice';

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
const persistedRiskProfileReducer = persistReducer(
  persistConfig('risk_profile'),
  riskProfileReducer
);
const persistedFinalBeneficiaryReducer = persistReducer(
  persistConfig('final_beneficiary_profile'),
  finalBeneficiaryProfileReducer
);
const persistedSubscriptionReducer = persistReducer(
  persistConfig('subscription'),
  subscriptionReducer
);
const persistedRescueReducer = persistReducer(
  persistConfig('rescue'),
  rescueReducer
);

const persistedPaymentMethodReducer = persistReducer(
  persistConfig('payment_method'),
  paymentMethodReducer
);

export const store = configureStore({
  reducer: {
    session: persistedSessionReducer,
    layout: persistedLayoutReducer,
    global: persistedGlobalReducer,
    riskProfile: persistedRiskProfileReducer,
    finalBeneficiary: persistedFinalBeneficiaryReducer,
    subscription: persistedSubscriptionReducer,
    subscription_layout: subscriptionLayoutReducer,
    rescue_layout: rescueLayoutReducer,
    rescue: persistedRescueReducer,
    payment_method: persistedPaymentMethodReducer,
    subscriptionSerie: subscriptionSerieSlice,
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

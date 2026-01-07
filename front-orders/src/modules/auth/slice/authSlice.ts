/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FormStepsEnum } from '@/common/enums/form-steps.enum';
import { removeAuth, setAuth } from '@/common/helper/authHelper';
import {
  IFormStep,
  ISerie,
  IUserLogin,
} from '@/common/interfaces/user.interface';

import { AuthService } from '../../../services/AuthService';

interface ISetPayloadFormStep {
  form_step: FormStepsEnum;
}
interface AuthState {
  currentUser: IUserLogin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRemembered: boolean;
  error: string | null | undefined;
  token: string | null;
  form_steps: IFormStep[];
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  isRemembered: false,
  error: null,
  token: null,
  form_steps: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    deleteAuth: (state) => {
      removeAuth();
      (state.currentUser = null),
        (state.isAuthenticated = false),
        (state.isLoading = false),
        (state.error = null),
        (state.token = null);
    },
    toggleRemembered: (state) => {
      state.isRemembered = !state.isRemembered;
    },
    setProfileRisk: (state, action: PayloadAction<number>) => {
      state.currentUser!.risk_profile_id = action.payload;
    },
    setFormStep: (state, action: PayloadAction<FormStepsEnum>) => {
      const currentFormStep = state.form_steps.find(
        (form_step) => form_step.description === action.payload
      );
      if (currentFormStep) currentFormStep.status = true;
    },
    setFormStepPayload: (
      state,
      { payload }: PayloadAction<ISetPayloadFormStep>
    ) => {
      const currentFormStep = state.form_steps.find(
        (form_step) => form_step.description === payload.form_step
      );
      if (currentFormStep) {
        currentFormStep.status = true;
      }
    },
    setNumberDocument: (state, action: PayloadAction<string>) => {
      state.currentUser!.number_document = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.currentUser!.username = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.currentUser!.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.currentUser!.phone_number = action.payload;
    },
    setAnuallyUpdate: (state, action: PayloadAction<boolean>) => {
      state.currentUser!.has_passed_year = action.payload;
    },
    setStatus: (state, action: PayloadAction<number>) => {
      state.currentUser!.status = action.payload;
    },
    setExistSpectrum: (state, action: PayloadAction<boolean>) => {
      state.currentUser!.exist_spectrum = action.payload;
    },
    setCustomerSerie: (state, action: PayloadAction<ISerie>) => {
      state.currentUser!.serie = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AuthService().login.pending, (state) => {
        debugger
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AuthService().login.fulfilled, (state, action) => {
        debugger
        state.isLoading = false;
        if (action.payload.data.user) {
          state.isAuthenticated = true;
          state.currentUser = action.payload.data.user;
          state.token = action.payload.data.token;
          setAuth(action.payload.data, state.isRemembered);
        } else {
          state.error = action.payload.message;
        }
      })
      .addCase(AuthService().login.rejected, (state, action) => {
        debugger
        state.isLoading = false;
        state.error = action.error.message;
        state.currentUser = null;
        state.token = null;
      });
  },
});

export const {
  deleteAuth,
  toggleRemembered,
  setProfileRisk,
  setFormStep,
  setNumberDocument,
  setUsername,
  setEmail,
  setPhoneNumber,
  setFormStepPayload,
  setAnuallyUpdate,
  setStatus,
  setExistSpectrum,
  setCustomerSerie,
} = authSlice.actions;
export default authSlice.reducer;

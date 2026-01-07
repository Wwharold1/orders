import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ChangeFinalBeneficiaryTabs, ITabs } from '@/common/enums';
import { TFinalBeneficiaryForm } from '@/modules/dashboard/helpers/naturalClientValidationSchemas';

interface GlobalConfigState {
  changeFinalBeneficiaryTab: 0 | 1;
  changeFinalBeneficiaryTabs: ITabs[];
  setFormBeneficiaryFinal: TFinalBeneficiaryForm | null;
  isFinalBeneficiaryFromModal: boolean;
  isFinalBeneficiaryDatabase: boolean;
  finishStepFinalBeneficiary: boolean;
}

const initialState: GlobalConfigState = {
  changeFinalBeneficiaryTab: 0,
  changeFinalBeneficiaryTabs: ChangeFinalBeneficiaryTabs,
  setFormBeneficiaryFinal: null,
  isFinalBeneficiaryFromModal: false,
  isFinalBeneficiaryDatabase: true,
  finishStepFinalBeneficiary: false,
};

export const finalBeneficiarySlice = createSlice({
  name: 'final_beneficiary_profile',
  initialState,
  reducers: {
    setChangeFinalBeneficiaryTab: (state, action: PayloadAction<0 | 1>) => {
      state.changeFinalBeneficiaryTab = action.payload;
    },
    setFormBeneficiaryFinal: (
      state,
      action: PayloadAction<TFinalBeneficiaryForm | null>
    ) => {
      state.setFormBeneficiaryFinal = action.payload;
    },
    setIsFinalBeneficiaryFromModal: (state, action: PayloadAction<boolean>) => {
      state.isFinalBeneficiaryFromModal = action.payload;
    },
    setIsFinalBeneficiaryDatabase: (state, action: PayloadAction<boolean>) => {
      state.isFinalBeneficiaryDatabase = action.payload;
    },
    setFinishStepFinalBeneficiary: (state, action: PayloadAction<boolean>) => {
      state.finishStepFinalBeneficiary = action.payload;
    },
  },
});

export const {
  setChangeFinalBeneficiaryTab,
  setFormBeneficiaryFinal,
  setIsFinalBeneficiaryFromModal,
  setIsFinalBeneficiaryDatabase,
  setFinishStepFinalBeneficiary,
} = finalBeneficiarySlice.actions;
export default finalBeneficiarySlice.reducer;

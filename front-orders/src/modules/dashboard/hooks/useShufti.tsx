/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';

import { AMLRequestErrorsDictionary, ContextSplashEnum } from '@/common/enums';
import { FormStepsEnum } from '@/common/enums/form-steps.enum';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { setFormStep } from '@/modules/auth/slice/authSlice';
import { setNaturalClientTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { setSplash } from '@/redux/common/layoutSlice';
import { ShuftiService } from '@/services/ShuftiService';

export const useShufti = () => {
  const dispatch = useAppDispatch();
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );

  const makeAmlMutation = useMutation(
    () => dispatch(ShuftiService().makeAml()),
    {
      onSuccess: ({ payload }) => {
        // if (payload.message === AMLRequestErrorsDictionary.ALREADY_PASSED_AML) {
        //   notifyError({
        //     title: 'Usted ya pasó la validación de datos.',
        //   });
        //   return;
        // }

        if (
          payload.message === AMLRequestErrorsDictionary.ALREADY_PASSED_AML ||
          !payload.data.user_blocked
        ) {
          dispatch(setNaturalClientTab((naturalClientTab + 1) as any));
          dispatch(setFormStep(FormStepsEnum.AML));
        } else {
          dispatch(
            setSplash({
              type: ContextSplashEnum.FAILED_AML,
              show: true,
            })
          );
        }
      },
    }
  );

  return { makeAmlMutation };
};

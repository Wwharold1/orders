/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import {
  ContextRoutesEnum,
  ContextSidebarEnum,
  ContextSplashEnum,
  GeneralStatusEnum,
} from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import {
  IRegisterProfileRequest,
  IRiskOption,
  IShowRiskProfileResponse,
} from '@/common/interfaces/risk.profile.interface';
import { setProfileRisk } from '@/modules/auth/slice/authSlice';
import { RiskProfileOriginEnum } from '@/modules/dashboard/enums/risk-profile-origin.enum';
import { SubscriptionFormEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setCustomerRisk } from '@/modules/dashboard/slice/riskProfileSlice';
import { setSidebar, setSplash } from '@/redux/common/layoutSlice';
import { RiskProfileService } from '@/services/RiskProfileService';

import {
  IProfileResponse,
  IRegisterProfileResponse,
} from '../../../common/interfaces/risk.profile.interface';

/**
 * Custom hook for managing risk profile.
 *
 * @param {boolean} [enabled=true] - Determines if the risk profile query should be enabled.
 * @param {RiskProfileOriginEnum} [riskProfileOrigin] - Determines where was the origin of the risk profile flow request
 * @returns {object} An object containing queries, state, mutations, and modal states.
 */
export const useRiskProfile = (
  enabled = true,
  riskProfileOrigin?: RiskProfileOriginEnum
) => {
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const [optionsSelected, setOptionsSelected] = useStateCallback<IRiskOption[]>(
    []
  );
  const currentRisk = useAppSelector((state) => state.riskProfile);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const router = useRouter();
  const hasPDR =
    !!currentUser?.risk_profile_id || currentRisk.customer_risk
      ? 'risk_profile_id' in currentRisk.customer_risk!
        ? !!currentRisk.customer_risk?.risk_profile_id
        : !!currentRisk.customer_risk?.id
      : false;
  const dispatch = useAppDispatch();
  const { selectedCustomerRisk } = useAppSelector((state) => state.riskProfile);

  const questionnaireQuery = useQuery<IShowRiskProfileResponse>(
    ['risk-profile'],
    () => RiskProfileService().showQuestionnaire(),
    {
      enabled,
    }
  );

  const registerRiskMutation = useMutation(
    (data: IRegisterProfileRequest) =>
      RiskProfileService().registerCustomerRisk(data),
    {
      onSuccess(data: IRegisterProfileResponse) {
        router.push(
          {
            pathname: ContextRoutesEnum.DASHBOARD_RISK_PROFILE_RESULT,
            query: {
              redirect: riskProfileOrigin,
            },
          },
          ContextRoutesEnum.DASHBOARD_RISK_PROFILE_RESULT
        );
        dispatch(setProfileRisk(data.response.risk_profile_id));
        dispatch(setCustomerRisk(data.response));
        dispatch(setSidebar(ContextSidebarEnum.PROFILE));
      },
    }
  );

  const setCustomerRiskMutation = useMutation(
    (token: any) =>
      RiskProfileService().setCustomerRisk({
        risk_profile_id: selectedCustomerRisk!.id,
        image: token.bestImage.currentSrc.split(',')[1],
      }),
    {
      onSuccess(res: IProfileResponse) {
        dispatch(setProfileRisk(res.risk_profile_id));
        dispatch(setCustomerRisk(res));
      },
    }
  );

  const onHandleInvestment = (
    isRecommended = false,
    cb?: ((state: boolean) => void) | undefined
  ) => {
    const isSuspended = currentUser?.status === GeneralStatusEnum.SUSPENDED;

    if (isSuspended) return;

    if (currentUser?.has_passed_year && currentUser.status !== -3) {
      dispatch(
        setSplash({
          show: true,
          type: ContextSplashEnum.ANUALLY_UPDATED,
        })
      );
      return;
    }

    if (!hasPDR) {
      router.push(ContextRoutesEnum.DASHBOARD_RISK_PROFILE);
      return;
    }

    if (!isRecommended && cb) {
      cb(true);
      return;
    }
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_DETAIL);
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_RECEIPT);
    const route = currentUser?.exist_spectrum
      ? ContextRoutesEnum.SUBSCRIPTION_INVESTMENT
      : ContextRoutesEnum.SUBSCRIPTION_TYPE_PARTICIPATE;
    router.push(route);
  };

  return {
    queries: {
      questionnaireQuery,
    },
    state: {
      optionsSelected,
      setOptionsSelected,
      hasPDR,
    },
    mutations: { registerRiskMutation, setCustomerRiskMutation },
    modal: {
      openModalCancel,
      setOpenModalCancel,
    },
    onHandleInvestment,
  };
};

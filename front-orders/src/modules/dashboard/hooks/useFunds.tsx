/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';

import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { useStateCallback } from '@/common/hooks/useStateCallback';
import {
  IProfileFundResponse,
  TShowFundResponse,
} from '@/common/interfaces/fund.interface';
import {
  setFunds,
  setRecommendedFunds,
} from '@/modules/dashboard/slice/subscriptionSlice';
import { FundsService } from '@/services/FundsService';

export const useFunds = () => {
  const [downloadState, setDownloadState] = useStateCallback<string>('');
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const dispatch = useAppDispatch();

  const fundsQuery = useQuery<TShowFundResponse>(
    ['show-fund'],
    () => FundsService().showFunds(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (e) => {
        dispatch(setFunds(e));
      },
    }
  );
  const profileFundQuery = useQuery<IProfileFundResponse>(
    ['profile-fund'],
    () => FundsService().profileFund(),
    {
      retry: false,
      enabled: !!fundsQuery.data,
      refetchOnWindowFocus: false,
      onSuccess: (e) => {
        const recommendedFunds =
          e.data.profilesFunds?.filter(
            (profileFund) =>
              profileFund.profileId === currentUser?.risk_profile_id &&
              profileFund.recommended
          ) || [];

        const filteredFunds =
          e.data.funds.filter((fund) =>
            recommendedFunds.map((fund) => fund.fundId).includes(fund.id)
          ) || [];

        dispatch(setRecommendedFunds(filteredFunds));
      },
    }
  );

  return {
    queries: {
      fundsQuery,
      profileFundQuery,
    },
    states: {
      downloadState,
      setDownloadState,
    },
  };
};

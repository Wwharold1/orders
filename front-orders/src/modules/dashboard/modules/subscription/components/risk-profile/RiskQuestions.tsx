/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { FC } from 'react';

import { IShowRiskProfileResponse } from '@/common/interfaces';
import { RiskQuestion } from '@/modules/dashboard/modules/subscription/components/risk-profile/RiskQuestion';

interface IProps {
  riskProfile: IShowRiskProfileResponse | undefined;
  loading: boolean;
  state: any;
}

export const RiskQuestions: FC<IProps> = ({ riskProfile, loading, state }) => {
  return (
    <div>
      {!loading ? (
        <>
          {riskProfile!.data.questions.map((question, index) => {
            return (
              <RiskQuestion state={state} question={question} key={index} />
            );
          })}
        </>
      ) : (
        <>
          {[1, 2, 3, 4, 5].map((question, index) => {
            return <RiskQuestion state={state} loading={loading} key={index} />;
          })}
        </>
      )}
    </div>
  );
};

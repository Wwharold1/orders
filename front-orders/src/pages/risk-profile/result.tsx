import React from 'react';

import Seo from '@/common/components/Seo';
import { RiskProfileCompleted } from '@/modules/dashboard/modules/subscription/RiskProfileCompleted';

const risk_profile_result = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <RiskProfileCompleted />
      </main>
    </React.Fragment>
  );
};

export default risk_profile_result;

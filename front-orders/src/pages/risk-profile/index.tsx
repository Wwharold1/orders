import React from 'react';

import Seo from '@/common/components/Seo';
import { RiskProfile } from '@/modules/dashboard/modules/subscription/RiskProfile';

const risk_profile = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <RiskProfile />
      </main>
    </React.Fragment>
  );
};

export default risk_profile;

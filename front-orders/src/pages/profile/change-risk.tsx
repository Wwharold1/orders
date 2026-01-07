import React from 'react';

import Seo from '@/common/components/Seo';
import { ChangeRiskProfile } from '@/modules/profile/views/ChangeRisk';

const update = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <ChangeRiskProfile />
      </main>
    </React.Fragment>
  );
};

export default update;

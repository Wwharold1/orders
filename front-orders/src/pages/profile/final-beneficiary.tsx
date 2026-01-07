import React from 'react';

import Seo from '@/common/components/Seo';
import { FinalBeneficiaryProfile } from '@/modules/profile/views/FinalBeneficiary';

const update = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <FinalBeneficiaryProfile />
      </main>
    </React.Fragment>
  );
};

export default update;

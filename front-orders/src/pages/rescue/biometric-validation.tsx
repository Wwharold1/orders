import React from 'react';

import Seo from '@/common/components/Seo';
import { BiometricValidation } from '@/modules/dashboard/modules/subscription/BiometricValidation';

const biometric = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <BiometricValidation mode='rescue' />
      </main>
    </React.Fragment>
  );
};

export default biometric;

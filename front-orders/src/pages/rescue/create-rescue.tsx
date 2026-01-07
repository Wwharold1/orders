import React from 'react';

import Seo from '@/common/components/Seo';
import { Rescue } from '@/modules/rescue/Rescue';

const biometric = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <Rescue />
      </main>
    </React.Fragment>
  );
};

export default biometric;

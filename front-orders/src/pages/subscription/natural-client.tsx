import React from 'react';

import Seo from '@/common/components/Seo';
import { NaturalClient } from '@/modules/dashboard/modules/subscription/NaturalClient';

const natural_client = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <NaturalClient />
      </main>
    </React.Fragment>
  );
};

export default natural_client;

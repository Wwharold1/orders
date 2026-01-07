import React from 'react';

import Seo from '@/common/components/Seo';
import { Investment } from '@/modules/dashboard/modules/subscription/Investment';

const investment = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <Investment />
      </main>
    </React.Fragment>
  );
};

export default investment;

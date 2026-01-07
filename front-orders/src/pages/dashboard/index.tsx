import React from 'react';

import Seo from '@/common/components/Seo';
import { Dashboard } from '@/modules/dashboard/Dashboard';

const dashboard = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <Dashboard />
      </main>
    </React.Fragment>
  );
};

export default dashboard;

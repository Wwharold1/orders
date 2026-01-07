import React from 'react';

import Seo from '@/common/components/Seo';
import { RecommendedFunds } from '@/modules/dashboard/modules/funds/RecommendedFunds';

const products_detail = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <RecommendedFunds />
      </main>
    </React.Fragment>
  );
};

export default products_detail;

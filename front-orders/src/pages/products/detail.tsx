import React from 'react';

import Seo from '@/common/components/Seo';
import { ProductDetail } from '@/modules/dashboard/modules/funds/ProductDetail';

const products_detail = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <ProductDetail />
      </main>
    </React.Fragment>
  );
};

export default products_detail;

import React from 'react';

import Seo from '@/common/components/Seo';
import { Order, OrderModeEnum } from '@/modules/dashboard/modules/order/Order';

const edit = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <Order  mode={OrderModeEnum.UPDATE} />
      </main>
    </React.Fragment>
  );
};

export default edit;

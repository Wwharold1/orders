import React from 'react';

import Seo from '@/common/components/Seo';
import { Order, OrderModeEnum } from '@/modules/dashboard/modules/order/Order';

const create = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <Order  mode={OrderModeEnum.CREATE} />
      </main>
    </React.Fragment>
  );
};

export default create;

import React from 'react';

import Seo from '@/common/components/Seo';
import {
  AccountModeEnum,
  CreateAccount,
} from '@/modules/accounts/views/CreateAccount';

const create = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <CreateAccount mode={AccountModeEnum.CREATE} />
      </main>
    </React.Fragment>
  );
};

export default create;

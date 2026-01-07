import React from 'react';

import Seo from '@/common/components/Seo';
import {
  AccountModeEnum,
  CreateAccount,
} from '@/modules/accounts/views/CreateAccount';

const edit = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <CreateAccount mode={AccountModeEnum.UPDATE} />
      </main>
    </React.Fragment>
  );
};

export default edit;

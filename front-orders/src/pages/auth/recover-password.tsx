import React from 'react';

import Seo from '@/common/components/Seo';
import { RecoverPassword } from '@/modules/auth/RecoverPassword';

const Recover = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <RecoverPassword />
      </main>
    </React.Fragment>
  );
};

export default Recover;

import React from 'react';

import Seo from '@/common/components/Seo';
import { EditProfile } from '@/modules/profile/views/EditProfile';

const update = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <EditProfile updatePassword />
      </main>
    </React.Fragment>
  );
};

export default update;

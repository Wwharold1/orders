import React from 'react';

import Seo from '@/common/components/Seo';
import { EditProfile } from '@/modules/profile/views/EditProfile';

const edit = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <EditProfile />
      </main>
    </React.Fragment>
  );
};

export default edit;

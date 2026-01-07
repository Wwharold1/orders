import React from 'react';

import Seo from '@/common/components/Seo';
import { DownloadEECC } from '@/modules/profile/views/DownloadEECC';

const update = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <DownloadEECC />
      </main>
    </React.Fragment>
  );
};

export default update;

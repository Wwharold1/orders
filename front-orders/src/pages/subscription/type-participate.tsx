import React from 'react';

import Seo from '@/common/components/Seo';
import { TypeParticipate } from '@/modules/dashboard/modules/subscription/TypeParticipate';

const type_participate = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <TypeParticipate />
      </main>
    </React.Fragment>
  );
};

export default type_participate;

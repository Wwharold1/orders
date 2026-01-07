import React from 'react';

import Seo from '@/common/components/Seo';
import Register from '@/modules/auth/Register';

const RegisterPage = () => {
  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <Register />
      </main>
    </React.Fragment>
  );
};

export default RegisterPage;

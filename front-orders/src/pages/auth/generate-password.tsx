/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Modal } from '@/common/components/Modal';
import Seo from '@/common/components/Seo';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';
import { usePasswordValidation } from '@/modules/auth/hooks/usePasswordValidation';
import RegisterCreationPassword from '@/modules/auth/RegisterCreationPassword';

const GeneratePassword = () => {
  const router = useRouter();
  const {
    forms: { createPasswordForm },
  } = useAuthentication();
  const functions = usePasswordValidation({
    forms: createPasswordForm,
    new_password: 'password',
    new_confirmation_password: 'passwordConfirmation',
  });
  const [openAbruptModal, setOpenAbruptModal] = useState(false);

  useEffect(() => {
    if (
      router.query.email &&
      !Array.isArray(router.query.email) &&
      router.query.hash &&
      !Array.isArray(router.query.hash)
    ) {
      const currentEmail = localStorage
        .getItem('current-email')
        ?.replaceAll('"', '');

      if (currentEmail !== router.query.email) {
        setOpenAbruptModal(true);
        localStorage.clear();
        setTimeout(() => {
          router.push('/');
        }, 3000);
        return;
      }

      createPasswordForm.setValue('email', router.query.email);
      createPasswordForm.setValue('hash_security', router.query.hash);
    }
  }, [router.isReady]);

  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <RegisterCreationPassword
          createPasswordForm={createPasswordForm}
          functions={functions}
        />
        <Modal
          urlIcon='/icons/info.svg'
          title='El correo de registro no coincide.'
          isOpen={openAbruptModal}
          modalLength={350}
          setIsOpen={setOpenAbruptModal}
          closeOnTouchOutside={false}
        >
          <p>
            Lo sentimos, el enlace que has utilizado no te corresponde. <br />{' '}
            Por favor, vuelve a registrarte.
          </p>
        </Modal>
      </main>
    </React.Fragment>
  );
};

export default GeneratePassword;

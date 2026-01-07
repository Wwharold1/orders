/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useState } from 'react';

import { Modal } from '@/common/components/Modal';
import Seo from '@/common/components/Seo';
import RegisterIdentityValidation from '@/modules/auth/RegisterIdentityValidation';

const IdentityValidation = () => {
  const [openInvalidModal, setOpenInvalidModal] = useState(false);
  const [openExistentModal, setOpenExistentModal] = useState(false);
  const [openNoExistModal, setOpenNoExistModal] = useState(false);
  const [openAbruptModal, setOpenAbruptModal] = useState(false);

  return (
    <React.Fragment>
      <Seo />

      <main className='app-container'>
        <RegisterIdentityValidation />
        <Modal
          urlIcon='/icons/info.svg'
          title='Tiempo de token expirado.'
          isOpen={openInvalidModal}
          modalLength={350}
          setIsOpen={setOpenInvalidModal}
          closeOnTouchOutside={false}
        >
          <p>
            Lo sentimos, el enlace que has utilizado ha expirado. <br /> Por
            favor, vuelve a registrarte.
          </p>
        </Modal>
        <Modal
          urlIcon='/icons/info.svg'
          title='Ya tienes una cuenta.'
          isOpen={openExistentModal}
          modalLength={350}
          setIsOpen={setOpenExistentModal}
          closeOnTouchOutside={false}
        >
          <p>
            Existe una cuenta asociada al correo enviado. <br /> Por favor,
            inicie sesión.
          </p>
        </Modal>
        <Modal
          urlIcon='/icons/info.svg'
          title='El correo ingresado no existe.'
          isOpen={openNoExistModal}
          modalLength={350}
          setIsOpen={setOpenNoExistModal}
          closeOnTouchOutside={false}
        >
          <p>
            Lo sentimos, no encontramos una cuenta <br /> asociada al correo
            solicitado. Por favor, <br /> comience el proceso de registro
          </p>
        </Modal>
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

export default IdentityValidation;

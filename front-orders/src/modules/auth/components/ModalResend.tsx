/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Modal } from '@/common/components/Modal';

interface IProps {
  isOpen: boolean;
  setIsOpen: any;
}

export const ModalResend = ({ isOpen, setIsOpen }: IProps) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      urlIcon='/icons/mailModal.svg'
      confirmationText='Aceptar'
      subtitle='Se volvió a enviar el correo.'
      title='Correo reenviado'
      modalLength={400}
    />
  );
};

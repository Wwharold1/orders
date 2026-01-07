import Image from 'next/image';
import React, { useState } from 'react';

import { Modal } from '@/common/components/Modal';
import { Spinner } from '@/common/components/Spinner';
import { hideEmail } from '@/common/helper/authHelper';
import { AuthLayout } from '@/layout/AuthLayout';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { ModalFacial } from '@/modules/auth/components/ModalFacial';
import { IdentityTitleEnum } from '@/modules/auth/enums/identity-title.enum';
import { FacialStateEnum } from '@/modules/auth/helpers/registerSteps';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';

export default function RegisterIdentityValidation() {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const {
    submitHandlers,
    facialState,
    setFacialState,
    setAutocaptureState,
    modal,
    loaders: { loadEmailCreationPassword },
    currentEmail,
  } = useAuthentication();

  const [isOpenFacial, setIsOpenFacial] = useState<boolean>(false);

  return (
    <React.Fragment>
      <AuthLayout
        title={IdentityTitleEnum[facialState as keyof typeof IdentityTitleEnum]}
        imageRecover
        imagePath='/images/registerImage.jpg'
      >
        <div className='mt-10 flex grow flex-col space-y-2 px-4 font-bold text-neutral-800 hover:text-neutral-800 md:px-14'>
          {facialState === FacialStateEnum.INITIAL_VALIDATION ? (
            <React.Fragment>
              <p className='font-medium'>
                A continuación, verificaremos tu identidad con ayuda de la
                cámara frontal de tu dispositivo.
              </p>
              <p className='font-medium'>
                Para tener un resultado exitoso te aconsejamos:
              </p>
            </React.Fragment>
          ) : facialState === FacialStateEnum.VALIDATION_UNSUCCESS ? (
            <React.Fragment>
              <p className='font-medium'>
                Tuvimos problemas con la validación de identidad.
              </p>
              <p className='font-medium'>
                Para asegurar un buen resultado, por favor ten en cuenta las
                siguientes recomendaciones:
              </p>
            </React.Fragment>
          ) : facialState === FacialStateEnum.VALIDATION_SUCCESS ? (
            <React.Fragment>
              <p className='font-medium'>
                Hemos enviado un correo de creación de contraseña a
              </p>
              <p className='font-bold'>{hideEmail(currentEmail)}</p>
              <p className='font-medium'>
                Si no lo encuentras en tu bandeja de entrada, recuerda revisar
                tu carpeta de Spam.
              </p>
              <div
                onClick={() => submitHandlers.submitSendEmailCreation()}
                className='flex w-auto items-center text-[16px] font-bold leading-6'
              >
                {loadEmailCreationPassword ? (
                  <Spinner noSpacing />
                ) : (
                  <Image
                    src='/icons/sentEmail.svg'
                    alt='Email icon'
                    width={20}
                    height={20}
                  />
                )}
                <p className='ml-2 cursor-pointer border-b border-primary-500 text-primary-500'>
                  Volver a enviar
                </p>
              </div>
            </React.Fragment>
          ) : facialState === FacialStateEnum.LIMIT_SHIPMENTS_FACIAL ? (
            <React.Fragment>
              <p className='font-medium'>
                Has alcanzado el límite de envíos posibles de validar tu
                identidad a través de nuestro sistema biométrico.
              </p>
              <p className='font-medium'>
                Por favor, comunícate con tu Asesor de Inversiones o, de lo
                contrario, contáctanos a{' '}
                <span className='cursor-pointer font-bold'>
                  backoffice@prudentialsaf.com.pe
                </span>{' '}
                para que podamos ayudarte.
              </p>
            </React.Fragment>
          ) : (
            facialState === FacialStateEnum.LIMIT_SHIPMENTS && (
              <React.Fragment>
                <p className='font-medium'>
                  Has alcanzado el límite de envíos posibles de correo de
                  creación de contraseña.
                </p>
                <p className='font-medium'>
                  Por favor, comunícate con tu Asesor de Inversiones o, de lo
                  contrario, contáctanos a{' '}
                  <span className='cursor-pointer font-bold'>
                    backoffice@prudentialsaf.com.pe
                  </span>{' '}
                  para que podamos ayudarte.
                </p>
              </React.Fragment>
            )
          )}
          {facialState !== FacialStateEnum.VALIDATION_SUCCESS &&
            facialState !== FacialStateEnum.LIMIT_SHIPMENTS_FACIAL &&
            facialState !== FacialStateEnum.LIMIT_SHIPMENTS && (
              <div className='mt-10 flex grow flex-col space-y-8 px-4 pt-4'>
                <div className='flex items-center space-x-2'>
                  <div className='h-2 w-2 bg-prudential-500'></div>
                  <p className='font-medium'>
                    Estar en un ambiente correctamente iluminado.
                  </p>
                </div>

                <div className='flex items-center space-x-2'>
                  <div className='h-2 w-2 bg-prudential-500'></div>
                  <p className='font-medium'>
                    No tener objetos que impidan ver tu rostro.
                  </p>
                </div>

                <div className='flex items-center space-x-2'>
                  <div className='h-2 w-2 bg-prudential-500'></div>
                  <p className='font-medium'>
                    Ubicarte frente a un fondo de color sólido.
                  </p>
                </div>
                <div className='mt-8 flex grow flex-col'>
                  <AuthButton
                    title={
                      facialState === 0
                        ? 'Comenzar ahora'
                        : facialState === 1
                        ? 'Volver a intentar'
                        : 'Comenzar ahora'
                    }
                    customFunction={() => {
                      setIsOpenFacial(true);
                    }}
                  />
                </div>
              </div>
            )}
          {(facialState === 4 || facialState === 3) && (
            <AuthButton
              title='Ir al inicio'
              link='https://prudentialsaf.com.pe/'
            />
          )}
          {isOpenFacial && (
            <ModalFacial
              isOpen={isOpenFacial}
              setIsOpen={setIsOpenFacial}
              setFacialState={setFacialState}
              setAutocaptureState={setAutocaptureState}
            />
          )}
        </div>
        <Modal
          urlIcon='/icons/info.svg'
          title='Enlace inválida.'
          isOpen={modal.openInvalidModal}
          modalLength={350}
          setIsOpen={modal.setOpenInvalidModal}
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
          isOpen={modal.openExistentModal}
          modalLength={350}
          setIsOpen={modal.setOpenExistentModal}
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
          isOpen={modal.openNoExistModal}
          modalLength={350}
          setIsOpen={modal.setOpenNoExistModal}
          closeOnTouchOutside={false}
        >
          <p>
            Lo sentimos, no encontramos una cuenta <br /> asociada al correo
            solicitado. Por favor, <br /> comience el proceso de registro
          </p>
        </Modal>
      </AuthLayout>
    </React.Fragment>
  );
}

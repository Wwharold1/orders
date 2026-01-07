import React, { useState } from 'react';

import { Modal } from '@/common/components/Modal';
import { hideEmail } from '@/common/helper/authHelper';
import { AuthLayout } from '@/layout/AuthLayout';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { ModalResend } from '@/modules/auth/components/ModalResend';
import { AuthRecoverTitleEnum } from '@/modules/auth/enums';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';
import { useErrorTimer } from '@/modules/auth/hooks/useErrorTimer';
import { usePasswordValidation } from '@/modules/auth/hooks/usePasswordValidation';

export const RecoverPassword = () => {
  const {
    forms,
    submitHandlers,
    resetStep,
    loaders: { loadGeneratePassword, loadValidatePassword, loadResetPassword },
    modal,
    timers: { emailRecoverTimer },
  } = useAuthentication();
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const { validationComponent } = usePasswordValidation({
    forms: forms.resetForm,
    new_confirmation_password: 'confirmation_password',
    new_password: 'new_password',
    description:
      'Crea una nueva contraseña que cumpla con los siguientes criterios:',
  });

  const { currentTimer } = useErrorTimer({
    timer: emailRecoverTimer,
    key: 'timer',
  });

  return (
    <React.Fragment>
      <AuthLayout
        title={
          AuthRecoverTitleEnum[resetStep as keyof typeof AuthRecoverTitleEnum]
        }
        steps={resetStep}
        totalSteps={3}
        imagePath='/images/recoverImage.jpg'
        imageRecover
      >
        <div className='mt-10 flex flex-col space-y-2 px-4 font-medium text-primary-900 hover:text-primary-900 md:px-14'>
          {resetStep === 0 && (
            <p>
              Ingresa el correo asociado a tu cuenta. <br />
              Enviaremos un código de verificación.
            </p>
          )}
          {resetStep === 1 && (
            <React.Fragment>
              <p>
                Si el correo ingresado está registrado, recibirás un código a
              </p>
              <div className='flex items-center space-x-2'>
                <p className='font-bold'>
                  {hideEmail(forms.generateForm.getValues('email'))}
                </p>
              </div>
              <p className='!mt-6'>
                Si no lo encuentras en tu bandeja de entrada, recuerda revisar
                tu carpeta de Spam.
              </p>
            </React.Fragment>
          )}
          {resetStep === 2 && validationComponent()}
          {resetStep === 3 && (
            <React.Fragment>
              <p>Tu contraseña se actualizó con éxito.</p>
              <p>Intenta iniciar sesión.</p>
            </React.Fragment>
          )}
        </div>
        {resetStep === 0 && (
          <form
            onSubmit={forms.generateForm.handleSubmit(
              submitHandlers.submitGenerate
            )}
            className='mt-10 flex grow flex-col px-4 md:px-14'
          >
            <div className='space-y-1.5 rounded-md'>
              <AuthInput
                name='email'
                placeholder='Correo electrónico'
                type='text'
                size={3}
                form={forms.generateForm}
                error={forms.generateForm.formState.errors}
                formRegister={forms.generateForm.register}
                icon='/icons/mail.svg'
              />
            </div>
            <AuthButton
              title='Enviar código'
              loader={loadGeneratePassword}
              largeText
              disabled={
                !forms.generateForm.formState.isDirty ||
                !forms.generateForm.formState.isValid ||
                loadGeneratePassword
              }
              subButtonText='Ir al inicio de sesión'
              subButtonLink='/'
              subButton
            />
          </form>
        )}
        {resetStep === 1 && (
          <form
            onSubmit={forms.validateForm.handleSubmit(
              submitHandlers.submitValidate
            )}
            className='mt-10 flex grow flex-col  px-4 md:px-14'
          >
            <span className='mb-1 self-end justify-self-end text-sm font-bold text-[#D53943]'>
              {currentTimer}
            </span>
            <div className='space-y-1.5 rounded-md'>
              <AuthInput
                name='code'
                placeholder='Código de verificación'
                type='alphanumeric'
                size={3}
                max={20}
                form={forms.validateForm}
                top='top-[22px]'
                error={forms.validateForm.formState.errors}
                formRegister={forms.validateForm.register}
                icon='/icons/keyCode.svg'
              />
            </div>
            <AuthButton
              title='Verificar código'
              loader={loadValidatePassword}
              subButton
              subButtonText='Volver a enviar'
              subButtonCustomFunction={() =>
                submitHandlers.submitResendGenerate()
              }
              disabled={loadValidatePassword}
              subButtonDisabled={currentTimer}
              subButtonLoader={loadGeneratePassword}
            />
          </form>
        )}
        {resetStep === 2 && (
          <form
            onSubmit={forms.resetForm.handleSubmit(submitHandlers.submitReset)}
            className='mt-8 flex grow flex-col  px-4 md:px-14'
          >
            <div className='space-y- rounded-md'>
              <AuthInput
                name='new_password'
                placeholder='Nueva contraseña'
                type='password'
                form={forms.resetForm}
                error={forms.resetForm.formState.errors}
                formRegister={forms.resetForm.register}
                noPadding
              />
              <br />
              <AuthInput
                name='confirmation_password'
                placeholder='Confirmar contraseña'
                type='password'
                form={forms.resetForm}
                error={forms.resetForm.formState.errors}
                formRegister={forms.resetForm.register}
                noPadding
              />
            </div>
            <AuthButton
              title='Actualizar Contraseña'
              loader={loadResetPassword}
              disabled={
                loadResetPassword ||
                !forms.resetForm.formState.isDirty ||
                !forms.resetForm.formState.isValid
              }
              largeText
            />
          </form>
        )}
        {resetStep === 3 && (
          <div className='mt-8 flex grow flex-col '>
            <AuthButton
              title='Ir al inicio de sesión'
              loader={isLoadingPage}
              customFunction={() => setIsLoadingPage(true)}
              link='/'
              largeText
            />
          </div>
        )}
        <ModalResend
          isOpen={modal.isOpenResend}
          setIsOpen={modal.setIsOpenResend}
        />
        <Modal
          urlIcon='/icons/mailModal.svg'
          title='Valida tu correo'
          isOpen={modal.openNoExistModal}
          modalLength={450}
          setIsOpen={modal.setOpenNoExistModal}
          confirmationText='Entendido'
          closeIcon
        >
          <p>
            Si los datos son correctos, recibirás un correo con más
            instrucciones.
          </p>
        </Modal>
        <Modal
          urlIcon='/icons/info.svg'
          title='Código de verificación inválido.'
          isOpen={modal.openInvalidModal}
          modalLength={350}
          setIsOpen={modal.setOpenInvalidModal}
          confirmationText='Aceptar'
        >
          <p>
            Lo sentimos, el código de verificación utilizado ha expirado <br />o
            es inválido. Por favor, vuelve a intentarlo.
          </p>
        </Modal>
      </AuthLayout>
    </React.Fragment>
  );
};

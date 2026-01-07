/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import { MdOutlineMail, MdOutlinePhoneIphone } from 'react-icons/md';

import { Button, Modal, notifyInfo } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { usePasswordValidation } from '@/modules/auth/hooks/usePasswordValidation';
import { EditProfileStepEnum } from '@/modules/profile/enums/edit.profile.step.enum';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { toggleOpenedAnuallyUpdate } from '@/redux/common/layoutSlice';

interface IProps {
  validateEmail?: boolean;
  validatePhone?: boolean;
  updatePassword?: boolean;
}

export const EditProfile: FC<IProps> = ({
  validateEmail,
  validatePhone,
  updatePassword,
}) => {
  const router = useRouter();
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const [openModalInterrupt, setOpenModalInterrupt] =
    useStateCallback<boolean>(false);
  const isXLDown = useMediaQuery(MediaQueryEnum.XL);
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.session);
  const { forms, submitHandlers, state, mutations } = useProfile();
  const { validationComponent, isValid } = usePasswordValidation({
    forms: forms.updatePasswordForm,
    new_confirmation_password: 'confirmation_password',
    new_password: 'new_password',
  });

  useEffect(() => {
    if (updatePassword)
      state.setEditProfileStep(EditProfileStepEnum.UPDATE_PASSWORD);

    if (validateEmail) {
      state.setEditProfileStep(EditProfileStepEnum.VALIDATE_EMAIL);
      forms.updateEmailForm.setValue('email', localStorage.getItem('email')!);
    }
    if (validatePhone) {
      state.setEditProfileStep(EditProfileStepEnum.VALIDATE_PHONE);
      forms.updatePhoneForm.setValue(
        'phone_number',
        localStorage.getItem('phone_number')!
      );
    }
  }, []);

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout
        routeBack={() =>
          state.editProfileStep === EditProfileStepEnum.VALIDATE_EMAIL ||
          state.editProfileStep === EditProfileStepEnum.VALIDATE_PHONE ||
          state.editProfileStep === EditProfileStepEnum.UPDATE_PASSWORD
            ? setOpenModalInterrupt(true)
            : router.push(ContextRoutesEnum.DASHBOARD)
        }
      >
        {state.editProfileStep === EditProfileStepEnum.VALIDATE_PASSWORD && (
          <form
            onSubmit={forms.passwordValidationForm.handleSubmit(
              submitHandlers.submitReset
            )}
            className='relative rounded-lg bg-white px-6 py-8 shadow-md'
          >
            <p className='text-xl font-bold leading-none text-primary-900'>
              Solicitud de contraseña{' '}
            </p>
            <p className='mt-4 text-primary-900'>
              Para continuar, ingresa tu contraseña.
            </p>
            <div className='mt-3 w-full md:w-1/2'>
              <AuthInput
                name='password'
                placeholder='Contraseña'
                type='password'
                icon='/icons/password.svg'
                iconError='/icons/passwordError.svg'
                left='left-3.5'
                width={15}
                top='top-[18px]'
                form={forms.passwordValidationForm}
                formRegister={forms.passwordValidationForm.register}
                error={forms.passwordValidationForm.formState.errors}
              />
            </div>
            <div className='fixed bottom-0 left-0 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:absolute md:bottom-auto md:mb-12 md:mt-16 md:flex-row md:space-y-0'>
              <Button
                title='Cancelar'
                alternative
                noBorder
                handleClick={() => router.back()}
                className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
              />
              <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
                <Button
                  className='w-4/5 self-center !px-12 md:w-auto'
                  type='submit'
                  disabled={mutations.passwordValidationMutation.isLoading}
                  loader={mutations.passwordValidationMutation.isLoading}
                  title='Verificar'
                />
              </div>
            </div>
          </form>
        )}
        {state.editProfileStep === EditProfileStepEnum.EDIT_DATA && (
          <form
            onSubmit={forms.updateUsernameForm.handleSubmit(
              submitHandlers.submitUpdateUsername
            )}
            className='relative rounded-lg bg-white px-6 py-8 shadow-md'
          >
            <p className='text-xl font-bold leading-none text-primary-900'>
              Información{' '}
            </p>
            <p className='mt-4 font-bold text-primary-900'>
              ¿Cómo deseas que te llamemos?{' '}
            </p>
            <p className='mt-4 text-primary-900'>
              Elige un nombre de usuario con el que deseas que nos refiramos a
              ti.{' '}
            </p>
            <div className='mt-3 w-full md:w-1/3'>
              <AuthInput
                name='username'
                placeholder='Nombre'
                type='text'
                width={16}
                size={3}
                max={20}
                left='left-3'
                form={forms.updateUsernameForm}
                error={forms.updateUsernameForm.formState.errors}
                formRegister={forms.updateUsernameForm.register}
                icon='/icons/personIcon.svg'
                iconError='/icons/personIconError.svg'
              />
            </div>
            <p className='mt-10 font-bold text-primary-900'>
              ¿Deseas cambiar tu correo electrónico?{' '}
            </p>
            <p className='mt-4 text-primary-900'>
              Ingresa y verifica el correo al que quieres vincular tu cuenta y
              redirigir todas nuestras comunicaciones.
            </p>
            <div className='mt-3 flex w-full flex-col items-center space-y-6 md:w-full md:flex-row  md:space-y-0'>
              <div className='w-full md:w-1/2'>
                <AuthInput
                  name='email'
                  placeholder='Correo electrónico'
                  type='text'
                  icon='/icons/mail.svg'
                  iconError='/icons/mailError.svg'
                  size={3}
                  form={forms.emailValidationForm}
                  formRegister={forms.emailValidationForm.register}
                  error={forms.emailValidationForm.formState.errors}
                />
              </div>
              <div className='relative inline-flex min-w-fit items-center'>
                <button
                  type='button'
                  onClick={() => submitHandlers.submitValidateEmail()}
                  disabled={mutations.emailValidationMutation.isLoading}
                  className={clsx(
                    'font-bold leading-none text-prudential-500 md:ml-6',
                    mutations.emailValidationMutation.isLoading && 'opacity-50'
                  )}
                >
                  Verificar correo
                </button>
              </div>
            </div>
            <p className='mt-10 font-bold text-primary-900'>
              Actualmente, tu número de celular es {currentUser?.phone_number}
            </p>
            <p className='mt-4 text-primary-900'>
              Ingresa y verifica el número de celular al que quieres vincular tu
              cuenta.
            </p>
            <div className='mt-3 flex w-full flex-col items-center space-y-6 md:w-full md:flex-row  md:space-y-0'>
              <div className='grid w-full grid-cols-12 place-content-center gap-2 gap-y-4 -space-y-px rounded-md md:w-1/2 md:gap-8'>
                <div
                  className={clsx(
                    'flex h-[58px] items-center space-x-2.5 border-b border-neutral-300 bg-neutral-50 ',
                    isXLDown ? 'col-span-4' : 'col-span-3'
                  )}
                >
                  <Image
                    src='/images/peruvianFlag.svg'
                    className='ml-3'
                    alt='check'
                    width={24}
                    height={24}
                  />
                  <span className='mt-0.5 text-center text-neutral-800'>
                    +51
                  </span>
                </div>
                <div className={clsx(isXLDown ? 'col-span-8' : 'col-span-9')}>
                  <AuthInput
                    name='phone_number'
                    type='number'
                    max={9}
                    form={forms.phoneValidationForm}
                    error={forms.phoneValidationForm.formState.errors}
                    formRegister={forms.phoneValidationForm.register}
                    centered
                    noWhiteSpace
                  />
                </div>
              </div>
              <div className='relative inline-flex min-w-fit items-center'>
                <button
                  type='button'
                  onClick={() => submitHandlers.submitValidatePhone()}
                  disabled={mutations.phoneValidationMutation.isLoading}
                  className={clsx(
                    'font-bold leading-none text-prudential-500 md:ml-6',
                    mutations.phoneValidationMutation.isLoading && 'opacity-50'
                  )}
                >
                  Verificar celular
                </button>
              </div>
            </div>
            <div className='flex space-x-5'>
              <button
                type='button'
                onClick={() => {
                  router.push(ContextRoutesEnum.PROFILE_UPDATE_PASSWORD);
                  state.setEditProfileStep(EditProfileStepEnum.UPDATE_PASSWORD);
                }}
                className={clsx(
                  'group relative mt-10 flex items-center justify-center rounded-full  border border-primary-100 bg-[#E2F4FF80] px-10 py-2.5 pb-2 text-[16px] font-semibold text-prudential-500 focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-[98%] md:px-10'
                )}
              >
                Cambiar contraseña
              </button>
              {currentUser?.exist_spectrum && (
                <button
                  type='button'
                  onClick={() => {
                    dispatch(toggleOpenedAnuallyUpdate(true));
                    router.push(
                      {
                        pathname: ContextRoutesEnum.NATURAL_CLIENT_FORM,
                        query: {
                          anually_update: true,
                          profile: true,
                        },
                      },
                      ContextRoutesEnum.NATURAL_CLIENT_FORM
                    );
                  }}
                  className={clsx(
                    'group relative  mt-10 flex items-center justify-center rounded-full  border border-primary-100 bg-[#E2F4FF80] px-10 py-2.5 pb-2 text-[16px] font-semibold text-prudential-500 focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-[98%] md:px-10'
                  )}
                >
                  Actualizar otros datos adicionales
                </button>
              )}
            </div>

            <div className='absolute left-0 mb-12 mt-12 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:mt-16 md:flex-row md:space-y-0'>
              <Button
                title='Cancelar'
                alternative
                noBorder
                handleClick={() => setOpenModalCancel(true)}
                className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
              />
              <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
                <Button
                  className='w-4/5 self-center !px-12 md:w-auto'
                  type='submit'
                  disabled={mutations.updateUsernameMutation.isLoading}
                  loader={mutations.updateUsernameMutation.isLoading}
                  title='Actualizar'
                />
              </div>
            </div>
          </form>
        )}
        {state.editProfileStep === EditProfileStepEnum.VALIDATE_EMAIL && (
          <form
            onSubmit={forms.updateEmailForm.handleSubmit(
              submitHandlers.submitUpdateEmail
            )}
            className='relative rounded-lg bg-white px-6 py-8 shadow-md'
          >
            <p className='text-xl font-bold leading-none text-primary-900'>
              Valida tu correo{' '}
            </p>
            <p className='mt-4 text-primary-900'>
              Ingresa el código enviado a{' '}
              <span className='font-bold'>
                {forms.updateEmailForm.getValues('email')}
              </span>
            </p>
            <div className='mt-3 w-full md:w-1/2'>
              <AuthInput
                name='code'
                placeholder='Código de verificación'
                type='number'
                size={4}
                max={5}
                form={forms.updateEmailForm}
                error={forms.updateEmailForm.formState.errors}
                formRegister={forms.updateEmailForm.register}
                icon='/icons/keyCode.svg'
                noWhiteSpace
              />
            </div>
            <button
              type='button'
              onClick={() => {
                forms.emailValidationForm.setValue(
                  'email',
                  forms.updateEmailForm.getValues('email')
                );
                submitHandlers.submitValidateEmail();
                notifyInfo({
                  title: 'Código reenviado',
                  Icon: MdOutlineMail,
                });
              }}
              disabled={mutations.emailValidationMutation.isLoading}
              className={clsx(
                'mt-5 font-bold leading-none text-prudential-500',
                mutations.emailValidationMutation.isLoading && 'opacity-50'
              )}
            >
              Volver a enviar
            </button>
            <div className='fixed bottom-0 left-0 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:absolute md:bottom-auto md:mb-12 md:mt-16 md:flex-row md:space-y-0'>
              <Button
                title='Cancelar'
                alternative
                noBorder
                handleClick={() => setOpenModalCancel(true)}
                className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
              />
              <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
                <Button
                  className='w-4/5 self-center !px-12 md:w-auto'
                  type='submit'
                  disabled={
                    mutations.updateEmailMutation.isLoading ||
                    Object.values(forms.updateEmailForm.getValues()).length !==
                      2 ||
                    forms.updateEmailForm.getValues('code').trim() === ''
                  }
                  loader={mutations.updateEmailMutation.isLoading}
                  title='Validar correo'
                />
              </div>
            </div>
          </form>
        )}
        {state.editProfileStep === EditProfileStepEnum.VALIDATE_PHONE && (
          <form
            onSubmit={forms.updatePhoneForm.handleSubmit(
              submitHandlers.submitUpdatePhone
            )}
            className='relative rounded-lg bg-white px-6 py-8 shadow-md'
          >
            <p className='text-xl font-bold leading-none text-primary-900'>
              Valida tu número de celular
            </p>
            <p className='mt-4 text-primary-900'>
              Ingresa el código enviado a{' '}
              <span className='font-bold'>
                {forms.updatePhoneForm.getValues('phone_number')}
              </span>
            </p>
            <div className='mt-3 w-full md:w-1/2'>
              <AuthInput
                name='code'
                placeholder='Código de verificación'
                type='number'
                size={4}
                max={5}
                form={forms.updatePhoneForm}
                error={forms.updatePhoneForm.formState.errors}
                formRegister={forms.updatePhoneForm.register}
                icon='/icons/keyCode.svg'
                noWhiteSpace
              />
            </div>
            <button
              onClick={() => {
                forms.phoneValidationForm.setValue(
                  'phone_number',
                  forms.updatePhoneForm.getValues('phone_number')
                );
                submitHandlers.submitValidatePhone();
                notifyInfo({
                  title: 'Código reenviado',
                  Icon: MdOutlinePhoneIphone,
                });
              }}
              type='button'
              disabled={mutations.phoneValidationMutation.isLoading}
              className={clsx(
                'mt-5 font-bold leading-none text-prudential-500',
                mutations.phoneValidationMutation.isLoading && 'opacity-50'
              )}
            >
              Volver a enviar
            </button>
            <div className='fixed bottom-0 left-0 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:absolute md:bottom-auto md:mb-12 md:mt-16 md:flex-row md:space-y-0'>
              <Button
                title='Cancelar'
                alternative
                noBorder
                handleClick={() => setOpenModalCancel(true)}
                className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
              />
              <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
                <Button
                  className='w-4/5 self-center !px-12 md:w-auto'
                  type='submit'
                  disabled={
                    mutations.updatePhoneMutation.isLoading ||
                    Object.values(forms.updatePhoneForm.getValues()).length !==
                      2 ||
                    forms.updatePhoneForm.getValues('code').trim() === ''
                  }
                  loader={mutations.updatePhoneMutation.isLoading}
                  title='Validar celular'
                />
              </div>
            </div>
          </form>
        )}
        {state.editProfileStep === EditProfileStepEnum.UPDATE_PASSWORD && (
          <form
            onSubmit={forms.updatePasswordForm.handleSubmit(
              submitHandlers.submitUpdatePassword
            )}
            className='relative rounded-lg bg-white px-6 py-8 shadow-md'
          >
            <p className='text-xl font-bold leading-none text-primary-900'>
              Cambia tu contraseña{' '}
            </p>
            <p className='my-4 text-primary-900'>
              Crea una nueva contraseña que cumpla con los siguientes criterios:{' '}
            </p>
            {validationComponent()}
            <div className='mt-8 flex w-full grow flex-col md:w-1/2'>
              <div className='rounded-md'>
                <AuthInput
                  name='password_current'
                  placeholder='Contraseña actual'
                  type='password'
                  form={forms.updatePasswordForm}
                  error={forms.updatePasswordForm.formState.errors}
                  formRegister={forms.updatePasswordForm.register}
                  noPadding
                />
                <br />
                <AuthInput
                  name='new_password'
                  placeholder='Nueva contraseña'
                  type='password'
                  form={forms.updatePasswordForm}
                  error={forms.updatePasswordForm.formState.errors}
                  formRegister={forms.updatePasswordForm.register}
                  noPadding
                />
                <br />
                <AuthInput
                  name='confirmation_password'
                  placeholder='Confirmar contraseña'
                  type='password'
                  form={forms.updatePasswordForm}
                  error={forms.updatePasswordForm.formState.errors}
                  formRegister={forms.updatePasswordForm.register}
                  noPadding
                />
              </div>
            </div>
            <div className='absolute left-0 mb-12 mt-12 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:mt-16 md:flex-row md:space-y-0'>
              <Button
                title='Cancelar'
                alternative
                noBorder
                handleClick={() => setOpenModalCancel(true)}
                className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
              />
              <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
                <Button
                  className='w-4/5 self-center !px-12 md:w-auto'
                  type='submit'
                  disabled={
                    mutations.updatePasswordMutation.isLoading ||
                    !forms.updatePasswordForm.formState.isValid ||
                    !isValid
                  }
                  loader={mutations.updatePasswordMutation.isLoading}
                  title='Cambiar contraseña'
                />
              </div>
            </div>
          </form>
        )}
        <Modal
          isOpen={openModalCancel}
          title={`¿Deseas cancelar ${
            state.editProfileStep === EditProfileStepEnum.UPDATE_PASSWORD
              ? 'el cambio'
              : 'la edición'
          } de tu ${
            state.editProfileStep === EditProfileStepEnum.VALIDATE_EMAIL
              ? 'correo'
              : state.editProfileStep === EditProfileStepEnum.EDIT_DATA
              ? 'información'
              : state.editProfileStep === EditProfileStepEnum.VALIDATE_PHONE
              ? 'número de celular'
              : state.editProfileStep === EditProfileStepEnum.UPDATE_PASSWORD &&
                'contraseña'
          }?`}
          setIsOpen={setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() => {
            if (
              Array.from([
                EditProfileStepEnum.VALIDATE_EMAIL,
                EditProfileStepEnum.VALIDATE_PHONE,
                EditProfileStepEnum.UPDATE_PASSWORD,
              ]).includes(state.editProfileStep)
            ) {
              router.push(ContextRoutesEnum.DASHBOARD);
              return;
            }
            router.back();
          }}
          extended
          modalLength={550}
          secondaryConfirmationText='Volver'
        >
          <p className='text-neutral-600'>
            Si cierras el proceso ahora, tu información no se guardará.
          </p>
        </Modal>
        <Modal
          isOpen={openModalInterrupt}
          title={`¿Deseas salir sin ${
            state.editProfileStep === EditProfileStepEnum.UPDATE_PASSWORD
              ? 'cambiar'
              : 'verificar'
          } tu ${
            state.editProfileStep === EditProfileStepEnum.VALIDATE_EMAIL
              ? 'correo'
              : state.editProfileStep === EditProfileStepEnum.VALIDATE_PHONE
              ? 'número de celular'
              : state.editProfileStep === EditProfileStepEnum.UPDATE_PASSWORD &&
                'contraseña'
          }?`}
          setIsOpen={setOpenModalInterrupt}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Aceptar'
          confirmationCustomFunction={() => {
            router.push(ContextRoutesEnum.DASHBOARD);
          }}
          extended
          modalLength={550}
          secondaryConfirmationText='Cancelar'
        >
          <p className='text-neutral-600'>
            Si cierras el proceso ahora, tu información no se guardará.
          </p>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

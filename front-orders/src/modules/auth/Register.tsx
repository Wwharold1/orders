/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Modal, notifyInfo, Spinner } from '@/common/components';
import { Input } from '@/common/components/Input';
import { Select } from '@/common/components/Select';
import {
  MediaQueryEnum,
  OriginTypeEnum,
  SpectrumDocumentType,
} from '@/common/enums';
import { hideEmail } from '@/common/helper/authHelper';
import {
  getSavedQueryParams,
  saveQueryParams,
} from '@/common/helper/queryParams';
import { useStateCallback } from '@/common/hooks';
import { useAppSelector } from '@/common/hooks/redux-hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { IDocumentTypeResponse } from '@/common/interfaces';
import { AuthLayout } from '@/layout/AuthLayout';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import {
  AuthCollaboratorTitleEnum,
  AuthRegisterTitleEnum,
} from '@/modules/auth/enums/register-title.enum';
import {
  CollaboratorRegisterStepEnum,
  RegisterStepEnum,
} from '@/modules/auth/helpers/registerSteps';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';
import { usePasswordValidation } from '@/modules/auth/hooks/usePasswordValidation';
import { IdentityValidationFacephi } from '@/modules/dashboard/modules/subscription/components/natural-client/IdentityValidationFacephi';
import { ClientInfoService } from '@/services/ClientInfoService';

export default function Register() {
  const {
    forms,
    submitHandlers,
    registerStep,
    currentEmail,
    loaders,
    isCollaborator: isCollaboratorTransformed,
    setRegisterStep,
    currentDNI,
    currentTypeDocument,
    modal,
  } = useAuthentication();
  const router = useRouter();
  const globalConfig = useAppSelector((state) => state.global);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] =
    useStateCallback<boolean>(false);
  const isXLDown = useMediaQuery(MediaQueryEnum.XL);
  const { validationComponent } = usePasswordValidation({
    forms: forms.passwordRegistrationForm,
    new_password: 'password',
    new_confirmation_password: 'password_confirmation',
    description: 'Crea una contraseña que cumpla con los siguientes criterios:',
  });

  const { data: typeDocumentData, isLoading: isLoadingTypeDocument } =
    useQuery<IDocumentTypeResponse>(['type-document-list'], () =>
      ClientInfoService().getDocumentType()
    );

  useEffect(() => {
    document.addEventListener('wheel', function () {
      if ((document.activeElement as any).type === 'number') {
        (document.activeElement as any).blur();
      }
    });
  }, [
    forms.passwordRegistrationForm.watch('accept_terms_conditions'),
    forms.passwordRegistrationForm.watch('password'),
    forms.passwordRegistrationForm.watch('password_confirmation'),
  ]);

  const isCollaborator = isCollaboratorTransformed === '1';

  useLayoutEffect(() => {
    if (forms.sendProspectForm.formState.dirtyFields.customer_fullname) {
      forms.sendProspectForm.trigger('customer_fullname');
    }
    if (forms.sendProspectForm.formState.dirtyFields.customer_email) {
      forms.sendProspectForm.trigger('customer_email');
    }
    if (forms.sendProspectForm.formState.dirtyFields.custoner_phone) {
      forms.sendProspectForm.trigger('custoner_phone');
    }
  }, [JSON.stringify(forms.sendProspectForm.getValues())]);

  useEffect(() => {
    if (router.query.validate) {
      setRegisterStep(RegisterStepEnum.EMAIL_REGISTRATION);
      forms.documentValidationForm.setValue('numIdentidad', currentDNI);
      forms.documentValidationForm.setValue(
        'tipoIdentidad',
        currentTypeDocument
      );
    }
    saveQueryParams(); //save query params in case exist
  }, []);

  //update password registration
  const handlePasswordRegistration = () => {
    const savedQueryParams = getSavedQueryParams();
    const uuid = uuidv4();

    if (savedQueryParams) {
      const { utm_source, utm_medium, utm_campaign } = savedQueryParams;
      if (utm_source)
        forms.passwordRegistrationForm.setValue('utm_source', utm_source);
      if (utm_medium)
        forms.passwordRegistrationForm.setValue('utm_medium', utm_medium);
      if (utm_campaign)
        forms.passwordRegistrationForm.setValue('utm_campaign', utm_campaign);
    }

    if (uuid) forms.passwordRegistrationForm.setValue('transac_id', uuid);
    forms.passwordRegistrationForm.setValue(
      'channel_register',
      OriginTypeEnum.WEB
    );

    submitHandlers.submitPasswordRegistration(
      forms.passwordRegistrationForm.getValues()
    );
  };

  return (
    <React.Fragment>
      <AuthLayout
        title={
          !isCollaborator
            ? AuthRegisterTitleEnum[
                registerStep as keyof typeof AuthRegisterTitleEnum
              ]
            : AuthCollaboratorTitleEnum[
                registerStep as keyof typeof AuthCollaboratorTitleEnum
              ]
        }
        imageRecover
        totalSteps={isCollaborator ? 5 : 7}
        imagePath='/images/registerImage.jpg'
        steps={registerStep}
        form={
          [
            RegisterStepEnum.DOCUMENT_VALIDATION,
            CollaboratorRegisterStepEnum.DOCUMENT_VALIDATION,
          ].includes(registerStep)
            ? forms.countryForm
            : null
        }
      >
        <div className='mt-10 flex flex-col space-y-2 px-4 font-bold  text-primary-900 md:px-14'>
          {registerStep === RegisterStepEnum.DOCUMENT_VALIDATION && (
            <p className='font-medium'>
              En caso seas una persona jurídica, por favor ingresa los datos del
              Representante Legal.
            </p>
          )}
          {((registerStep === RegisterStepEnum.EMAIL_VERIFICATION &&
            !isCollaborator) ||
            (registerStep ===
              CollaboratorRegisterStepEnum.OPEN_IDENTITY_VALIDATION &&
              isCollaborator)) && (
            <React.Fragment>
              <p className='font-medium'>
                Hemos enviado un correo de activación a
              </p>
              <div className='!mt-0 flex items-center space-x-2'>
                <p className='font-bold'>{hideEmail(currentEmail)}</p>
              </div>
              <p className='!mt-6 font-medium'>
                Si no lo encuentras en tu bandeja de entrada, recuerda revisar
                tu carpeta de Spam.
              </p>
            </React.Fragment>
          )}
          {/* {registerStep === RegisterStepEnum.NAME_VALIDATION &&
            !isCollaborator && (
              <p className='font-medium'>¿Cómo deseas que te llamemos?</p>
            )} */}
          {((registerStep === CollaboratorRegisterStepEnum.EMAIL_REGISTRATION &&
            isCollaborator) ||
            (registerStep === RegisterStepEnum.EMAIL_REGISTRATION &&
              !isCollaborator)) && (
            <p className='font-medium'>Ingresa tu correo electrónico</p>
          )}
          {registerStep === RegisterStepEnum.PHONE_VALIDATION &&
            !isCollaborator && (
              <p className='font-medium'>¿Cuál es tu número de celular?</p>
            )}
          {registerStep === RegisterStepEnum.PASSWORD_VALIDATION &&
            validationComponent()}
        </div>

        <React.Fragment>
          {isCollaborator && (
            <>
              {registerStep ===
                CollaboratorRegisterStepEnum.EMAIL_REGISTRATION && (
                <form
                  onSubmit={forms.updateEmailForm.handleSubmit(
                    submitHandlers.submitUpdateEmail
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='space-y-1.5 rounded-md'>
                    <AuthInput
                      name='email'
                      label='Correo electrónico'
                      placeholder='correo@ejemplo.com'
                      type='text'
                      icon='/icons/mail.svg'
                      size={3}
                      error={forms.updateEmailForm.formState.errors}
                      formRegister={forms.updateEmailForm.register}
                      form={forms.updateEmailForm}
                    />
                  </div>
                  <AuthButton
                    title='Registrar correo'
                    disabled={loaders.loadEditEmail}
                    loader={loaders.loadEditEmail}
                  />
                </form>
              )}
              {registerStep === RegisterStepEnum.DOCUMENT_VALIDATION && (
                <form
                  onSubmit={forms.documentValidationForm.handleSubmit(
                    submitHandlers.submitDocumentValidation
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                    <div className='relative col-span-12 md:col-span-3'>
                      {isLoadingTypeDocument ? (
                        <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                          <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                          <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                            <Spinner />
                          </div>
                        </div>
                      ) : (
                        <Select
                          keyDisplay='description'
                          keySearchCondition='code'
                          keySearchValue='description'
                          keyValue='code'
                          list={(typeDocumentData?.data as any) ?? []}
                          name='tipoIdentidad'
                          disabled={isLoadingTypeDocument}
                          onChange={(tipoIdentidad: string) => {
                            forms.documentValidationForm.setValue(
                              'tipoIdentidad',
                              tipoIdentidad
                            );
                            if (
                              forms.documentValidationForm.getValues(
                                'numIdentidad'
                              )
                            ) {
                              forms.documentValidationForm.resetField(
                                'numIdentidad'
                              );
                            }
                          }}
                          placeholder='Tipo de doc.'
                          form={forms.documentValidationForm}
                        />
                      )}
                    </div>
                    <div className='relative col-span-12 md:col-span-9'>
                      <Input
                        formRegister={forms.documentValidationForm.register}
                        error={forms.documentValidationForm.formState.errors}
                        name='numIdentidad'
                        placeholder='N.° de documento'
                        noPadding
                        noWhiteSpace
                        isLoading={isLoadingTypeDocument}
                        max={
                          forms.documentValidationForm.getValues(
                            'tipoIdentidad'
                          ) === SpectrumDocumentType.DNI
                            ? 8
                            : forms.documentValidationForm.getValues(
                                'tipoIdentidad'
                              ) === SpectrumDocumentType.RUC
                            ? 11
                            : 20
                        }
                        type={
                          Array.from([
                            SpectrumDocumentType.RUC,
                            SpectrumDocumentType.DNI,
                          ]).includes(
                            forms.documentValidationForm.getValues(
                              'tipoIdentidad'
                            ) as SpectrumDocumentType
                          )
                            ? 'number'
                            : 'alphanumeric'
                        }
                        form={forms.documentValidationForm}
                      />
                    </div>
                  </div>
                  <AuthButton
                    title='Continuar'
                    loader={loaders.loadDocumentValidation}
                    subButton
                    disabled={
                      loaders.loadDocumentValidation ||
                      !forms.documentValidationForm.formState.isDirty ||
                      !forms.documentValidationForm.formState.isValid
                    }
                    subButtonText='¿Ya tienes una cuenta?'
                    subButtonLink='/'
                    iconEnd='/icons/ArrowRight.svg'
                  />
                </form>
              )}
              {registerStep ===
                CollaboratorRegisterStepEnum.OPEN_IDENTITY_VALIDATION && (
                <form
                  onSubmit={forms.verifyForm.handleSubmit(
                    submitHandlers.submitVerify
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='space-y-1.5 rounded-md'>
                    <AuthInput
                      name='code'
                      placeholder='Código de verificación'
                      type='number'
                      size={4}
                      form={forms.verifyForm}
                      error={forms.verifyForm.formState.errors}
                      formRegister={forms.verifyForm.register}
                      icon='/icons/keyCode.svg'
                      noWhiteSpace
                    />
                  </div>
                  <p
                    className={clsx(
                      'mt-6 flex items-center self-start text-[16px] font-bold leading-6 text-[#0066CC]',
                      loaders.loadEmailValidation
                        ? 'pointer-events-none cursor-auto'
                        : 'pointer-events-auto cursor-pointer'
                    )}
                    onClick={() => {
                      if (!loaders.loadEmailValidation)
                        submitHandlers.submitSendEmail().then(() => {
                          notifyInfo({
                            subtitle: 'Correo reenviado',
                          });
                        });
                    }}
                  >
                    {loaders.loadEmailValidation && <Spinner />}
                    Volver a enviar
                  </p>
                  <AuthButton
                    title='Validar correo'
                    subButton
                    largeText
                    loader={loaders.loadVerifyEmail}
                    subButtonText='¿Ya tienes una cuenta?'
                    subButtonLink='/'
                  />
                </form>
              )}
              {registerStep === RegisterStepEnum.PHONE_VALIDATION && (
                <form
                  onSubmit={() => {
                    if (
                      forms.passwordRegistrationForm.getValues(
                        'phone_number'
                      ) !== ''
                    ) {
                      if (
                        !forms.passwordRegistrationForm.formState.errors
                          .phone_number
                      ) {
                        setRegisterStep(RegisterStepEnum.PASSWORD_VALIDATION);
                      }
                    }
                  }}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='grid grid-cols-12 place-content-center gap-2 gap-y-4  -space-y-px rounded-md md:gap-8'>
                    <div
                      className={clsx(
                        'flex h-[58px] items-center space-x-2.5 border-b border-neutral-300 bg-neutral-50 ',
                        isXLDown ? 'col-span-4' : 'col-span-2'
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
                    <div
                      className={clsx(
                        '',
                        isXLDown ? 'col-span-8' : 'col-span-10'
                      )}
                    >
                      <AuthInput
                        name='phone_number'
                        type='number'
                        max={9}
                        form={forms.passwordRegistrationForm}
                        error={forms.passwordRegistrationForm.formState.errors}
                        formRegister={forms.passwordRegistrationForm.register}
                        centered
                        noWhiteSpace
                      />
                    </div>
                  </div>
                  <div className='mt-10 flex grow flex-col items-center justify-end space-y-5 self-center justify-self-end px-4 md:px-14 '>
                    <AuthButton
                      title='Anterior'
                      largeText
                      alternative
                      customFunction={() => setRegisterStep(registerStep - 1)}
                      loader={loaders.loadVerifyEmail}
                      iconStart='/icons/ArrowLeft.svg'
                      grouped
                    />
                    <AuthButton
                      title='Continuar'
                      largeText
                      customFunction={() => {
                        forms.passwordRegistrationForm
                          .trigger('phone_number')
                          .then(() => {
                            if (
                              forms.passwordRegistrationForm.getValues(
                                'phone_number'
                              ) !== ''
                            ) {
                              if (
                                !forms.passwordRegistrationForm.formState.errors
                                  .phone_number
                              ) {
                                setRegisterStep(
                                  RegisterStepEnum.PASSWORD_VALIDATION
                                );
                              }
                            }
                          });
                      }}
                      disabled={loaders.loadVerifyEmail}
                      loader={loaders.loadVerifyEmail}
                      iconEnd='/icons/ArrowRight.svg'
                      grouped
                    />
                  </div>
                </form>
              )}
              {registerStep === RegisterStepEnum.PASSWORD_VALIDATION && (
                <form
                  onSubmit={forms.passwordRegistrationForm.handleSubmit(
                    handlePasswordRegistration
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='rounded-md'>
                    <AuthInput
                      name='password'
                      placeholder='Nueva contraseña'
                      type='password'
                      form={forms.passwordRegistrationForm}
                      error={forms.passwordRegistrationForm.formState.errors}
                      formRegister={forms.passwordRegistrationForm.register}
                      noPadding
                      noWhiteSpace
                    />
                    <br />
                    <AuthInput
                      name='password_confirmation'
                      placeholder='Confirmar contraseña'
                      type='password'
                      form={forms.passwordRegistrationForm}
                      error={forms.passwordRegistrationForm.formState.errors}
                      formRegister={forms.passwordRegistrationForm.register}
                      noPadding
                      noWhiteSpace
                    />
                  </div>
                  <div className='mt-10 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
                    <div className='flex space-x-3'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
                        {...forms.passwordRegistrationForm.register(
                          'accept_terms_conditions'
                        )}
                      />
                      <span className='text-primary-900'>
                        Acepto los
                        <a
                          href={globalConfig.terms_conditions}
                          target='_blank'
                          className='cursor-pointer font-bold text-primary-500'
                        >
                          {' '}
                          Términos y Condiciones
                        </a>{' '}
                        de PrudentialSAF Sociedad Administradora de Fondos S.A.C
                      </span>
                    </div>
                    <div className='flex space-x-3'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
                        {...forms.passwordRegistrationForm.register(
                          'accept_data_treatment'
                        )}
                      />
                      <span className='text-primary-900'>
                        Acepto el{' '}
                        <a
                          onClick={() => setOpenPrivacyPolicy(true)}
                          className='cursor-pointer font-bold text-primary-500'
                        >
                          tratamiento de datos personales
                        </a>{' '}
                        para fines adicionales (opcional)
                      </span>
                    </div>
                  </div>
                  <div className='mt-10 flex grow flex-col items-center justify-end space-y-5 self-center justify-self-end px-4 md:px-14 '>
                    <AuthButton
                      title='Anterior'
                      largeText
                      alternative
                      customFunction={() => setRegisterStep(registerStep - 1)}
                      loader={loaders.loadVerifyEmail}
                      iconStart='/icons/ArrowLeft.svg'
                      grouped
                    />
                    <AuthButton
                      title='Registrarme'
                      loader={loaders.loadPasswordRegistration}
                      disabled={
                        !forms.passwordRegistrationForm.formState.isDirty ||
                        loaders.loadPasswordRegistration ||
                        !forms.passwordRegistrationForm.formState.isValid
                      }
                      largeText
                      grouped
                    />
                  </div>
                </form>
              )}
            </>
          )}
          {!isCollaborator && (
            <>
              {registerStep === RegisterStepEnum.DOCUMENT_VALIDATION && (
                <form
                  onSubmit={forms.documentValidationForm.handleSubmit(
                    submitHandlers.submitDocumentValidation
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                    <div className='relative col-span-12 md:col-span-3'>
                      {isLoadingTypeDocument ? (
                        <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                          <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                          <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                            <Spinner />
                          </div>
                        </div>
                      ) : (
                        <Select
                          keyDisplay='description'
                          keySearchCondition='code'
                          keySearchValue='description'
                          keyValue='code'
                          list={(typeDocumentData?.data as any) ?? []}
                          name='tipoIdentidad'
                          disabled={isLoadingTypeDocument}
                          onChange={(tipoIdentidad: string) => {
                            forms.documentValidationForm.setValue(
                              'tipoIdentidad',
                              tipoIdentidad
                            );
                            if (
                              forms.documentValidationForm.getValues(
                                'numIdentidad'
                              )
                            ) {
                              forms.documentValidationForm.resetField(
                                'numIdentidad'
                              );
                            }
                          }}
                          placeholder='Tipo de doc.'
                          form={forms.documentValidationForm}
                        />
                      )}
                    </div>
                    <div className='relative col-span-12 md:col-span-9'>
                      <Input
                        formRegister={forms.documentValidationForm.register}
                        error={forms.documentValidationForm.formState.errors}
                        name='numIdentidad'
                        placeholder='N.° de documento'
                        noPadding
                        noWhiteSpace
                        isLoading={isLoadingTypeDocument}
                        max={
                          forms.documentValidationForm.getValues(
                            'tipoIdentidad'
                          ) === SpectrumDocumentType.DNI
                            ? 8
                            : forms.documentValidationForm.getValues(
                                'tipoIdentidad'
                              ) === SpectrumDocumentType.RUC
                            ? 11
                            : 20
                        }
                        type={
                          Array.from([
                            SpectrumDocumentType.RUC,
                            SpectrumDocumentType.DNI,
                          ]).includes(
                            forms.documentValidationForm.getValues(
                              'tipoIdentidad'
                            ) as SpectrumDocumentType
                          )
                            ? 'number'
                            : 'alphanumeric'
                        }
                        form={forms.documentValidationForm}
                      />
                    </div>
                  </div>
                  <AuthButton
                    title='Continuar'
                    loader={loaders.loadDocumentValidation}
                    subButton
                    disabled={
                      loaders.loadDocumentValidation ||
                      !forms.documentValidationForm.formState.isDirty ||
                      !forms.documentValidationForm.formState.isValid
                    }
                    subButtonText='¿Ya tienes una cuenta?'
                    subButtonLink='/'
                    iconEnd='/icons/ArrowRight.svg'
                  />
                </form>
              )}

              {registerStep === RegisterStepEnum.NAME_VALIDATION && (
                <form
                  onSubmit={() => {
                    forms.passwordRegistrationForm
                      .trigger('username')
                      .then(() => {
                        if (
                          !forms.passwordRegistrationForm.formState.errors
                            .username
                        ) {
                          setRegisterStep(RegisterStepEnum.PHONE_VALIDATION);
                        }
                      });
                  }}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='space-y-1.5 rounded-md'>
                    <AuthInput
                      name='username'
                      placeholder='Nombre'
                      type='text'
                      width={16}
                      size={3}
                      max={20}
                      left='left-3'
                      form={forms.passwordRegistrationForm}
                      error={forms.passwordRegistrationForm.formState.errors}
                      formRegister={forms.passwordRegistrationForm.register}
                      icon='/icons/personIcon.svg'
                      iconError='/icons/personIconError.svg'
                    />
                  </div>
                  <AuthButton
                    title='Continuar'
                    largeText
                    loader={loaders.loadVerifyEmail}
                    disabled={loaders.loadVerifyEmail}
                    iconEnd='/icons/ArrowRight.svg'
                  />
                </form>
              )}
              {registerStep === RegisterStepEnum.FACEPHI && (
                <div className='mt-10 flex grow flex-col px-4 md:px-14'>
                  <IdentityValidationFacephi
                    isInside={false}
                    dni={forms.documentValidationForm.getValues('numIdentidad')}
                    goBack={() =>
                      setRegisterStep(RegisterStepEnum.DOCUMENT_VALIDATION)
                    }
                    goNext={() => {
                      setRegisterStep(RegisterStepEnum.EMAIL_REGISTRATION);
                    }}
                    validation={true}
                  />
                </div>
              )}
              {registerStep === RegisterStepEnum.EMAIL_REGISTRATION && (
                <form
                  onSubmit={forms.registerEmailForm.handleSubmit(
                    submitHandlers.submitDocument
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <AuthInput
                    name='email'
                    placeholder='Correo electrónico'
                    type='text'
                    icon='/icons/mail.svg'
                    size={3}
                    form={forms.registerEmailForm}
                    error={forms.registerEmailForm.formState.errors}
                    formRegister={forms.registerEmailForm.register}
                  />
                  <AuthButton
                    title='Continuar'
                    loader={loaders.loadDocument}
                    subButton
                    disabled={
                      loaders.loadDocument ||
                      !forms.registerEmailForm.formState.isDirty ||
                      !forms.registerEmailForm.formState.isValid
                    }
                    subButtonText='¿Ya tienes una cuenta?'
                    subButtonLink='/'
                    iconEnd='/icons/ArrowRight.svg'
                  />
                </form>
              )}
              {registerStep === RegisterStepEnum.EMAIL_VERIFICATION && (
                <form
                  onSubmit={forms.verifyForm.handleSubmit(
                    submitHandlers.submitVerify
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='space-y-1.5 rounded-md'>
                    <AuthInput
                      name='code'
                      placeholder='Código de verificación'
                      type='number'
                      size={4}
                      form={forms.verifyForm}
                      error={forms.verifyForm.formState.errors}
                      formRegister={forms.verifyForm.register}
                      icon='/icons/keyCode.svg'
                      noWhiteSpace
                    />
                  </div>
                  <p
                    className={clsx(
                      'mt-6 flex items-center self-start text-[16px] font-bold leading-6 text-[#0066CC]',
                      loaders.loadEmailValidation
                        ? 'pointer-events-none cursor-auto'
                        : 'pointer-events-auto cursor-pointer'
                    )}
                    onClick={() => {
                      if (!loaders.loadEmailValidation)
                        submitHandlers.submitSendEmail();
                    }}
                  >
                    {loaders.loadEmailValidation && <Spinner />}
                    Volver a enviar
                  </p>
                  <AuthButton
                    title='Validar correo'
                    subButton
                    largeText
                    loader={loaders.loadVerifyEmail}
                    subButtonText='¿Ya tienes una cuenta?'
                    subButtonLink='/'
                  />
                </form>
              )}
              {registerStep === RegisterStepEnum.PHONE_VALIDATION && (
                <form
                  onSubmit={() => {
                    if (
                      forms.passwordRegistrationForm.getValues(
                        'phone_number'
                      ) !== ''
                    ) {
                      if (
                        !forms.passwordRegistrationForm.formState.errors
                          .phone_number
                      ) {
                        setRegisterStep(RegisterStepEnum.PASSWORD_VALIDATION);
                      }
                    }
                  }}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='grid grid-cols-12 place-content-center gap-2 gap-y-4  -space-y-px rounded-md md:gap-8'>
                    <div
                      className={clsx(
                        'flex h-[58px] items-center space-x-2.5 border-b border-neutral-300 bg-neutral-50 ',
                        isXLDown ? 'col-span-4' : 'col-span-2'
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
                    <div
                      className={clsx(
                        '',
                        isXLDown ? 'col-span-8' : 'col-span-10'
                      )}
                    >
                      <AuthInput
                        name='phone_number'
                        type='number'
                        max={9}
                        form={forms.passwordRegistrationForm}
                        error={forms.passwordRegistrationForm.formState.errors}
                        formRegister={forms.passwordRegistrationForm.register}
                        centered
                        noWhiteSpace
                      />
                    </div>
                  </div>
                  <div className='mt-10 flex grow flex-col items-center justify-end space-y-5 self-center justify-self-end px-4 md:px-14 '>
                    <AuthButton
                      title='Anterior'
                      largeText
                      alternative
                      customFunction={() =>
                        setRegisterStep(RegisterStepEnum.FACEPHI)
                      }
                      loader={loaders.loadVerifyEmail}
                      iconStart='/icons/ArrowLeft.svg'
                      grouped
                    />
                    <AuthButton
                      title='Continuar'
                      largeText
                      customFunction={() => {
                        forms.passwordRegistrationForm
                          .trigger('phone_number')
                          .then(() => {
                            if (
                              forms.passwordRegistrationForm.getValues(
                                'phone_number'
                              ) !== ''
                            ) {
                              if (
                                !forms.passwordRegistrationForm.formState.errors
                                  .phone_number
                              ) {
                                setRegisterStep(
                                  RegisterStepEnum.PASSWORD_VALIDATION
                                );
                              }
                            }
                          });
                      }}
                      disabled={loaders.loadVerifyEmail}
                      loader={loaders.loadVerifyEmail}
                      iconEnd='/icons/ArrowRight.svg'
                      grouped
                    />
                  </div>
                </form>
              )}
              {registerStep === RegisterStepEnum.PASSWORD_VALIDATION && (
                <form
                  onSubmit={forms.passwordRegistrationForm.handleSubmit(
                    handlePasswordRegistration
                  )}
                  className='mt-10 flex grow flex-col px-4 md:px-14'
                >
                  <div className='rounded-md'>
                    <AuthInput
                      name='password'
                      placeholder='Nueva contraseña'
                      type='password'
                      form={forms.passwordRegistrationForm}
                      error={forms.passwordRegistrationForm.formState.errors}
                      formRegister={forms.passwordRegistrationForm.register}
                      noPadding
                      noWhiteSpace
                    />
                    <br />
                    <AuthInput
                      name='password_confirmation'
                      placeholder='Confirmar contraseña'
                      type='password'
                      form={forms.passwordRegistrationForm}
                      error={forms.passwordRegistrationForm.formState.errors}
                      formRegister={forms.passwordRegistrationForm.register}
                      noPadding
                      noWhiteSpace
                    />
                  </div>
                  <div className='mt-10 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
                    <div className='flex space-x-3'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
                        {...forms.passwordRegistrationForm.register(
                          'accept_terms_conditions'
                        )}
                      />
                      <span className='text-primary-900'>
                        Acepto los
                        <a
                          href={globalConfig.terms_conditions}
                          target='_blank'
                          className='cursor-pointer font-bold text-primary-500'
                        >
                          {' '}
                          Términos y Condiciones
                        </a>{' '}
                        de PrudentialSAF Sociedad Administradora de Fondos S.A.C
                      </span>
                    </div>
                    <div className='flex space-x-3'>
                      <input
                        type='checkbox'
                        className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
                        {...forms.passwordRegistrationForm.register(
                          'accept_data_treatment'
                        )}
                      />
                      <span className='text-primary-900'>
                        Acepto el{' '}
                        <a
                          onClick={() => setOpenPrivacyPolicy(true)}
                          className='cursor-pointer font-bold text-primary-500'
                        >
                          tratamiento de datos personales
                        </a>{' '}
                        para fines adicionales (opcional)
                      </span>
                    </div>
                  </div>
                  <p>{forms.passwordRegistrationForm.formState.isDirty}</p>
                  <p>{loaders.loadPasswordRegistration}</p>
                  <p>{forms.passwordRegistrationForm.formState.isValid}</p>
                  <div className='mt-10 flex grow flex-col items-center justify-end space-y-5 self-center justify-self-end px-4 md:px-14 '>
                    <AuthButton
                      title='Anterior'
                      largeText
                      alternative
                      customFunction={() => setRegisterStep(registerStep - 1)}
                      loader={loaders.loadVerifyEmail}
                      iconStart='/icons/ArrowLeft.svg'
                      grouped
                    />

                    <AuthButton
                      title='Registrarme'
                      loader={loaders.loadPasswordRegistration}
                      disabled={
                        !forms.passwordRegistrationForm.formState.isDirty ||
                        loaders.loadPasswordRegistration ||
                        !forms.passwordRegistrationForm.formState.isValid
                      }
                      largeText
                      grouped
                    />
                  </div>
                </form>
              )}
            </>
          )}
        </React.Fragment>
        <Modal
          urlIcon='/icons/info.svg'
          isOpen={openPrivacyPolicy}
          setIsOpen={setOpenPrivacyPolicy}
          confirmationText='Entendido'
          extended
          rounded={false}
        >
          <p className=''>
            Autorizo voluntariamente que PrudentialSAF Sociedad Administradora
            de <br /> Fondos S.A.C realice tratamiento de mis datos personales,
            con fines de <br /> envío de publicidad sobre los productos y
            servicios de la compañía y de <br /> aquellas que forman parte de su
            grupo económico, de conformidad con <br /> su
            <a
              className='font-bold text-primary-500'
              href={globalConfig.privacy_policy}
              target='_blank'
            >
              {' '}
              Política de Privacidad.
            </a>
          </p>
        </Modal>
        <Modal
          urlIcon='/icons/warningInfo.svg'
          isOpen={modal.openFormDocument}
          setIsOpen={modal.setOpenFormDocument}
          closeOnTouchOutside={false}
          confirmationText='Enviar mi información'
          confirmationCustomFunction={() => {
            forms.sendProspectForm.trigger();
            if (forms.sendProspectForm.formState.isValid) {
              submitHandlers.submitSendProspect(
                forms.sendProspectForm.getValues()
              );
            }
          }}
          secondaryConfirmationText='Cancelar'
          secondaryCustomFunction={() => {
            forms.sendProspectForm.reset();
            modal.setOpenFormDocument(false);
          }}
          closeOnSaved={false}
          extended
          disabledPrimary={loaders.loadSendProspect}
          rounded={false}
        >
          <p className='text-xl font-bold text-primary-900'>
            Si eliges este tipo de documento te contactaremos con un ejecutivo
            para continuar con tu registro
          </p>
          <p className='mt-4 text-justify text-primary-900'>
            Para continuar el proceso, debes completar la siguiente información
            y un asesor de inversiones se pondrá en contacto contigo en un plazo
            máximo de 48 horas hábiles.{' '}
          </p>
          <form
            onSubmit={forms.sendProspectForm.handleSubmit(
              submitHandlers.submitSendProspect
            )}
          >
            <div className='flex flex-col space-y-3'>
              <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
                <div className='relative col-span-12 md:col-span-4'>
                  {isLoadingTypeDocument ? (
                    <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                      <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                      <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                        <Spinner />
                      </div>
                    </div>
                  ) : (
                    <Select
                      keyDisplay='description'
                      keySearchCondition='code'
                      keySearchValue='description'
                      keyValue='code'
                      list={(typeDocumentData?.data as any) ?? []}
                      name='document_type'
                      disabled={true}
                      onChange={(tipoIdentidad: string) => {
                        forms.sendProspectForm.setValue(
                          'document_type',
                          tipoIdentidad
                        );
                        if (forms.sendProspectForm.getValues('document_type')) {
                          forms.sendProspectForm.resetField('document_type');
                        }
                      }}
                      placeholder='Tipo de doc.'
                      form={forms.sendProspectForm}
                    />
                  )}
                </div>
                <div className='relative col-span-12 text-start md:col-span-8'>
                  <Input
                    formRegister={forms.sendProspectForm.register}
                    error={forms.sendProspectForm.formState.errors}
                    name='number_document'
                    placeholder='N.° de documento'
                    noPadding
                    noWhiteSpace
                    isLoading={isLoadingTypeDocument}
                    max={
                      forms.sendProspectForm.getValues('document_type') ===
                      SpectrumDocumentType.DNI
                        ? 8
                        : forms.sendProspectForm.getValues('document_type') ===
                          SpectrumDocumentType.RUC
                        ? 11
                        : 20
                    }
                    type={
                      Array.from([
                        SpectrumDocumentType.RUC,
                        SpectrumDocumentType.DNI,
                      ]).includes(
                        forms.sendProspectForm.getValues(
                          'document_type'
                        ) as SpectrumDocumentType
                      )
                        ? 'number'
                        : 'alphanumeric'
                    }
                    form={forms.sendProspectForm}
                  />
                </div>
              </div>
              <div className='justify-start text-start'>
                <AuthInput
                  name='customer_fullname'
                  placeholder='Nombres y apellidos'
                  type='text'
                  width={16}
                  size={3}
                  max={50}
                  left='left-3'
                  noPadding
                  form={forms.sendProspectForm}
                  error={forms.sendProspectForm.formState.errors}
                  formRegister={forms.sendProspectForm.register}
                />
              </div>
              <div className='mb-3 justify-start text-start'>
                <AuthInput
                  name='customer_email'
                  placeholder='Correo electrónico'
                  type='text'
                  size={3}
                  error={forms.sendProspectForm.formState.errors}
                  formRegister={forms.sendProspectForm.register}
                  form={forms.sendProspectForm}
                  noPadding
                  noWhiteSpace
                />
              </div>

              <div className='justify-start text-start'>
                <AuthInput
                  name='custoner_phone'
                  type='number'
                  max={9}
                  placeholder='Nro. de celular'
                  form={forms.sendProspectForm}
                  error={forms.sendProspectForm.formState.errors}
                  formRegister={forms.sendProspectForm.register}
                  noPadding
                  noWhiteSpace
                />
              </div>
            </div>
          </form>
        </Modal>
      </AuthLayout>
    </React.Fragment>
  );
}

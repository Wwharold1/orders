/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { Modal } from '@/common/components/Modal';
import { OriginTypeEnum } from '@/common/enums';
import { getSavedQueryParams } from '@/common/helper/queryParams';
import { useAppSelector, useStateCallback } from '@/common/hooks';
import { AuthLayout } from '@/layout/AuthLayout';
import { AuthButton } from '@/modules/auth/components/AuthButton';
import { AuthInput } from '@/modules/auth/components/AuthInput';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';

interface IProps {
  createPasswordForm: UseFormReturn<
    {
      email: string;
      password: string;
      passwordConfirmation: string;
      hash_security: string;
      accept_terms_conditions: boolean;
      accept_data_treatment: boolean;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      channel_register?: string;
      transac_id?: string;
    },
    any
  >;
  functions?: any;
}

export default function RegisterCreationPassword({
  createPasswordForm,
  functions,
}: IProps) {
  const [openPrivacyPolicy, setOpenPrivacyPolicy] =
    useStateCallback<boolean>(false);
  const globalConfig = useAppSelector((state) => state.global);

  const {
    submitHandlers,
    loaders: { loadCreatePassword },
    modal,
  } = useAuthentication();

  const handleSubmit = () => {
    const savedQueryParams = getSavedQueryParams();
    const uuid = uuidv4();

    if (savedQueryParams) {
      const { utm_source, utm_medium, utm_campaign } = savedQueryParams;
      if (utm_source) createPasswordForm.setValue('utm_source', utm_source);
      if (utm_medium) createPasswordForm.setValue('utm_medium', utm_medium);
      if (utm_campaign)
        createPasswordForm.setValue('utm_campaign', utm_campaign);
    }

    if (uuid) createPasswordForm.setValue('transac_id', uuid);
    createPasswordForm.setValue('channel_register', OriginTypeEnum.WEB);

    submitHandlers.submitCreatePassword(createPasswordForm.getValues());
  };

  return (
    <React.Fragment>
      <AuthLayout
        title={
          !createPasswordForm.formState.errors.root?.message?.includes(
            'confirmado'
          )
            ? 'Asegura tu cuenta'
            : '¡Todo listo!'
        }
        imagePath='/images/registerImage.jpg'
      >
        <div className='mt-10 flex flex-col space-y-2 px-4 font-bold text-neutral-800 hover:text-neutral-800 md:px-14'>
          {!createPasswordForm.formState.errors.root?.message?.includes(
            'confirmado'
          )
            ? functions.validationComponent()
            : createPasswordForm.formState.errors.root?.message?.includes(
                'confirmado'
              ) && (
                <React.Fragment>
                  <p className='font-medium'>
                    Registramos tu usuario con éxito.
                  </p>
                  <p className='font-medium'>
                    Hazle seguimiento a tus inversiones revisando tu Estado de
                    Cuenta.
                  </p>
                </React.Fragment>
              )}
        </div>
        {!createPasswordForm.formState.errors.root?.message?.includes(
          'confirmado'
        ) && createPasswordForm ? (
          <form
            onSubmit={createPasswordForm?.handleSubmit(handleSubmit)}
            className='mt-8 flex grow flex-col px-4 md:px-14'
          >
            <div className='space-y- rounded-md'>
              <AuthInput
                name='password'
                placeholder='Nueva contraseña'
                type='password'
                noPadding
                noWhiteSpace
                error={createPasswordForm?.formState.errors}
                formRegister={createPasswordForm?.register}
                form={createPasswordForm}
              />
              <br />
              <AuthInput
                name='passwordConfirmation'
                placeholder='Confirmar contraseña'
                type='password'
                error={createPasswordForm?.formState.errors}
                formRegister={createPasswordForm?.register}
                form={createPasswordForm}
                noPadding
                noWhiteSpace
              />
            </div>

            <div className='mt-10 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
              <div className='flex space-x-3'>
                <input
                  type='checkbox'
                  className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
                  {...createPasswordForm.register('accept_terms_conditions')}
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
                  {...createPasswordForm.register('accept_data_treatment')}
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
            {createPasswordForm.getValues('accept_terms_conditions') !==
              true && (
              <span className='mt-1 flex flex-col text-xs text-secondary-900'>
                Por favor acepte los términos y condiciones
              </span>
            )}

            <AuthButton title='Activar cuenta' loader={loadCreatePassword} />
          </form>
        ) : (
          createPasswordForm.formState.errors.root?.message?.includes(
            'confirmado'
          ) && <AuthButton title='Ir al inicio de sesión' link='/' />
        )}
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

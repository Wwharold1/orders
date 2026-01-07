/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import Image from 'next/image';
import router from 'next/router';
import React, { FC, useEffect } from 'react';

import { Button, IconDelete, Modal, Spinner } from '@/common/components';
import { IconSchedule } from '@/common/components/icons/subscription/IconSchedule';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { IconDangerFill } from '@/common/components/icons/utils/IconDangerFill';
import { Input } from '@/common/components/Input';
import { ContextRoutesEnum } from '@/common/enums';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { TabInvestmentSubscriptionEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setInvestmentTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';

interface IProps {
  modal: (state: boolean, cb?: ((state: boolean) => void) | undefined) => void;
  currentImage: any;
  setCurrentImage: any;
  imageDimensions: any;
  useInvestmentInstance: any;
  isLoading: boolean;
}

export const InvestmentReceipt: FC<IProps> = ({
  modal: modalCancel,
  currentImage,
  setCurrentImage,
  imageDimensions,
  useInvestmentInstance,
  isLoading: isLoadingParent,
}) => {
  const [
    forms,
    mutations,
    modal,
    setInvestmentFormData,
    getInvestmentFormData,
  ] = useInvestmentInstance;
  const dispatch = useAppDispatch();
  const currentSubscription = useAppSelector(
    (state) => state.subscription.currentSubscription
  );
  const minAmounInvestment = useAppSelector(
    (state) => state.subscription.amountMinInversion
  );

  const currentFund = useAppSelector((state) => state.subscription.currentFund);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const currentCollector = useAppSelector(
    (state) => state.subscription.currentCollector
  );

  const handleSubmitForm = () => {
    modal.setOnDisabledModal(true);
    const formValues = forms.createPaymentForm.getValues();
    setInvestmentFormData(formValues);
    router.push({
      pathname: ContextRoutesEnum.BIOMETRIC_VALIDATION,
    });
  };

  useEffect(() => {
    const investmentFormData = getInvestmentFormData();
    if (!investmentFormData.suscription_id) return;
    forms.createPaymentForm.setValue('file', investmentFormData.file);
    forms.createPaymentForm.setValue(
      'operation_number',
      investmentFormData.operation_number
    );
  }, []);

  return (
    <div>
      <div className='mt-8 grid grid-cols-12 gap-0 pb-20 text-primary-900 md:gap-10 lg:gap-16'>
        <div className='col-span-12 md:col-span-6 lg:col-span-8'>
          <div className='text-primary-900'>
            <h1 className='text-lg font-bold leading-none md:text-xl'>
              Datos de tu constancia{' '}
            </h1>
            <p className='mt-4 leading-none'>
              Por favor, ingresa el número de tu operación.{' '}
            </p>
          </div>
          <div className='mt-10'>
            {isLoadingParent ? (
              <div className='relative animate-pulse rounded-[4px] bg-gradient-to-br text-white'>
                <div className='h-14 w-full rounded-sm bg-neutral-100'></div>
                <div className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                  <Spinner />
                </div>
              </div>
            ) : (
              <Input
                formRegister={forms.createPaymentForm.register}
                error={forms.createPaymentForm.formState.errors}
                name='operation_number'
                placeholder='N.° de operación'
                noPadding
                noWhiteSpace
                type='number'
                max={20}
                form={forms.createPaymentForm}
              />
            )}
          </div>
          {!currentImage && (
            <div className='mt-10 flex flex-col items-center justify-center gap-5 self-stretch rounded-lg border border-dashed border-primary-200 p-6'>
              <svg
                width='57'
                height='56'
                viewBox='0 0 57 56'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g id='receipt_long'>
                  <g id='Vector'>
                    <path
                      d='M46.168 8.16699L42.668 4.66699L39.168 8.16699L35.668 4.66699L32.168 8.16699L28.668 4.66699L25.168 8.16699L21.668 4.66699L18.168 8.16699L14.668 4.66699V37.3337H7.66797V44.3337C7.66797 48.207 10.7946 51.3337 14.668 51.3337H42.668C46.5413 51.3337 49.668 48.207 49.668 44.3337V4.66699L46.168 8.16699ZM35.668 46.667H14.668C13.3846 46.667 12.3346 45.617 12.3346 44.3337V42.0003H35.668V46.667ZM45.0013 44.3337C45.0013 45.617 43.9513 46.667 42.668 46.667C41.3846 46.667 40.3346 45.617 40.3346 44.3337V37.3337H19.3346V11.667H45.0013V44.3337Z'
                      fill='#007BC3'
                    />
                    <path
                      d='M35.668 16.3337H21.668V21.0003H35.668V16.3337Z'
                      fill='#007BC3'
                    />
                    <path
                      d='M42.668 16.3337H38.0013V21.0003H42.668V16.3337Z'
                      fill='#007BC3'
                    />
                    <path
                      d='M35.668 23.3337H21.668V28.0003H35.668V23.3337Z'
                      fill='#007BC3'
                    />
                    <path
                      d='M42.668 23.3337H38.0013V28.0003H42.668V23.3337Z'
                      fill='#007BC3'
                    />
                  </g>
                </g>
              </svg>
              <div className='flex flex-col items-center justify-center'>
                <h1 className='font-bold'>Sube tu comprobante</h1>
                <p className='mt-1 text-sm text-neutral-500'>JPG, PNG</p>
              </div>
              <input
                type='file'
                className='hidden'
                id='input-file'
                accept='image/jpg, image/png'
                {...forms.createPaymentForm.register('file')}
              />
              <Button
                alternative
                title='Seleccionar archivo'
                handleClick={() =>
                  document.getElementById('input-file')?.click()
                }
                className='!px-5'
                loader={isLoadingParent}
              />
            </div>
          )}

          {currentImage && (
            <div className='relative'>
              <div
                onClick={() => {
                  forms.createPaymentForm.setValue('file', []);
                  setCurrentImage('');
                }}
                className=' absolute bottom-4 right-4 z-[2] flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center gap-1 rounded border-[0.75px] border-solid border-neutral-100 bg-neutral-50 p-2'
              >
                <IconDelete fill='#007BC3' />
              </div>
              <div className='no-scrollbar relative mt-10 flex max-h-80 flex-col gap-5 self-stretch overflow-y-auto rounded-lg border border-dashed border-primary-200 p-6 px-6 py-8'>
                <div className='relative'>
                  <Image
                    className='z-[1]'
                    src={currentImage}
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                    alt='image'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='col-span-12 mt-10 rounded-lg md:col-span-6 md:mt-0 lg:col-span-4'>
          <div className='border border-neutral-100 px-4 py-6'>
            <div className='border-b border-neutral-200 pb-6'>
              <h1 className='text-xl font-bold leading-none'>
                Resumen de tu inversión
              </h1>
              <p className='mt-3 text-base text-neutral-500 md:text-sm'>
                Tu Entidad Bancaria podría cobrarte comisiones o recargos al
                realizar esta operación.
              </p>
            </div>
            <div className='mt-6 border-b border-neutral-100 pb-6'>
              <div className='flex items-center space-x-2'>
                <h1 className='text-[28px] font-bold text-primary-900'>
                  {currentFund?.spectrumFund.moneda}{' '}
                  {Number(currentSubscription?.amount).toFixed(2)}
                </h1>
                {forms.createSubscriptionForm.formState.errors.amount && (
                  <IconDangerFill className='mb-1.5' />
                )}
              </div>
              <p
                className={clsx(
                  'flex text-sm font-bold',
                  forms.createSubscriptionForm.formState.errors.amount
                    ? 'text-terciary-900'
                    : 'text-neutral-300'
                )}
              >
                INVERSIÓN MÍNIMA: {minAmounInvestment?.moneda}{' '}
                {minAmounInvestment?.amount_min_inversion?.toFixed(2)}
              </p>
            </div>
            <div className='mt-6 border-b border-neutral-100 pb-6'>
              <h1 className='text-xl font-bold leading-none text-teal-terciary'>
                {currentFund?.title}
              </h1>
              <p className='mt-1.5 text-sm text-teal-terciary'>
                {currentUser?.serie.name}
              </p>
            </div>
            <div className='mt-6'>
              <h1 className='font-bold leading-none'>
                {currentCollector?.bank.description}
              </h1>
            </div>
          </div>
          <div className='relative mt-6 border border-primary-50 bg-[#E2F4FF4D] px-3 py-4'>
            <IconSchedule className='absolute' />
            <p className='indent-5 text-sm text-primary-900'>
              Tienes hasta el final del día para poder subir el voucher de la
              transferencia, de lo contrario será cancelada.
            </p>
          </div>
        </div>
      </div>
      <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
        <Button
          title='Cancelar'
          alternative
          noBorder
          disabled={mutations.paymentMutation.isLoading}
          handleClick={() => modalCancel(true)}
          className='order-2 mt-4 hidden w-full md:order-none md:mt-0 md:block md:w-auto'
        />
        <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            iconStart='/icons/ArrowLeft.svg'
            alternative
            handleClick={() =>
              dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.BANKS))
            }
            title='Anterior'
            disabled={mutations.paymentMutation.isLoading || isLoadingParent}
          />
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            handleClick={() => {
              modal.setOpenModalPayment(true);
            }}
            disabled={
              (forms.createPaymentForm.getValues('operation_number')
                ? forms.createPaymentForm
                    .getValues('operation_number')
                    .includes(' ')
                : true) ||
              Object.values(forms.createPaymentForm.getValues()).includes('') ||
              !Array.from(forms.createPaymentForm.getValues('file')).length ||
              mutations.paymentMutation.isLoading ||
              isLoadingParent
            }
            loader={mutations.paymentMutation.isLoading}
            title='Confirmar inversión'
          />
        </div>
      </div>
      <Modal
        isOpen={modal.openModalPayment}
        setIsOpen={modal.setOpenModalPayment}
        customIcon={<IconDanger className='mb-1' />}
        modalLength={450}
        closeOnTouchOutside={false}
        confirmationText='Aceptar'
        confirmationCustomFunction={handleSubmitForm}
        closeOnSaved={false}
        disabledPrimary={modal.onDisabledModal}
      >
        <span className='text-neutral-600'>
          En caso realices una transferencia interbancaria, tener en cuenta que
          para la asignación del Valor Cuota se considerará la fecha y hora en
          la que el dinero se refleja en nuestra cuenta bancaria.
        </span>
      </Modal>
    </div>
  );
};

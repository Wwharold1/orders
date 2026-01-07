/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';
import { SwiperSlide } from 'swiper/react';

import { Button } from '@/common/components';
import { Carousel } from '@/common/components/Carousel';
import { IconWallet } from '@/common/components/icons/rescue/IconWallet';
import IconInfo from '@/common/components/icons/utils/IconInfo';
import { Tooltip } from '@/common/components/Tooltip';
import { MediaQueryEnum } from '@/common/enums';
import { convertAmount } from '@/common/helper';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { RescueTypeEnum } from '@/common/interfaces/rescue.interface';
import { BankAccountCard } from '@/modules/accounts/components/BankAccountCard';
import { TCreateRescueForm } from '@/modules/rescue/helpers/rescueValidationSchemas';
import { useRescue } from '@/modules/rescue/hooks/useRescue';
import { setRescueTab } from '@/modules/rescue/slice/rescueLayoutSlice';

interface IProps {
  modal: (state: boolean, cb?: ((state: boolean) => void) | undefined) => void;
}

export const RescueAccount: FC<IProps> = ({ modal }) => {
  const { mutations, submitHandlers } = useRescue();
  const isMdUp = useMediaQuery(MediaQueryEnum.MD);
  const dispatch = useAppDispatch();
  const { rescueDetail, currentRescue } = useAppSelector(
    (state) => state.rescue
  );
  const currentFund = useAppSelector((state) => state.rescue.currentFund);
  const currentUser = useAppSelector((state) => state.session.currentUser);

  return (
    <div>
      <div className='mt-8 grid grid-cols-12 gap-0 pb-20 text-primary-900'>
        <div className='no-scrollbar col-span-12 md:col-span-6 md:max-h-[800px] md:overflow-auto md:pr-10 lg:col-span-8 lg:max-h-full lg:overflow-hidden lg:pr-16'>
          <div className='text-primary-900'>
            <h1 className='text-lg font-bold leading-none md:text-xl'>
              Seleccionar cuenta{' '}
            </h1>
            <p className='mt-4 leading-none'>
              Recuerda que el rescate debe hacerse a una cuenta asociada a tu
              número de documento, de lo contrario, la transacción será
              rechazada.{' '}
            </p>
          </div>

          <div className='mt-10 rounded-lg border border-neutral-100 p-4 font-bold'>
            <h1 className='uppercase text-primary-500'>
              Datos del solicitante
            </h1>
            <p className='mt-3 '>
              {(`${currentUser?.name.trim()} ` || '') +
                (currentUser?.middlename
                  ? `${currentUser?.middlename} `
                  : ' ') +
                (currentUser?.surname ? `${currentUser?.surname} ` : ' ') +
                ' ' +
                currentUser?.lastname.trim()}{' '}
            </p>
            <p>
              {currentUser?.document_type} {currentUser?.number_document}
            </p>
          </div>

          <div className='mt-6 md:mt-10'>
            {isMdUp && rescueDetail?.bank_accounts ? (
              <Carousel onlyOne items={rescueDetail?.bank_accounts?.length}>
                {rescueDetail?.bank_accounts?.map((bank, index) => {
                  return (
                    <>
                      <SwiperSlide className='pt-4' key={index + 2}>
                        <BankAccountCard
                          rescue
                          bankAccount={bank}
                          key={index + 2}
                        />
                      </SwiperSlide>
                    </>
                  );
                })}
              </Carousel>
            ) : (
              !isMdUp &&
              rescueDetail?.bank_accounts && (
                <div className='grid grid-cols-12 gap-6'>
                  {rescueDetail?.bank_accounts?.map((bank, index) => {
                    return (
                      <BankAccountCard rescue bankAccount={bank} key={index} />
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
        <div className='sticky col-span-12 mt-10 rounded-lg md:col-span-6 md:mt-0 lg:col-span-4'>
          <div className='border border-neutral-100 px-4 py-6'>
            <div className='border-b border-neutral-200 pb-6'>
              <h1 className='text-xl font-bold leading-none'>
                Resumen de tu rescate{' '}
              </h1>
              <p className='mt-3 text-base text-neutral-500 md:text-sm'>
                El dinero será abonado a tu cuenta entre 2 a 10 días hábiles
                como máximo.
              </p>
            </div>
            <div className='mt-6 border-b border-neutral-100 pb-6'>
              <div className='flex flex-col items-start'>
                <h1 className='text-sm font-bold uppercase leading-none text-neutral-300'>
                  Total (aprox.)
                </h1>
                <h1 className='text-[28px] font-bold text-primary-900'>
                  {currentFund?.spectrumFund.moneda}{' '}
                  {convertAmount(Number(currentRescue?.amount))}
                </h1>
                <div className='mt-3'>
                  <h1 className='text-xl font-bold leading-none text-teal-terciary'>
                    {currentFund?.title}
                  </h1>
                  <p className='mt-1.5 text-sm text-teal-terciary'>
                    {currentRescue?.cod_fund_serie === '000'
                      ? 'Serie A'
                      : 'Serie B'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className='mt-6'>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center space-x-2'>
                    <h1 className='text-sm font-bold uppercase leading-none text-neutral-300'>
                      Monto disponible (aprox.){' '}
                    </h1>
                    <Tooltip
                      ButtonIcon={IconInfo}
                      positioning='left'
                      title='Monto disponible (aprox.)'
                      content='Tu monto final se determinará cuando se te haya asignado el Valor Cuota.'
                    />
                  </div>

                  <h1 className='text-base font-bold text-primary-900'>
                    {currentFund?.spectrumFund.moneda}{' '}
                    {convertAmount(Number(rescueDetail?.current_balance))}
                  </h1>
                  <p className='text-sm text-neutral-500'>
                    {rescueDetail?.installments_quantity} cuotas
                  </p>
                </div>
              </div>
              {(!!rescueDetail?.commission_percentage_total ||
                !!rescueDetail?.commission_percentage_partial) && (
                <div className='mt-6'>
                  <div className='flex flex-col items-start'>
                    <div className='flex items-center space-x-2'>
                      <h1 className='text-sm font-bold uppercase leading-none text-neutral-300'>
                        Comisión de rescate anticipado{' '}
                      </h1>
                      <Tooltip
                        ButtonIcon={IconInfo}
                        positioning='left'
                        title='Comisión de rescate anticipado'
                        content='Solo se cobrará si decides retirar tu dinero antes del tiempo mínimo de permanencia. Se calcula sobre el monto a rescatar.'
                      />
                    </div>

                    <h1 className='text-base font-bold text-primary-900'>
                      {currentFund?.spectrumFund.moneda}{' '}
                      {convertAmount(
                        Number(currentRescue?.amount) *
                          Number(
                            currentRescue?.rescue_type === RescueTypeEnum.TOTAL
                              ? rescueDetail?.commission_percentage_total
                              : rescueDetail?.commission_percentage_partial
                          )
                      )}
                    </h1>
                  </div>
                </div>
              )}
              <div className='mt-6'>
                <div className='flex flex-col items-start'>
                  <div className='flex items-center space-x-2'>
                    <h1 className='text-sm font-bold uppercase leading-none text-neutral-300'>
                      Cuenta de abono
                    </h1>
                  </div>

                  <h1 className='mt-1.5 text-base font-bold text-primary-900'>
                    ••••{' '}
                    {rescueDetail?.bank_accounts
                      .find((e) => e.id === currentRescue!.bank_account_id!)
                      ?.account_number.slice(-4)}
                  </h1>
                  <p className='text-sm text-neutral-500'>
                    {
                      rescueDetail?.bank_accounts.find(
                        (e) => e.id === currentRescue!.bank_account_id!
                      )?.bank_name
                    }{' '}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='relative mt-6 border border-primary-50 bg-[#E2F4FF4D] px-3 py-4'>
            <IconWallet className='absolute' />
            <p className='indent-5 text-sm text-primary-900'>
              Si deseas agregar o editar una cuenta, puedes hacerlo desde
              “Cuentas”.
            </p>
          </div>
        </div>
      </div>
      <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
        <Button
          title='Cancelar'
          alternative
          noBorder
          handleClick={() => modal(true)}
          disabled={mutations.rescueMutation.isLoading}
          className='order-2 mt-4 hidden w-full md:order-none md:mt-0 md:block md:w-auto'
        />
        <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            iconStart='/icons/ArrowLeft.svg'
            alternative
            disabled={mutations.rescueMutation.isLoading}
            handleClick={() => dispatch(setRescueTab(0))}
            title='Anterior'
          />
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            loader={mutations.rescueMutation.isLoading}
            disabled={mutations.rescueMutation.isLoading}
            handleClick={() =>
              submitHandlers.submitRescue(currentRescue as TCreateRescueForm)
            }
            title='Confirmar rescate'
          />
        </div>
      </div>
    </div>
  );
};

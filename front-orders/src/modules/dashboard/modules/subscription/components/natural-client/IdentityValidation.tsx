/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import router from 'next/router';
import React, { FC, useEffect, useLayoutEffect } from 'react';
import { MdArrowForward } from 'react-icons/md';

import { Button } from '@/common/components';
import { IconDangerFill } from '@/common/components/icons/utils/IconDangerFill';
import { ContextRoutesEnum, SpectrumDocumentType } from '@/common/enums';
import { IdentityValidationEnum } from '@/common/enums/identity-validation.enum';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import { IProfilesRisk } from '@/common/interfaces';
import { useFacephiIdentityValidation } from '@/modules/dashboard/hooks/useFacephiIdentityValidation';
import {
  PaymentMethodEnum,
  TabInvestmentSubscriptionEnum,
} from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setChangeRiskTab } from '@/modules/dashboard/slice/riskProfileSlice';
import {
  setInvestmentTab,
  setNaturalClientTab,
} from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { toggleDisabledButton } from '@/modules/dashboard/slice/subscriptionSlice';
import {
  IRiskProfilesBg,
  RiskProfilesBg,
} from '@/modules/profile/utils/riskProfiles';

interface IProps {
  setOpenModalCancel?: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
  subscription?: boolean;
  rescue?: boolean;
  changeRisk?: boolean;
  finalBeneficiary?: boolean;
  update?: string | string[] | undefined;
  state?: {
    isSpoused: boolean;
    setAnuallyUpdateData: (
      state: any,
      cb?: ((state: any) => void) | undefined
    ) => void;
    anuallyUpdateData: any;
  };
}

export const IdentityValidation: FC<IProps> = ({
  setOpenModalCancel,
  subscription,
  rescue,
  changeRisk,
  state: naturalClientState,
  finalBeneficiary,
  update,
}) => {
  const dispatch = useAppDispatch();
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );
  const isCE =
    localStorage.getItem('current_document_type') === SpectrumDocumentType.CE;

  const { hasBankAccount, moneyTypes, currentMoneyType } = useAppSelector(
    (state) => state.rescue
  );
  const { admin_contract } = useAppSelector((state) => state.global);
  const riskProfile = useAppSelector((state) => state.riskProfile);
  const isDisabledInvestment = useAppSelector(
    (state) => state.subscription.disabledButton
  );
  const paymentMethod = useAppSelector((state) => state.payment_method);

  const [selectedTerms, setSelectedTerms] = useStateCallback<boolean>(false);
  const [currentRisk, setCurrentRisk] = useStateCallback<
    IRiskProfilesBg | undefined
  >(undefined);
  const [selectedRisk, setSelectedRisk] = useStateCallback<
    IRiskProfilesBg | undefined
  >(undefined);
  const [selectedCondition, setSelectedCondition] =
    useStateCallback<boolean>(false);

  const initValidations =
    rescue || subscription || changeRisk
      ? false
      : !selectedTerms || !selectedCondition;

  const hasMoneyType = currentMoneyType
    ? moneyTypes.includes(currentMoneyType)
    : false;

  useEffect(() => {
    dispatch(toggleDisabledButton(false));
  }, []);

  const onHandleInvestmenetBack = () => {
    dispatch(
      setInvestmentTab(
        paymentMethod?.paymentMethod === PaymentMethodEnum.TRANSFER
          ? TabInvestmentSubscriptionEnum.RECEIPT
          : TabInvestmentSubscriptionEnum.DETAIL
      )
    );
    router.push(ContextRoutesEnum.SUBSCRIPTION_INVESTMENT);
  };

  const { ModalFacialComponent, state } = useFacephiIdentityValidation(
    false,
    null as any,
    (subscription
      ? ContextRoutesEnum.SUBSCRIPTION_INVESTMENT
      : rescue && !hasBankAccount
      ? ContextRoutesEnum.ADD_ACCOUNT
      : changeRisk
      ? ContextRoutesEnum.DASHBOARD
      : rescue && !hasMoneyType
      ? ContextRoutesEnum.ADD_ACCOUNT
      : rescue
      ? ContextRoutesEnum.ADD_RESCUE
      : undefined) as any,
    update ? naturalClientState : null,
    !changeRisk,
    (finalBeneficiary =
      subscription == false && rescue == false && finalBeneficiary),
    subscription,
    rescue
  );

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
  }, []);

  useEffect(() => {
    if (riskProfile.customer_risk && riskProfile.selectedCustomerRisk) {
      setCurrentRisk(
        RiskProfilesBg.find(
          (fundbg) =>
            fundbg.name === (riskProfile.customer_risk as IProfilesRisk).name
        )!
      );
      setSelectedRisk(
        RiskProfilesBg.find(
          (fundbg) =>
            fundbg.name ===
            (riskProfile.selectedCustomerRisk as IProfilesRisk).name
        )!
      );
    }
  }, []);

  const InitialStateView = () => {
    return (
      <div className='bg-white py-10'>
        {changeRisk && currentRisk && selectedRisk ? (
          <>
            <p className='text-xl font-bold leading-none text-primary-900'>
              ¿Seguro que deseas cambiar tu perfil de tolerancia al riesgo?
            </p>
            <div className='flex w-full items-center justify-center space-x-2'>
              <div className='flex flex-col items-center'>
                <currentRisk.icon className='scale-75' />
                <p className='text-[11px] font-bold uppercase text-primary-400'>
                  {(riskProfile.customer_risk as IProfilesRisk).name}
                </p>
              </div>
              <MdArrowForward size={24} color='#007BC3' />
              <div className='flex flex-col items-center'>
                <selectedRisk.icon className='scale-75' />
                <p className='text-[11px] font-bold uppercase text-primary-400'>
                  {riskProfile.selectedCustomerRisk?.name}
                </p>
              </div>
            </div>
            <p className='mt-6 text-primary-900'>
              De hacerlo, procederemos a registrar tu firma para realizar el
              cambio de perfil. Por eso, verificaremos tu identidad con ayuda de
              la cámara de tu dispositivo.
            </p>
          </>
        ) : (
          <>
            <p className='text-xl font-bold leading-none text-primary-900'>
              {isCE ? (
                <>
                  A continuación, llevaremos a cabo un proceso de verificación
                  que incluye tanto el reconocimiento biométrico de tu rostro
                  como la validación de documentos, para garantizar la seguridad
                  de tu solicitud como partícipe.
                </>
              ) : (
                <>
                  A continuación, firmaremos biométricamente tu solicitud de{' '}
                  {rescue
                    ? 'rescate'
                    : subscription
                    ? 'suscripción'
                    : 'partícipe'}
                  .{' '}
                </>
              )}
            </p>
            <p className='mt-6 text-primary-900'>
              Verificaremos tu identidad con ayuda de la cámara de tu
              dispositivo.{' '}
            </p>
          </>
        )}
        <p className='mt-4 text-primary-900'>
          Para tener un resultado exitoso te aconsejamos:
        </p>
        <ul className='ml-2 mt-4 space-y-4 text-primary-900'>
          <li>• &nbsp;Estar en un ambiente correctamente iluminado.</li>
          <li>• &nbsp;No tener objetos que impidan ver tu rostro.</li>
          <li>• &nbsp;Ubicarte frente a un fondo de color sólido.</li>
        </ul>
        {(changeRisk ? !changeRisk : rescue ? !rescue : !subscription) && (
          <div className='mt-14 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
            <div className='flex space-x-3 text-primary-900'>
              <input
                type='checkbox'
                onChange={() => setSelectedTerms(!selectedTerms)}
                checked={selectedTerms}
                className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
              />
              <span>
                Acepto los términos y condiciones del{' '}
                <a
                  href={admin_contract}
                  target='_blank'
                  className='cursor-pointer font-bold text-prudential-500'
                >
                  Contrato de Administración{' '}
                </a>
                de PrudentialSAF Sociedad Administradora de Fondos S.A.C.
              </span>
            </div>
            <div className='flex space-x-3'>
              <input
                type='checkbox'
                onChange={() => setSelectedCondition(!selectedCondition)}
                checked={selectedCondition}
                className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
              />
              <span>
                Acepto que PrudentialSAF Sociedad Administradora de Fondos S.A.C
                ponga a disposición mi Estado de Cuenta mensual a través de este
                medio y en la página web de la administradora.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const FailureStateView = () => {
    return (
      <div className='bg-white py-9'>
        <p className='text-xl font-bold leading-none text-primary-900'>
          Validación de identidad no exitosa{' '}
        </p>
        <div className='mt-6 flex  text-primary-900'>
          <div className='flex items-center space-x-4 rounded-lg bg-[#FBEBEC80] px-3 py-2 md:space-x-2'>
            <IconDangerFill fill='rgb(213 57 67)' className='mb-1' />
            <p className=' leading-none text-terciary-900'>
              Hubo un problema con la validación de identidad. Por favor, vuelve
              a intentarlo.{' '}
            </p>
          </div>
        </div>
        {changeRisk && selectedRisk && currentRisk && (
          <div className='flex w-full items-center justify-center space-x-2'>
            <div className='flex flex-col items-center'>
              <currentRisk.icon className='scale-75' />
              <p className='text-[11px] font-bold uppercase text-primary-400'>
                {(riskProfile.customer_risk as IProfilesRisk).name}
              </p>
            </div>
            <MdArrowForward size={24} color='#007BC3' />
            <div className='flex flex-col items-center'>
              <selectedRisk.icon className='scale-75' />
              <p className='text-[11px] font-bold uppercase text-primary-400'>
                {riskProfile.selectedCustomerRisk?.name}
              </p>
            </div>
          </div>
        )}
        <p className='mt-6 text-primary-900'>
          Para tener un resultado exitoso te aconsejamos:
        </p>
        <ul className='ml-2 mt-6 space-y-4 text-primary-900'>
          {!changeRisk && (
            <>
              <li className='font-bold'>
                • &nbsp;Confirmar que los datos personales ingresados
                previamente coinciden con los datos registrados en tu documento
                de identidad.
              </li>
            </>
          )}
          <li>• &nbsp;Confirmar que el Documento de Identidad este vigente.</li>
          <li>• &nbsp;Estar en un ambiente correctamente iluminado.</li>
          <li>• &nbsp;No tener objetos que impidan ver tu rostro.</li>
          <li>• &nbsp;Ubicarte frente a un fondo de color sólido.</li>
        </ul>
        {(changeRisk ? !changeRisk : rescue ? !rescue : !subscription) && (
          <div className='mt-14 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
            <div className='flex space-x-3 text-primary-900'>
              <input
                type='checkbox'
                onChange={() => setSelectedTerms(!selectedTerms)}
                checked={selectedTerms}
                className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
              />
              <span className='text-primary-900'>
                Acepto los términos y condiciones del{' '}
                <a
                  href={admin_contract}
                  target='_blank'
                  className='cursor-pointer font-bold text-prudential-500'
                >
                  Contrato de Administración{' '}
                </a>
                de PrudentialSAF Sociedad Administradora de Fondos S.A.C.
              </span>
            </div>
            <div className='flex space-x-3'>
              <input
                type='checkbox'
                onChange={() => setSelectedCondition(!selectedCondition)}
                checked={selectedCondition}
                className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
              />
              <span className='text-primary-900'>
                Acepto que PrudentialSAF Sociedad Administradora de Fondos S.A.C
                ponga a disposición mi Estado de Cuenta mensual a través de este
                medio y en la página web de la administradora.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {state.facialState === IdentityValidationEnum.INITIAL && (
        <InitialStateView />
      )}
      {state.facialState === IdentityValidationEnum.FAILURE && (
        <FailureStateView />
      )}

      {rescue ?? subscription ? (
        <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
          <Button
            title='Cancelar'
            alternative
            noBorder
            handleClick={() => setOpenModalCancel && setOpenModalCancel(true)}
            className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:block md:w-auto'
          />
          <Button
            className='w-4/5 self-center md:w-auto'
            type='submit'
            handleClick={() => state.setIsOpenFacephi(true)}
            disabled={
              rescue || subscription
                ? false
                : !selectedTerms || !selectedCondition
            }
            title={
              state.facialState === IdentityValidationEnum.FAILURE
                ? 'Volver a intentar'
                : 'Validar mi identidad'
            }
          />
        </div>
      ) : (
        <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-y-4 pb-14 md:flex-row md:space-x-2 md:space-y-0'>
          <Button
            handleClick={() => setOpenModalCancel && setOpenModalCancel(true)}
            title='Cancelar'
            alternative
            noBorder
            disabled={isDisabledInvestment}
            className={clsx(
              'order-2 mt-4 hidden w-full md:order-none md:mt-0 md:block md:w-auto'
            )}
          />
          <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
            {(changeRisk ? changeRisk : rescue ? !rescue : !subscription) && (
              <Button
                className=' w-4/5 self-center  md:w-auto'
                type='submit'
                iconStart='/icons/ArrowLeft.svg'
                alternative
                handleClick={() => {
                  if (changeRisk) {
                    dispatch(setChangeRiskTab(0));
                  } else {
                    dispatch(
                      setNaturalClientTab((naturalClientTab - 1) as any)
                    );
                  }
                }}
                title='Anterior'
              />
            )}
            {subscription && (
              <Button
                className=' w-4/5 self-center  md:w-auto'
                type='submit'
                iconStart='/icons/ArrowLeft.svg'
                alternative
                handleClick={onHandleInvestmenetBack}
                title='Anterior'
                disabled={isDisabledInvestment}
                loader={isDisabledInvestment}
              />
            )}
            <Button
              className=' w-4/5 self-center  md:w-auto'
              type='submit'
              title={
                state.facialState === IdentityValidationEnum.FAILURE
                  ? 'Volver a intentar'
                  : 'Validar mi identidad'
              }
              handleClick={() => {
                state.setIsOpenFacephi(true);
              }}
              disabled={initValidations || isDisabledInvestment}
              loader={isDisabledInvestment}
            />
          </div>
        </div>
      )}
      {state.isOpenFacephi && ModalFacialComponent()}
    </div>
  );
};

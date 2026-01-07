/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Card } from '@/common/components';
import { IconInvest } from '@/common/components/icons/dashboard';
import { IconInvestmentProcess } from '@/common/components/icons/dashboard/IconInvestmentProcess';
import {
  CivilStatusTabs,
  ContextRoutesEnum,
  ContextTabs,
  FormStepsEnum,
  GeneralStatusEnum,
} from '@/common/enums';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { RiskProfileOriginEnum } from '@/modules/dashboard/enums/risk-profile-origin.enum';
import { setIsFromOpenYourAccount } from '@/modules/dashboard/slice/riskProfileSlice';
import { setNaturalClientTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { setContextTabs } from '@/modules/dashboard/slice/subscriptionSlice';

import { StepsNaturalForm } from '../../../common/enums/form-steps.enum';

interface IProps {
  withPDR?: boolean;
  loading: boolean;
}

export const NoInvestmentCards: FC<IProps> = ({ withPDR = false, loading }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formSteps = useAppSelector((state) => state.session.form_steps);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const { status } = currentUser || {};
  const isSuspended = status === GeneralStatusEnum.SUSPENDED;

  const investmentProcess = formSteps.find(
    (formStep) => formStep.description === FormStepsEnum.PROCESO_INVERSION
  );

  return (
    <div className='grid grid-cols-12 justify-between gap-8'>
      {loading ? (
        <div className='col-span-12 min-h-fit rounded-xl bg-white'>
          <div className='animate-pulse rounded-[4px] bg-gradient-to-br p-3 text-white'>
            <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
            <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
              <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
              <div className='mt-1 h-4 w-5/12 rounded-full bg-neutral-200'></div>
            </h6>
            <div className='mt-5 py-3 pt-2'>
              <div className='mt-1 flex justify-between'>
                <div className='h-8 w-3/12 rounded-full bg-neutral-200'></div>
              </div>
            </div>
          </div>{' '}
        </div>
      ) : (
        <>
          {investmentProcess?.status && !currentUser?.exist_spectrum ? (
            <Card
              title='Aún no has abierto tu cuenta'
              content={
                <p>
                  Cumple tus objetivos de ahorro e inversión con nuestro
                  portafolio de Fondos Mutuos.
                </p>
              }
              IconEnd={IconInvestmentProcess}
              buttonTitle='Continuar proceso'
              size={1}
              buttonHandleClick={() => {
                const lastStep = formSteps
                  .filter((formStep) =>
                    Object.values(StepsNaturalForm).includes(
                      formStep.description as StepsNaturalForm
                    )
                  )
                  .reverse()
                  .find((e) => e.status === true);

                const stepNaturalIndex = Object.values(
                  StepsNaturalForm
                ).findIndex((step) => step === lastStep?.description);

                if (
                  formSteps.find(
                    (formStep) => formStep.description === FormStepsEnum.CONYUGE
                  )?.status ||
                  currentUser?.isSpoused
                ) {
                  const newTabs = ContextTabs.slice(0, 4).concat(
                    CivilStatusTabs
                  );
                  dispatch(setContextTabs(newTabs));
                  dispatch(
                    setNaturalClientTab(
                      stepNaturalIndex > 3
                        ? ((stepNaturalIndex + 1) as never)
                        : (stepNaturalIndex as never)
                    )
                  );
                } else {
                  dispatch(setNaturalClientTab(stepNaturalIndex as never));
                }
                router.push(ContextRoutesEnum.NATURAL_CLIENT_FORM);
              }}
              classNameIcon='md:!bottom-4 -bottom-5'
              className={clsx(
                'col-span-12 min-h-fit rounded-xl bg-white md:col-span-12'
              )}
            />
          ) : (
            <>
              {currentUser?.exist_spectrum ? (
                <Card
                  title='¿Listo para comenzar a invertir?'
                  content='Cumple tus objetivos de ahorro e inversión con nuestro portafolio de Fondos Mutuos.'
                  IconEnd={IconInvest}
                  buttonTitle='Quiero invertir'
                  size={1}
                  buttonHandleClick={() =>
                    router.push(
                      withPDR
                        ? ContextRoutesEnum.PRODUCTS_RECOMMENDED
                        : ContextRoutesEnum.DASHBOARD_RISK_PROFILE
                    )
                  }
                  className={clsx(
                    'col-span-12 min-h-fit rounded-xl bg-white md:col-span-6',
                    withPDR && 'md:!col-span-12'
                  )}
                  buttonDisabled={isSuspended}
                />
              ) : (
                <Card
                  title='Completa tu registro'
                  content='Cumple tus objetivos de ahorro e inversión con nuestro portafolio de Fondos Mutuos.'
                  IconEnd={IconInvest}
                  buttonTitle='Abre tu cuenta'
                  size={1}
                  buttonHandleClick={() => {
                    const pathname = withPDR
                      ? ContextRoutesEnum.SUBSCRIPTION_TYPE_PARTICIPATE
                      : ContextRoutesEnum.DASHBOARD_RISK_PROFILE;
                    if (!withPDR) dispatch(setIsFromOpenYourAccount(true));
                    router.push(
                      {
                        pathname,
                        query: {
                          redirect: RiskProfileOriginEnum.COMPLETE_REGISTER,
                        },
                      },
                      pathname
                    );
                  }}
                  className={clsx(
                    'col-span-12 min-h-fit rounded-xl bg-white md:col-span-6',
                    withPDR && 'md:!col-span-12'
                  )}
                />
              )}
              {!withPDR && (
                <div className='col-span-12 min-h-fit md:col-span-6'>
                  <Card
                    title='Queremos conocerte'
                    content='Antes de comenzar a invertir, es importante conocer tu perfil de tolerancia al riesgo para darte las mejores recomendaciones.
                              Te tomará un par de minutos.'
                    buttonHandleClick={() => {
                      dispatch(setIsFromOpenYourAccount(false));
                      const pathname = ContextRoutesEnum.DASHBOARD_RISK_PROFILE;
                      router.push(
                        {
                          pathname,
                          query: {
                            redirect: RiskProfileOriginEnum.START_QUESTIONNAIRE,
                          },
                        },
                        pathname
                      );
                    }}
                    buttonTitle='Comenzar cuestionario'
                    size={1}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

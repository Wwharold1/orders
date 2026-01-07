/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { Button, Modal } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import { useIsomorphicLayoutEffect, useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { RiskProfileOriginEnum } from '@/modules/dashboard/enums/risk-profile-origin.enum';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { RiskQuestions } from '@/modules/dashboard/modules/subscription/components/risk-profile';

export const RiskProfile = () => {
  const [riskProfileOrigin, setRiskProfileOrigin] = useStateCallback<
    RiskProfileOriginEnum | undefined
  >(undefined);
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (router.query.redirect)
      setRiskProfileOrigin(router.query.redirect as RiskProfileOriginEnum);
  }, []);

  const {
    queries: { questionnaireQuery },
    state,
    mutations: { registerRiskMutation },
    modal,
  } = useRiskProfile(true, riskProfileOrigin);
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);

  const loadingQuestionnaireQuery =
    (questionnaireQuery.isLoading || questionnaireQuery.isFetching) &&
    !questionnaireQuery.isError;

  const onHandleConfirm = () => {
    const riskProfileForm = {
      questionnaireId: questionnaireQuery.data!.data.id!,
      total_score: state.optionsSelected
        .map((options) => options.score)
        .reduce((acc, el) => acc + el),
      questionAnswers: state.optionsSelected.map((options) => ({
        questionId: options.questionsId,
        optionId: options.id,
        score: options.score,
      })),
    };

    !loadingQuestionnaireQuery &&
      !router.query.anually_update &&
      registerRiskMutation.mutate(riskProfileForm);

    if (router.query.anually_update) {
      router.push(
        {
          pathname: ContextRoutesEnum.NATURAL_CLIENT_FORM,
          query: {
            anually_update: true,
            customer_risk_form: JSON.stringify(riskProfileForm),
          },
        },
        ContextRoutesEnum.NATURAL_CLIENT_FORM
      );
    }
  };

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout>
        <RiskQuestions
          state={state}
          loading={loadingQuestionnaireQuery}
          riskProfile={questionnaireQuery.data}
        />
        <div className='mb-12 mt-10 flex flex-col items-center space-x-0 md:flex-row md:items-end md:justify-end md:space-x-2'>
          <Button
            handleClick={() => {
              if (state.optionsSelected?.length) {
                modal.setOpenModalCancel(true);
                return;
              }

              router.push(ContextRoutesEnum.DASHBOARD);
            }}
            title='Cancelar'
            alternative
            noBorder
            className='order-2 mt-4 w-3/4 md:order-none md:mt-0 md:w-auto'
          />
          <Button
            disabled={
              loadingQuestionnaireQuery ||
              state.optionsSelected?.length !==
                questionnaireQuery.data?.data.questions?.length
            }
            handleClick={onHandleConfirm}
            title='Confirmar'
            className='w-3/4 md:mt-0 md:w-auto'
          />
        </div>
        <Modal
          title='Un momento...'
          isOpen={registerRiskMutation.isLoading}
          modalLength={450}
          setIsOpen={!registerRiskMutation.isLoading}
          size={2}
          customColor='#4C555A'
          customIcon={
            <div className='relative mb-2 flex items-center justify-center'>
              <Image
                src='/icons/loadingIconBlub.svg'
                alt='light blub'
                width={80}
                height={80}
                className='scale-[1.8]'
              />
              <motion.div
                animate={{
                  rotate: '360deg',
                  transition: {
                    repeat: Infinity,
                    type: 'tween',
                    ease: 'linear',
                    duration: 1.5,
                  },
                }}
                className='absolute -top-0.5'
              >
                <Image
                  src='/images/settings.png'
                  alt='light blub'
                  width={28}
                  height={28}
                />
              </motion.div>
            </div>
          }
        >
          <span className='mt-0 text-center'>
            Estamos analizando los resultados. <br />
            En unos segundos sabremos tu perfil de <br /> tolerancia al riesgo.
          </span>
        </Modal>
        <Modal
          isOpen={modal.openModalCancel}
          title='¿Seguro que deseas cancelar el cuestionario de Perfil de tolerancia al riesgo?'
          setIsOpen={modal.setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Cancelar cuestionario'
          confirmationCustomFunction={() => router.back()}
          extended={isMdDown}
          secondaryConfirmationText='Volver al cuestionario'
        >
          <span className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </span>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

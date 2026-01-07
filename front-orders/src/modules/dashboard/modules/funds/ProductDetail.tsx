/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { Modal } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum } from '@/common/enums';
import { useAppSelector, useStateCallback } from '@/common/hooks';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { FundBenchmarkMonth } from '@/modules/dashboard/modules/funds/FundBenchmarkMonth';
import { FundBenchmarkYears } from '@/modules/dashboard/modules/funds/FundBenchmarkYears';
import { FundComissions } from '@/modules/dashboard/modules/funds/FundComissions';
import { FundDescription } from '@/modules/dashboard/modules/funds/FundDescription';
import { FundDisclaimer } from '@/modules/dashboard/modules/funds/FundDisclaimer';
import { FundFeatures } from '@/modules/dashboard/modules/funds/FundFeatures';
import { FundInvestment } from '@/modules/dashboard/modules/funds/FundInvestment';
import { FundPublicity } from '@/modules/dashboard/modules/funds/FundPublicity';
import { FundRecommended } from '@/modules/dashboard/modules/funds/FundRecommended';
import { FundResults } from '@/modules/dashboard/modules/funds/FundResults';
import { FundStrategy } from '@/modules/dashboard/modules/funds/FundStrategy';
import { TopProductSummary } from '@/modules/dashboard/modules/funds/TopProductSummary';
import { SubscriptionFormEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';

export const ProductDetail = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const subscriptionSlice = useAppSelector((state) => state.subscription);

  const [openModal, setOpenModal] = useStateCallback(false);
  const { currentUser } = useAppSelector((state) => state.session);
  const router = useRouter();
  /*  const getSerieField = (field: any, selectedTab: number) => {
    return selectedTab === 0 ? field.description : field.habitat;
  }; */

  const {
    state: { hasPDR },
  } = useRiskProfile(false);
  const isRecommended = subscriptionSlice.recommendedFunds
    .map((e) => e.id)
    .includes(subscriptionSlice.currentFund!.id);

  const isSubscribed = subscriptionSlice.subscriptions?.funds_serie.find(
    (subscription) => subscription.fund_id === subscriptionSlice.currentFund?.id
  );
  const isResultsVisibility =
    Object.keys(subscriptionSlice.currentFund?.structure.results || {}).length >
      0 && !!subscriptionSlice.currentFund?.structure.results.visibility;

  const isPerformanceVisibility =
    !!subscriptionSlice.currentFund?.structure.performance.visibility;

  const isMonthPerformanceVisibility =
    !!subscriptionSlice.currentFund?.structure.performance.monthTitleVisibility;

  const isYearlyPerformanceVisibility =
    !!subscriptionSlice.currentFund?.structure.performance.titleVisibility;

  const isPublicityVisibility =
    !!subscriptionSlice.currentFund?.structure.content.publicity?.visibility;

  const isFeaturesVisibility =
    !!subscriptionSlice.currentFund?.structure.content.features?.visibility;

  const isCommissionsVisibility =
    !!subscriptionSlice.currentFund?.structure.content.commissions?.visibility;

  const isDisclaimerVisibility =
    !!subscriptionSlice.currentFund?.structure.content.disclaimerVisibility;

  const isBriefcaseVisibility =
    !!subscriptionSlice.currentFund?.structure.briefcase.visibility;

  const isInvStrategyVisibility =
    !!subscriptionSlice.currentFund?.structure.investmentStrategy.visibility;

  const onConfirmAction = () => {
    if (!hasPDR) {
      router.push(ContextRoutesEnum.DASHBOARD_RISK_PROFILE);
      return;
    }
    const route = currentUser?.exist_spectrum
      ? ContextRoutesEnum.SUBSCRIPTION_INVESTMENT
      : ContextRoutesEnum.SUBSCRIPTION_TYPE_PARTICIPATE;
    router.push(route);
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_DETAIL);
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_RECEIPT);
  };

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout>
        <TopProductSummary
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          isRecommended={isRecommended}
          setOpenModal={setOpenModal}
        />

        <div className='my-6 grid grid-cols-12 gap-6'>
          <div className='col-span-12'>
            <section className='grid grid-cols-12 gap-6'>
              {!!isRecommended && !isSubscribed && (
                <div className='col-span-12 md:col-span-4'>
                  <FundRecommended />
                </div>
              )}

              {/* sobre el fondo */}
              <div
                className={
                  !!isRecommended || !!isSubscribed
                    ? 'col-span-12 md:col-span-8'
                    : 'col-span-12'
                }
              >
                <FundDescription />
              </div>

              {!!isSubscribed && (
                <div className='col-span-12 md:col-span-4'>
                  <FundInvestment />
                </div>
              )}
            </section>
          </div>
          <div className='col-span-12 space-y-4'>
            <div className='grid grid-cols-9 gap-6'>
              <div
                className={`col-span-9 grid gap-6 ${
                  !isPublicityVisibility ? 'xl:col-span-9' : 'xl:col-span-5'
                }`}
              >
                {isFeaturesVisibility && (
                  <FundFeatures selectedTab={selectedTab} />
                )}
                {isCommissionsVisibility && (
                  <FundComissions selectedTab={selectedTab} />
                )}
              </div>

              {isPublicityVisibility && (
                <div
                  className={`col-span-9 hidden xl:flex ${
                    !(isFeaturesVisibility && isCommissionsVisibility)
                      ? 'xl:col-span-9'
                      : 'xl:col-span-4'
                  }`}
                >
                  <FundPublicity />
                </div>
              )}
            </div>

            <div className='grid grid-cols-12 gap-6'>
              <div
                className={`col-span-12 ${
                  isPerformanceVisibility &&
                  isMonthPerformanceVisibility &&
                  !isYearlyPerformanceVisibility
                    ? 'xl:col-span-12'
                    : 'xl:col-span-4'
                }`}
              >
                <div className='grid h-full grid-cols-4 gap-6'>
                  {isMonthPerformanceVisibility && (
                    <div
                      className={`col-span-4 ${
                        isResultsVisibility && !isYearlyPerformanceVisibility
                          ? 'xl:col-span-2'
                          : 'xl:col-span-4'
                      }`}
                    >
                      <FundBenchmarkMonth />
                    </div>
                  )}
                  {/* Rendimientos */}
                  {isResultsVisibility && (
                    <div
                      className={`col-span-4 ${
                        isMonthPerformanceVisibility &&
                        !isYearlyPerformanceVisibility
                          ? 'xl:col-span-2'
                          : 'xl:col-span-4'
                      }`}
                    >
                      <FundResults />
                    </div>
                  )}
                </div>
              </div>

              {isPerformanceVisibility && isYearlyPerformanceVisibility && (
                <div
                  className={`col-span-12 ${
                    !isMonthPerformanceVisibility && !isResultsVisibility
                      ? 'xl:col-span-12'
                      : 'xl:col-span-8'
                  }`}
                >
                  <FundBenchmarkYears />
                </div>
              )}
            </div>

            {(isInvStrategyVisibility || isBriefcaseVisibility) && (
              <FundStrategy
                isInvStrategyVisibility={isInvStrategyVisibility}
                isBriefcaseVisibility={isBriefcaseVisibility}
              />
            )}

            {isPublicityVisibility && (
              <div className='flex xl:hidden'>
                <FundPublicity />
              </div>
            )}

            {isDisclaimerVisibility && <FundDisclaimer />}
          </div>
        </div>
        <Modal
          isOpen={openModal}
          setIsOpen={setOpenModal}
          customIcon={<IconDanger className='mb-1' />}
          confirmationCustomFunction={onConfirmAction}
          extended
          modalLength={450}
          confirmationText='Aceptar'
        >
          <span className='text-neutral-600'>
            En caso decida invertir en un tipo de fondo que no sea el
            recomendado para mi tolerancia al riesgo, libero de toda
            responsabilidad a PrudentialSAF Sociedad Administradora de Fondos
            S.A.C{' '}
          </span>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

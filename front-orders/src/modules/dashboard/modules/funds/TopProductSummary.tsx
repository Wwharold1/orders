/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import React, { FC, useState } from 'react';

import { Button } from '@/common/components';
import { IconStar } from '@/common/components/icons/dashboard/IconStar';
import IconInfo from '@/common/components/icons/utils/IconInfo';
import { Tooltip } from '@/common/components/Tooltip';
import { GeneralStatusEnum } from '@/common/enums';
import { firstLetterUppercase, formatDateToFundString } from '@/common/helper';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { IFund } from '@/common/interfaces';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { ModalSelectSerie } from '@/modules/dashboard/modules/subscription/components/investment/ModalSelectSerie';
import { fundDistributiveFundEnum } from '@/modules/dashboard/modules/subscription/enum/distributiveFund.enum';
import { setSerieCodigo } from '@/modules/dashboard/slice/subscriptionSerieSlice';

interface IProps {
  isRecommended: boolean;
  setOpenModal: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
  selectedTab: number;
  setSelectedTab: (index: number) => void;
}

export const TopProductSummary: FC<IProps> = ({
  isRecommended,
  setOpenModal,
  selectedTab,
  setSelectedTab,
}) => {
  const { currentFund, funds } = useAppSelector((state) => state.subscription);

  const showTabs = currentFund?.codFund === fundDistributiveFundEnum.codFund;
  const { recommendedFunds } = useAppSelector((state) => state.subscription);
  const { currentUser } = useAppSelector((state) => state.session);
  const { onHandleInvestment } = useRiskProfile(false);
  const dispatch = useAppDispatch();
  const [showSelectSerieModal, setShowSelectSerieModal] = useState(false);

  const { status } = currentUser || {};
  const isSuspended = status === GeneralStatusEnum.SUSPENDED;

  const imageHeader =
    funds.find((item: IFund) => item.codFund === currentFund?.codFund)
      ?.imageHeader ?? null;

  const spectrumFundItem = currentFund?.spectrumFund
    ? Array.isArray(currentFund.spectrumFund)
      ? currentFund.spectrumFund[selectedTab]
      : currentFund.spectrumFund
    : null;

  const features = currentFund?.structure?.content?.features?.data || [];
  const commissions = currentFund?.structure?.content?.commissions?.data || [];
  const formatSerieName = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const inversionMinima = features.find(
    (f) => f.title === 'Inversión inicial mínima'
  );
  const comisionUnificada = commissions.find((c) =>
    c.title?.toLowerCase().includes('comisión unificada')
  );
  const series = currentFund?.spectrumFund
    ? Array.isArray(currentFund.spectrumFund)
      ? currentFund.spectrumFund
      : [currentFund.spectrumFund]
    : [];

  return (
    <div className='rounded-lg bg-white p-2'>
      <div
        style={{
          backgroundImage: `url(${imageHeader})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className='flex flex-col rounded-[4px] p-5 text-white'
      >
        <div className='relative flex justify-between overflow-hidden'>
          {recommendedFunds.some((e) => e.id === currentFund?.id) && (
            <div className='grid place-content-center rounded-lg bg-white/20 p-1.5'>
              <IconStar fill='#FFFFFF' />
            </div>
          )}
        </div>

        <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
          {currentFund?.title}
        </h6>
        <p>
          {showTabs
            ? selectedTab === 0
              ? 'Serie A'
              : 'Serie B'
            : currentUser?.serie.name}{' '}
        </p>
        <Button
          className='mt-6 md:self-end'
          noBorder
          alternative
          title='Invertir'
          disabled={isSuspended}
          handleClick={() => {
            if (currentFund?.codFund === fundDistributiveFundEnum.codFund) {
              setShowSelectSerieModal(true);
            } else {
              onHandleInvestment(isRecommended, setOpenModal);
            }
          }}
        />
      </div>
      <div className='px-3 py-4 pt-6'>
        <h6 className='text-sm font-bold text-neutral-300'>VALOR CUOTA</h6>
        <div className='flex justify-between'>
          <div className='flex items-center space-x-1'>
            <p className='text-xl font-bold text-primary-900'>
              {spectrumFundItem?.moneda}{' '}
              {spectrumFundItem?.quotaValue?.valorCuotaInicialReal?.toFixed(4)}
            </p>

            <Tooltip
              ButtonIcon={IconInfo}
              title='Valor cuota'
              content='Valor que diariamente se establece a tu cuota desde que hiciste
          el primer aporte y es el producto de dividir el valor diario del
          patrimonio del fondo mutuo entre el total de cuotas en
          circulación.'
            />
          </div>
        </div>
        <div className='flex justify-between'>
          <p className='text-sm text-neutral-300'>
            {spectrumFundItem?.quotaValue?.fechaCuota &&
              formatDateToFundString(
                new Date(spectrumFundItem.quotaValue.fechaCuota)
              )}
          </p>
          <div
            className='flex h-4 min-w-min items-center justify-center rounded p-2 py-3 pb-2.5 text-sm leading-none'
            style={{
              color: currentFund?.structure.riskLevel.color,
              backgroundColor: currentFund?.structure.riskLevel.color + '20',
            }}
          >
            <p>{firstLetterUppercase(currentFund!.structure.riskLevel.name)}</p>
          </div>
        </div>
        <div>
          {showTabs && (
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className='space-x-4 border-b border-neutral-100 pb-2'>
                {['Serie A', 'Serie B'].map((label, i) => (
                  <Tab key={i}>
                    {({ selected }) => (
                      <div
                        className={clsx(
                          'relative cursor-pointer px-2 pb-2 text-sm font-bold',
                          selected ? 'text-primary-500' : 'text-neutral-400'
                        )}
                      >
                        {label}
                        {selected && (
                          <div className='absolute bottom-0 left-0 h-1 w-full rounded-t bg-primary-500'></div>
                        )}
                      </div>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>
          )}
        </div>
      </div>
      <ModalSelectSerie
        isOpen={showSelectSerieModal}
        onClose={() => setShowSelectSerieModal(false)}
        onConfirm={() => setShowSelectSerieModal(false)}
        onSelect={(cod) => {
          dispatch(setSerieCodigo({ serieCodigo: cod }));
          onHandleInvestment(isRecommended, setOpenModal);
          localStorage.setItem('serieCodigo', cod);
        }}
        series={
          currentFund && currentFund.spectrumFund
            ? Array.isArray(currentFund.spectrumFund)
              ? currentFund.spectrumFund.map((s) => ({
                  codFondoSerie: s.codFondoSerie,
                  descripFondoSerie: formatSerieName(s.descripFondoSerie),
                }))
              : [
                  {
                    codFondoSerie: currentFund.spectrumFund.codFondoSerie,
                    descripFondoSerie: formatSerieName(
                      currentFund.spectrumFund.descripFondoSerie
                    ),
                  },
                ]
            : []
        }
        inversionMinima={currentFund?.structure.content.features.data.find(
          (d) => d.title === 'Inversión inicial mínima'
        )}
        comisionUnificada={currentFund?.structure.content.commissions.data.find(
          (d) => d.title.toLowerCase().includes('comisión unificada')
        )}
      />
    </div>
  );
};

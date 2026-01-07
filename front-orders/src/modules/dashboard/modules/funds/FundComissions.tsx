/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';

import { Accordion } from '@/common/components/Accordion';
import IconInfo from '@/common/components/icons/utils/IconInfo';
import { Tooltip } from '@/common/components/Tooltip';
import { SpectrumSerieEnum } from '@/common/enums/spectrum-customer.enum';
import { useAppSelector } from '@/common/hooks';
import { fundDistributiveFundEnum } from '@/modules/dashboard/modules/subscription/enum/distributiveFund.enum';
interface Props {
  selectedTab: number;
}
export const FundComissions: React.FC<Props> = ({ selectedTab }) => {
  const { currentFund } = useAppSelector((state) => state.subscription);
  const { currentUser } = useAppSelector((state) => state.session);
  const isDistributiva =
    currentFund?.codFund === fundDistributiveFundEnum.codFund;

  const ComissionsContent = () => {
    return (
      <>
        {currentFund?.structure.content.commissions.data.map(
          (features, index) => {
            const value = isDistributiva
              ? features[selectedTab === 0 ? 'description' : 'habitat']
              : features[
                  currentUser?.serie.codigo === SpectrumSerieEnum.A
                    ? 'description'
                    : 'habitat'
                ];

            return (
              <div key={index} className='mt-2'>
                <div className='grid grid-cols-12 text-sm'>
                  <div
                    style={{
                      backgroundColor: index % 2 === 0 ? '#F8F9F966' : 'white',
                    }}
                    className='col-span-6 flex items-center px-6 py-3'
                  >
                    <p className='font-bold leading-none text-neutral-300'>
                      {features.title.toUpperCase()}
                    </p>
                    {TooltipsEnum[features.title as keyof typeof TooltipsEnum]}
                  </div>
                  <p
                    style={{
                      backgroundColor: index % 2 === 0 ? '#F8F9F966' : 'white',
                    }}
                    className='col-span-6 flex items-center px-6 py-3 leading-none text-primary-900'
                  >
                    {value}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </>
    );
  };

  return (
    <>
      <div className='hidden rounded-lg bg-white pb-2 md:block'>
        <div className='border-b border-neutral-50 px-6 py-8 pb-3'>
          <p className='text-xl font-bold text-primary-900'>
            {currentFund?.structure.content.commissions.title}
          </p>
        </div>
        {ComissionsContent()}
      </div>
      <div className='md:hidden'>
        <Accordion title={currentFund!.structure.content.commissions.title}>
          {ComissionsContent()}
        </Accordion>
      </div>
    </>
  );
};

const TooltipsEnum = {
  'Comisión unificada': (
    <Tooltip
      ButtonIcon={IconInfo}
      positioning='right'
      title='Comisión unificada'
      content='Es el costo por administrar tu dinero y se calcula sobre el total del patrimonio administrado. Se divide proporcionalmente (entre 360 días) y se te cobra un monto mensual.'
    />
  ),
  'Comisión de rescate anticipado': (
    <Tooltip
      ButtonIcon={IconInfo}
      positioning='right'
      title='Comisión de rescate anticipado'
      content='Solo se cobrará si decides retirar tu dinero antes del tiempo mínimo de permanencia. Se calcula sobre el monto a rescatar.'
    />
  ),
  'Impuesto a la renta': (
    <Tooltip
      ButtonIcon={IconInfo}
      positioning='right'
      title='Impuesto a la renta'
      content='Este monto será retenido por PrudentialSAF Sociedad Administradora de Fondos S.A.C.'
    />
  ),
};

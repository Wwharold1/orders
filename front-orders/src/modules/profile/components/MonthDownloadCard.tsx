/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect } from 'react';
import toast from 'react-hot-toast';

import { notifyInfo, Spinner } from '@/common/components';
import { IconDownload } from '@/common/components/icons/profile/IconDownload';
import { IFundPeriod, IFundSpectrum } from '@/common/interfaces';
import { useDownloadEECC } from '@/modules/profile/hooks/useDownloadEECC';

interface IProps {
  period: IFundPeriod;
  index: number;
  currentFund: IFundSpectrum;
}

export const MonthDownloadCard: FC<IProps> = ({
  period,
  index,
  currentFund,
}) => {
  const { mutations, state } = useDownloadEECC(false);

  useEffect(() => {
    if (mutations.downloadFundMutation.isLoading) {
      notifyInfo({
        subtitle: 'Descargando Estado de Cuenta...',
        IconComponent: (
          <div className='mb-1'>
            <Spinner />
          </div>
        ),
        extended: (
          <p
            className='mt-2 cursor-pointer font-bold text-primary-500'
            onClick={() => {
              state.controller.abort();
              mutations.downloadFundMutation.reset();
            }}
          >
            Cancelar descarga
          </p>
        ),
      });
    } else {
      toast.dismiss('info-notification');
    }

    if (state.isSuccessDownload) {
      notifyInfo({
        title: '¡Descarga completada!',
      });
    } else {
      toast.dismiss('info-notification');
    }
  }, [mutations.downloadFundMutation.isLoading]);

  return (
    <div
      className='flex items-center justify-between rounded-[4px] p-4 font-bold leading-none text-white'
      style={{
        backgroundColor: colorIndexEnum[index as keyof typeof colorIndexEnum],
      }}
    >
      <p>
        {period.month} {period.year}
      </p>
      <div
        onClick={() =>
          mutations.downloadFundMutation.mutateAsync({
            fondo: currentFund.codFondo,
            serie: currentFund.codFondoSerie,
            mes: period.code,
            periodo: period.year,
          })
        }
        className='z-10 grid cursor-pointer place-content-center rounded-full p-2 duration-75 ease-in hover:bg-gray-900 hover:bg-opacity-5'
      >
        <IconDownload className='cursor-pointer' />
      </div>
    </div>
  );
};

const colorIndexEnum = {
  0: '#56B2BD',
  1: '#018786',
  2: '#B762A7',
};

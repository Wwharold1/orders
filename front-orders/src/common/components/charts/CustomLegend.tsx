import React from 'react';

import { IconClose } from '@/common/components/icons/dashboard/IconClose';

// Define props interface
interface Props {
  labels: string[];
  colors: string[];
  showLegend: boolean;
  sendEventShowLegend: () => void;
}

const CustomLegend: React.FC<Props> = ({
  labels,
  colors,
  showLegend,
  sendEventShowLegend,
}) => {
  return (
    <>
      {showLegend && (
        <div className='custom-legend animate__animated animate__fadeInDown animate__faster ml-3 rounded-xl border border-gray-300 bg-white px-4 pt-4 shadow-lg'>
          <div className='relative pt-3'>
            <p
              className='absolute top-0 cursor-pointer'
              style={{ right: '-20px' }}
              onClick={() => sendEventShowLegend()}
            >
              <IconClose fill='#d1d5db' />
            </p>
            <h2 className='mb-3 font-bold text-primary-800'>Leyenda:</h2>{' '}
          </div>
          {labels.map((label: any, index: any) => (
            <div key={index} className='mb-3 flex w-full items-center'>
              {' '}
              <span
                className='display mr-2 inline-block h-4 w-4'
                style={{ backgroundColor: colors[index] }}
              ></span>{' '}
              <span className='text-sm font-light text-gray-400'>{label}</span>{' '}
            </div>
          ))}{' '}
        </div>
      )}
    </>
  );
};
export default CustomLegend;

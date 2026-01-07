import clsx from 'clsx';
import React, { FC } from 'react';

interface IProps {
  label: string;
  selected: boolean;
  setSelected: () => void;
}

export const Option: FC<IProps> = ({ selected, setSelected, label }) => {
  return (
    <div
      className={clsx(
        'col-span-3 flex items-start space-x-2 rounded-l md:col-span-2'
      )}
    >
      <div
        className={clsx(
          'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
          !selected ? 'border-[#0066CC]' : 'border-neutral-200'
        )}
        onClick={() => setSelected()}
      >
        {!selected && (
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
        )}
      </div>
      <div>
        <span className='text-primary-900'>{label}</span>
      </div>
    </div>
  );
};

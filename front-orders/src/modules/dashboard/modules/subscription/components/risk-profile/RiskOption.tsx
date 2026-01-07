import clsx from 'clsx';
import React, { FC } from 'react';

import { IRiskOption } from '@/common/interfaces';

interface IProps {
  option?: IRiskOption;
  loading?: boolean;
  optionsSelected: IRiskOption[];
  setOptionsSelected: (
    state: IRiskOption[],
    cb?: ((state: IRiskOption[]) => void) | undefined
  ) => void;
}

export const RiskOption: FC<IProps> = ({
  option,
  loading,
  optionsSelected,
  setOptionsSelected,
}) => {
  if (option && !loading) {
    const currentSelected =
      option.questionsId ===
      optionsSelected.find(
        (e) => e.title === option.title && e.score === option.score
      )?.questionsId;
    const isQuestionSelected =
      option.questionsId ===
      optionsSelected.find((e) => e.questionsId === option.questionsId)
        ?.questionsId;

    return (
      <div
        onClick={() => {
          if (isQuestionSelected) {
            const updatedData = optionsSelected.map((state) => {
              if (state.questionsId === option.questionsId) {
                return option;
              }
              return state;
            });

            setOptionsSelected(updatedData);
          } else {
            setOptionsSelected([...optionsSelected, option]);
          }
        }}
        className={clsx(
          'flex w-full cursor-pointer items-center space-x-2 rounded-lg p-4',
          currentSelected ? 'bg-[#7ECAF21F]' : 'bg-[#f8f9f982]'
        )}
      >
        <div
          className={clsx(
            'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
            currentSelected ? 'border-[#0066CC]' : 'border-neutral-200'
          )}
        >
          {currentSelected && (
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
          )}
        </div>
        <div>{option.title}</div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex w-full cursor-pointer items-center space-x-2 rounded-lg bg-[#f8f9f982] p-4'
      )}
    >
      <div
        className={clsx(
          'relative cursor-pointer rounded-full border-2 border-neutral-200 p-[10px]'
        )}
      ></div>
      <div className='h-3.5 w-5/12 rounded-full bg-neutral-200 md:w-2/12'></div>
    </div>
  );
};

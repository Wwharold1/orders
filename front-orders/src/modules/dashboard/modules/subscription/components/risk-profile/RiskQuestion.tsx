/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import React, { FC } from 'react';

import { IRiskQuestion } from '@/common/interfaces';
import { RiskOption } from '@/modules/dashboard/modules/subscription/components/risk-profile/RiskOption';

interface IProps {
  question?: IRiskQuestion;
  loading?: boolean;
  state: any;
}

export const RiskQuestion: FC<IProps> = ({ question, loading, state }) => {
  return (
    <div
      className={clsx(
        'relative mb-6 flex flex-col items-start rounded-xl bg-white px-4 pb-6 pt-6 text-primary-900 md:px-6 lg:pr-16'
      )}
    >
      {question ? (
        <>
          <p className={clsx(`text-lg font-bold`)}>{question.title}</p>
          <div className='mt-8 inline-flex w-full flex-col space-y-3'>
            {question.options.map((option, index) => {
              return (
                <RiskOption
                  optionsSelected={state.optionsSelected}
                  setOptionsSelected={state.setOptionsSelected}
                  option={option}
                  key={index}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className='w-full animate-pulse'>
          <div className='h-4 w-8/12 rounded-full bg-neutral-200 md:w-3/12'></div>
          <div className='mt-8 inline-flex w-full flex-col space-y-3'>
            {[1, 2, 3].map((option, index) => {
              return (
                <RiskOption
                  key={index}
                  optionsSelected={state.optionsSelected}
                  setOptionsSelected={state.setOptionsSelected}
                  loading={loading}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

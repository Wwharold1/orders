/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import React, { FC, useLayoutEffect } from 'react';

import { Button } from '@/common/components';
import { FormStepsEnum } from '@/common/enums/form-steps.enum';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import { setNaturalClientTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';

interface IProps {
  setOpenModalCancel: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
  setOpenModalPep: (
    state: boolean,
    cb?: ((state: boolean) => void) | undefined
  ) => void;
  makeAmlMutation: any;
  update: boolean;
  state: {
    isSpoused: boolean;
    setAnuallyUpdateData: (
      state: any,
      cb?: ((state: any) => void) | undefined
    ) => void;
    anuallyUpdateData: any;
  };
}

export const PepCustomer: FC<IProps> = ({
  setOpenModalCancel,
  setOpenModalPep,
  makeAmlMutation,
  state,
  update,
}) => {
  const [selectedPep, setSelectedPep] = useStateCallback<boolean>(false);
  const dispatch = useAppDispatch();
  const { contextTabs } = useAppSelector((state) => state.subscription);
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );
  const formSteps = useAppSelector((state) => state.session.form_steps);

  useLayoutEffect(() => {
    document.querySelector('#main-container')?.scrollTo({
      top: 0,
    });
  }, []);

  return (
    <div>
      <div className='bg-white py-10'>
        <p className='text-xl font-bold leading-none text-primary-900'>PEP </p>
        <p className='mt-6 text-primary-900'>
          {contextTabs.map((e) => e.title).includes('Cónyuge')
            ? '¿Tú o tu cónyuge son o han sido Personas Expuestas Políticamente (PEP)? Aplica para aquellas personas con cargo público ejercido en los últimos 5 años y en la actualidad.'
            : '¿Eres una Persona Expuesta Políticamente (PEP)? Aplica para aquellas personas con cargo público ejercido en los últimos 5 años y en la actualidad.'}
        </p>
        <div className=' mt-5 grid grid-cols-12 gap-x-5 gap-y-5 md:gap-y-0'>
          <div
            className={clsx(
              'col-span-3 flex w-full items-start space-x-2 rounded-l md:col-span-1'
            )}
          >
            <div
              onClick={() => {
                setSelectedPep(true);
              }}
              className={clsx(
                'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                selectedPep ? 'border-[#0066CC]' : 'border-neutral-200'
              )}
            >
              {selectedPep && (
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
              )}
            </div>
            <div>
              <span className='text-primary-900'>Si</span>
            </div>
          </div>
          <div
            className={clsx(
              'col-span-3 flex w-full items-start space-x-2 rounded-l md:col-span-1'
            )}
          >
            <div
              onClick={() => {
                setSelectedPep(false);
              }}
              className={clsx(
                'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                !selectedPep ? 'border-[#0066CC]' : 'border-neutral-200'
              )}
            >
              {!selectedPep && (
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
              )}
            </div>
            <div>
              <span className='text-primary-900'>No</span>
            </div>
          </div>
        </div>
      </div>
      <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
        <Button
          handleClick={() => setOpenModalCancel(true)}
          title='Cancelar'
          alternative
          noBorder
          className='order-2 mt-4 hidden w-full md:order-none md:mt-0 md:block md:w-auto'
        />
        <div className='flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-2 md:space-y-0'>
          <Button
            className=' w-full  md:w-auto'
            type='submit'
            iconStart='/icons/ArrowLeft.svg'
            alternative
            handleClick={() =>
              dispatch(setNaturalClientTab((naturalClientTab - 1) as any))
            }
            title='Anterior'
          />
          <Button
            className=' w-full md:w-auto'
            type='submit'
            handleClick={() => {
              if (update && selectedPep) {
                state.setAnuallyUpdateData({
                  ...state.anuallyUpdateData,
                  pep: true,
                });
                dispatch(setNaturalClientTab((naturalClientTab + 1) as any));
                return;
              }
              if (
                formSteps.find((step) => step.description === FormStepsEnum.AML)
                  ?.status
              ) {
                selectedPep
                  ? setOpenModalPep(true)
                  : dispatch(
                      setNaturalClientTab((naturalClientTab + 1) as any)
                    );
                return;
              }
              selectedPep ? setOpenModalPep(true) : makeAmlMutation.mutate();
            }}
            iconEnd='/icons/ArrowRight.svg'
            title='Siguiente'
          />
        </div>
      </div>
    </div>
  );
};

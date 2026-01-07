/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

import { Button, Modal } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { MediaQueryEnum } from '@/common/enums';
import { useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { ITypeParticipateItemResponse } from '@/common/interfaces';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { NaturalClientService } from '@/services/NaturalClientService';

export const TypeParticipate = () => {
  const [selectedTypeParticipate, setSelectedTypeParticipate] =
    useStateCallback<number | null>(null);
  const [selectedDeclarement, setSelectedDeclarement] =
    useStateCallback<boolean>(true);
  const [openModalParticipate, setOpenModalParticipate] =
    useStateCallback<boolean>(false);
  const router = useRouter();
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);

  const { forms, submitHandlers, mutations } = useNaturalClient();
  const { isLoading, isFetching, isError, data } =
    useQuery<ITypeParticipateItemResponse>(
      ['type-participate-list'],
      () => NaturalClientService().getTypeParticipate(),
      {
        staleTime: 60000,
        refetchOnWindowFocus: false,
      }
    );

  const loadingParticipate = (isLoading || isFetching) && !isError;

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout>
        <div className='rounded-lg bg-white px-6 py-9'>
          <p className='text-xl font-bold leading-none text-primary-900'>
            Tipo de partícipe
          </p>
          <p className='mt-6 text-primary-900'>
            Antes de comenzar, coméntanos ¿con cuál de las siguientes opciones
            te identificas más?
          </p>
          {loadingParticipate ? (
            <>
              {[1, 2, 3].map((typeParticipate, index) => {
                return (
                  <div
                    className={clsx(
                      'my-8 flex w-full items-start space-x-2 rounded-l'
                    )}
                    key={index}
                  >
                    <div
                      className={clsx(
                        'relative cursor-pointer rounded-full border-2 bg-white p-[10px]'
                      )}
                    ></div>
                    <div className='w-full animate-pulse '>
                      <div className='h-3 w-8/12 rounded-full bg-neutral-200 md:w-3/12'></div>
                      <br />
                      <div className='h-3 w-8/12 rounded-full bg-neutral-200 md:w-5/12'></div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {data?.data.map((typeParticipate, index) => {
                const isSelected =
                  selectedTypeParticipate === typeParticipate.id;
                return (
                  <div
                    className={clsx(
                      'my-8 flex w-full items-start space-x-2 rounded-l'
                    )}
                    key={index}
                  >
                    <div
                      onClick={() => {
                        setSelectedTypeParticipate(typeParticipate.id);
                        forms.typeParticipateForm.setValue(
                          'type_participate_item_id',
                          typeParticipate.id
                        );
                      }}
                      className={clsx(
                        'relative cursor-pointer rounded-full border-2 bg-white p-[10px]',
                        isSelected ? 'border-[#0066CC]' : 'border-neutral-200'
                      )}
                    >
                      {isSelected && (
                        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066CC] p-1.5'></div>
                      )}
                    </div>
                    <div>
                      <span className='text-primary-900'>
                        {typeParticipate.title}
                      </span>
                      <br />
                      <span className='text-sm  text-neutral-400'>
                        {typeParticipate.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div className='mt-10 flex flex-col space-y-4 rounded border border-primary-50 bg-primary-50/30 px-2 py-4'>
            <div className='flex space-x-3'>
              <input
                type='checkbox'
                checked={selectedDeclarement}
                onChange={(event) => {
                  forms.typeParticipateForm.setValue(
                    'certified_information_provided',
                    event.target.checked
                  );
                  setSelectedDeclarement(event.target.checked);
                }}
                className='h-5 w-5 cursor-pointer rounded border-neutral-300 text-prudential-500 ring-0 duration-75 ease-in hover:bg-gray-50 focus:ring-0 md:h-6 md:w-6'
              />
              <span className='text-primary-900'>
                Certifico que la información que voy a proporcionar es
                voluntaria, correcta y corresponde a mis datos reales. Asimismo,
                me comprometo informar a la Administradora de manera inmediata
                respecto a cualquier cambio en los datos que consignaré.
              </span>
            </div>
          </div>
        </div>
        <div className='mb-12 mt-10 flex flex-col items-end justify-between space-x-2 space-y-4 md:flex-row md:space-y-0'>
          <Button
            handleClick={() => router.back()}
            title='Cancelar'
            alternative
            noBorder
            className='order-2 mt-4 w-full md:order-none md:mt-0 md:w-auto'
          />
          <Button
            handleClick={() => {
              if (!loadingParticipate) {
                if (
                  selectedTypeParticipate !==
                  data?.data.find((e) => e.id === 1)!.id
                ) {
                  setOpenModalParticipate(true);
                  return;
                }
              }
              submitHandlers.submitTypeParticipate(
                forms.typeParticipateForm.getValues()
              );
            }}
            disabled={
              !selectedTypeParticipate ||
              loadingParticipate ||
              !selectedDeclarement ||
              mutations.typeParticipateMutation.isLoading
            }
            className=' w-full  md:w-auto'
            loader={mutations.typeParticipateMutation.isLoading}
            title='Comenzar formulario'
          />
        </div>
        {!loadingParticipate && selectedTypeParticipate && (
          <Modal
            isOpen={openModalParticipate}
            title={`Si eliges “${
              data?.data.find((e) => e.id === selectedTypeParticipate)!.title
            }” te contactaremos con un ejecutivo para continuar con tu suscripción.`}
            setIsOpen={setOpenModalParticipate}
            customIcon={<IconDanger className='mb-1' />}
            confirmationText='Enviar mi información'
            confirmationCustomFunction={() =>
              submitHandlers.submitTypeParticipate(
                forms.typeParticipateForm.getValues()
              )
            }
            extended={isMdDown}
            secondaryConfirmationText='Volver al formulario'
          >
            <p className='text-neutral-600'>
              Para continuar el proceso, enviaremos tu información y un asesor
              de inversiones se pondrá en contacto contigo en un plazo máximo de
              48 horas hábiles.
            </p>
          </Modal>
        )}
      </DashboardLayout>
    </div>
  );
};

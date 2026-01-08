/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Button, IconDelete, Modal } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import { useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { IListOrderResponse } from '@/common/interfaces';
import { getDDMMYYYYFormat } from '@/common/utils/convert-date';
import { useOrder } from '@/modules/dashboard/hooks/useOrder';

interface IProps {
  order: IListOrderResponse | undefined;
}

export const ProductCards: FC<IProps> = ({ order }) => {
  const router = useRouter();
  const { state, submitHandlers } = useOrder();
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const [openModalDelete, setOpenModalDelete] = useStateCallback<boolean>(false);
  const [orderId, setOrderId] = useStateCallback<number>(0);
  return (
    <div>
      <div className='mb-6 mt-10 pl-1 md:pl-0'>
        <div className='flex items-center space-x-2'>
          <h3 className='text-xl font-bold text-primary-900'>
            Ordenes
          </h3>
        
        </div>
      </div>
         <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {order?.data.map((order,) => {
            
            return (<div
            key={order.id} 
            className={clsx(
              'mb-10 cursor-pointer rounded-lg bg-white'
            )}
          >
            {true && order ? (
              <div className='w-full rounded-lg bg-white p-4'>
                <div
                    style={{
                      backgroundImage: `url(https://webinversiones-qa.delfosti.site/images/funds/card-primario.jpg)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      height: '150px',
                    }}
                    className='relative w-full rounded-[4px] p-3 text-white'
                  >
                    <button
                      onClick={() =>{
                        setOpenModalDelete(true);
                        setOrderId(order.id);
                      }}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center
                            rounded-full bg-red-600 text-white shadow
                            hover:bg-red-700 focus:outline-none"
                      title="Eliminar"
                    >
                      <IconDelete fill='#fff' />
                    </button>
                    <h6 className='mt-2 text-lg font-semibold leading-[22px] tracking-wide'>
                        #{order.orderNumber}
                    </h6>
                    <div className='hidden md:block'>
                        <p>Monto: {order.total}</p>
                    </div>
                    <br />
                    <br />
                    <p style={{
                      textAlign: 'right',
                      fontWeight: 'bold',
                    }}>{getDDMMYYYYFormat(order.orderDate)}</p>
                  </div>
                <div className='px-3 py-6'>
                  <div className='flex justify-between items-center'>
                    <div
                      className='flex h-4 min-w-min items-center justify-center rounded p-2 py-3 pb-2.5 text-sm leading-none'
                      style={{
                        color: 'rgb(87, 193, 124)',
                        backgroundColor: 'rgba(87, 193, 124, 0.125)',
                      }}
                    >
                      <p style={{fontWeight: 'bold'}}>{order.status.toUpperCase()}</p>
                    </div>
                    <div
                      className='flex h-4 min-w-min items-center justify-center rounded p-2 py-3 pb-2.5 text-sm leading-none'
                      style={{
                      }}
                    >
                        <div
                          className={clsx(
                            'flex grow flex-col items-end',
                          )}
                        >
                          <Button
                            handleClick={() =>{
                              state.setSelectOrder(order);
                              router.push(ContextRoutesEnum.ORDER_UPDATE);
                            }}
                            title="Editar"
                            className='mt-0'
                          />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='w-full animate-pulse rounded-[4px] bg-gradient-to-br p-3 text-white'>
                <div className='flex justify-between'>
                  <div className='rounded-full bg-neutral-200 p-4'></div>
                  <div className='rounded-full bg-neutral-200 p-4'></div>
                </div>
      
                <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
                  <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
                  <div className='mt-1 h-5 w-5/12 rounded-full bg-neutral-200'></div>
                </h6>
                <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
                <div className='py-3 pt-2'>
                  <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
                  <div className='mt-1 flex justify-between'>
                    <div className='h-5 w-5/12 rounded-full bg-neutral-200'></div>
                    <div className='h-4 w-2/12 rounded-full bg-neutral-200'></div>
                  </div>
                </div>
              </div>
            )}
          </div>)
          })}
        </div>
       <Modal
        isOpen={openModalDelete}
        title='¿Seguro que desea eliminar la orden?'
        setIsOpen={setOpenModalDelete}
        customIcon={<IconDanger className='mb-1' />}
        confirmationText='Eliminar'
        confirmationCustomFunction={() => {
          submitHandlers.submitDeleteOrder({
            Id: orderId
          });
          setOpenModalDelete(false);
          
        }}
        extended={isMdDown}
        secondaryConfirmationText='Cancelar'
      >
        <span className='text-neutral-600'>
          Si eliminas la orden ahora, tu información se perderá.
        </span>
      </Modal>
    </div>
    
  );
};

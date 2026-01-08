/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, Modal } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { Input } from '@/common/components/Input';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import { useAppDispatch, useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';
import { useOrder } from '../../hooks/useOrder';
import { getDDMMYYYYFormat } from '@/common/utils/convert-date';
import { formatDate } from '../../utils/date';
export const aceptedImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export enum OrderModeEnum {
  UPDATE = 'UPDATE',
  CREATE = 'CREATE',
}

interface IProps {
  mode: OrderModeEnum;
}

export const Order: FC<IProps> = ({
  mode = OrderModeEnum.CREATE,
}) => {
  const router = useRouter();
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const [, setOpenModalInterrupt] =
    useStateCallback<boolean>(false);
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const { forms, state, submitHandlers, mutations } = useOrder();

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement>,
  ) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const formValues = {
      ...form.getValues()
    };
    const values = formValues;
    submitHandler(values);
  };

  useEffect(() => {
    if (state.selectOrder) {
      forms.updateOrderForm.setValue('customer', state.selectOrder.customer);
      forms.updateOrderForm.setValue('orderDate',  formatDate(new Date(state.selectOrder.orderDate)));
      forms.updateOrderForm.setValue('orderNumber', state.selectOrder.orderNumber);
      forms.updateOrderForm.setValue('total', state.selectOrder.total);
    }
  }, []);

  const form =
    mode === OrderModeEnum.CREATE
      ? forms.createOrderForm
      : forms.updateOrderForm;
  const mutation =
    mode === OrderModeEnum.CREATE
      ? mutations.orderCreateMutation
      : mutations.orderUpdateMutation;
  const submitHandler =
    mode === OrderModeEnum.CREATE
      ? submitHandlers.submitCreateOrder
      : submitHandlers.submitUpdateOrder;

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout routeBack={() => setOpenModalInterrupt(true)}>
        {(
          <div className='relative rounded-lg bg-white px-4 pt-6 md:px-6'>
               <div key={12322}>
                <div className='mt-8 grid grid-cols-12 gap-0 pb-20 text-primary-900 md:gap-10 lg:gap-16'>
                  <div className='col-span-12 md:col-span-6 lg:col-span-8'>
                    <div className='text-primary-900'>
                      <h1 className='text-lg font-bold leading-none md:text-xl'>
                        Detalle de la inversión
                      </h1>
                      <p className='mt-4 leading-none'>
                        Por favor, ingresa el detalle de tu inversión.
                      </p>
                    </div>
                    <div className='mt-10'>
                      <div className='mt-4'>
                        <Input
                          formRegister={form.register}
                          error={form.formState.errors}
                          name='orderNumber'
                          noWhiteSpace
                          noPadding
                          form={form}
                          placeholder='Numero de Orden'
                          type='text'
                        />
                      </div>
                    </div>
                    <div className='mt-10'>
                      <div className='mt-4'>
                        <Input
                          formRegister={form.register}
                          error={form.formState.errors}
                          name='customer'
                          noWhiteSpace
                          noPadding
                          form={form}
                          placeholder='Cliente'
                          type='text'
                        />
                      </div>
                    </div>
                    <div className='mt-10'>
                      <div className='mt-4'>
                        <Input
                          formRegister={form.register}
                          error={form.formState.errors}
                          name='orderDate'
                          placeholder='Fecha de Orden'
                          noPadding
                          noWhiteSpace
                          type='date'
                          form={form}
                        />
                      </div>
                    </div>
                    <div className='mt-10'>
                      <div className='mt-4'>
                        <Input
                          formRegister={form.register}
                          error={form.formState.errors}
                          name='total'
                          noWhiteSpace
                          noPadding
                          form={form}
                          placeholder='Montol Total'
                          type='number'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='absolute left-0 mb-12 mt-10 flex w-full flex-col items-end justify-between space-x-2 space-y-4 pb-14 md:flex-row md:space-y-0'>
                    <Button
                      title='Cancelar'
                      alternative
                      noBorder
                      handleClick={() => setOpenModalCancel(true)}
                      className='order-2 mt-4 w-4/5 self-center md:order-none md:mt-0 md:w-auto md:self-auto'
                    />
                    <Button
                      className='w-4/5 self-center md:w-auto'
                      type='submit'
                      handleClick={handleSubmit}
                      disabled={
                        Object.values(form.getValues()).length < 4 ||
                        Object.values(form.getValues())
                        .map((e) => e.toString().trim())
                        .includes('') ||
                        mutation.isLoading
                      }
                      loader={mutation.isLoading}
                      title= {mode == OrderModeEnum.CREATE ? 'Registrar' : 'Editar'}
                    />
                </div>
              </div>
          </div>
        )}
        <Modal
          isOpen={openModalCancel}
          title='¿Seguro que deseas perder tus cambios?'
          setIsOpen={setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText='Cancelar Orden'
          confirmationCustomFunction={() => {
            router.push(ContextRoutesEnum.DASHBOARD);
          }}
          extended={isMdDown}
          secondaryConfirmationText='Volver al formulario'
        >
          <span className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </span>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

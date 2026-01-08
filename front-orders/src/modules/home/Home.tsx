import { useRouter } from 'next/router';
import { ContextRoutesEnum } from '@/common/enums';
import { useAppSelector } from '@/common/hooks';
import { useHome } from '@/modules/home/hooks/useHome';
import { Card } from '@/common/components';
import clsx from 'clsx';
import { IconInvest } from '@/common/components/icons/dashboard';
import { ProductCards } from './components/ProductCards';

export const Home = () => {
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const { queries } = useHome();
  const router = useRouter();

  const listOrders = queries.listOrdersQuery?.data;

  return (
    <>
      <div className='px-3 lg:px-10'>
        <Card
            title='Lista de ordenes de compra'
            content='¿ Desea agregar una nueva orden ?'
            IconEnd={IconInvest}
            buttonTitle='Agregar'
            size={1}
            buttonHandleClick={() => {
              router.push(ContextRoutesEnum.ORDER_CREATE);
            }}
            className={clsx(
              'col-span-12 min-h-fit rounded-xl bg-white md:col-span-6'
            )}
          />
      </div>
      <div className='mt-8 px-3 lg:px-10'>
        {currentUser?.has_passed_year && currentUser.status !== -3 && (
          <div className='flex items-center justify-between rounded-lg border border-[#E2F4FF] bg-[#E2F4FF4D] p-4'>
            <div className='m-0 flex flex-col'>
              <h4 className='font-bold text-primary-900'>
                Actualiza tus datos
              </h4>
              <span className='text-neutral-500'>
                Para seguir invirtiendo, es necesario actualizar tus datos.
              </span>
            </div>
          </div>
        )}
      </div>
      <div className='px-3 lg:px-10'>
        <ProductCards order={listOrders} />
      </div>
    </>
  );
};

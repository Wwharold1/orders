/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Card } from '@/common/components';
import { ContextRoutesEnum } from '@/common/enums';
import { useStateCallback } from '@/common/hooks';
import usePaginator from '@/common/hooks/usePaginator';
import { IMovement } from '@/common/interfaces/movement.interface';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { MovementCard } from '@/modules/movements/components/MovementCard';
import { MovementTabs, MovementValuesEnum } from '@/modules/movements/enums';
import { MovementService } from '@/services/MovementService';

const pageSizes = [10, 20, 50, 100];

const getFilter = (selectedTab: number) => {
  return { requestType: MovementTabs[selectedTab].filter };
};

export const Movements = () => {
  const [selectedTab, setSelectedTab] = useStateCallback(
    MovementValuesEnum.TODOS
  );
  const router = useRouter();
  const {
    state: { hasPDR },
  } = useRiskProfile(false);

  const {
    setPage,
    paginationComponent,
    query: { data: movementData, refetch, isLoading, isFetching },
  } = usePaginator({
    initPage: 1,
    initLimit: pageSizes[0],
    paginatorOptions: {
      queryKey: ['movement-list', selectedTab.toString()],
      fetch: MovementService().getMovements,
    },
    pageSizes,
    filters: getFilter(selectedTab),
  });

  useEffect(() => {
    setPage(1, () => refetch());
  }, [selectedTab]);

  if (isLoading) {
    return (
      <div className='col-span-12 min-h-fit rounded-xl bg-white'>
        <div className='animate-pulse rounded-[4px] bg-gradient-to-br p-3 text-white'>
          <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
          <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
            <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
            <div className='mt-1 h-4 w-5/12 rounded-full bg-neutral-200'></div>
          </h6>
          <div className='mt-5 py-3 pt-2'>
            <div className='mt-1 flex justify-between'>
              <div className='h-8 w-3/12 rounded-full bg-neutral-200'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!movementData?.data?.length &&
      selectedTab === MovementValuesEnum.TODOS ? (
        <Card
          title='No hay movimientos registrados'
          content='Realiza tu primera inversión y cumple tus objetivos de ahorro e inversión.'
          buttonTitle='Invertir ahora'
          buttonHandleClick={() =>
            router.push(
              hasPDR
                ? ContextRoutesEnum.PRODUCTS_RECOMMENDED
                : ContextRoutesEnum.DASHBOARD_RISK_PROFILE
            )
          }
          size={1}
        />
      ) : (
        <div className='relative rounded-lg bg-white p-6 shadow-md'>
          <Tab.Group
            selectedIndex={selectedTab}
            onChange={(e) => setSelectedTab(e)}
          >
            <Tab.List className='space-x-4 rounded-lg border-b border-neutral-100 ring-0'>
              {MovementTabs.map((tab) => (
                <Tab key={tab.value}>
                  {({ selected }) => (
                    <div
                      className={clsx(
                        'relative p-4 px-0 pb-2.5 font-bold transition-all duration-150 ease-in hover:!text-primary-400',
                        selected ? 'text-primary-500' : 'text-neutral-400'
                      )}
                    >
                      {tab.title}
                      {selected && (
                        <div className='absolute bottom-0 left-1/2 h-1.5 w-full -translate-x-1/2 rounded-t-md bg-primary-500'></div>
                      )}
                    </div>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className='my-3'>
              {isFetching ? (
                <div className='col-span-12 min-h-fit rounded-xl bg-white'>
                  <div className='animate-pulse rounded-[4px] bg-gradient-to-br p-3 text-white'>
                    <div className='mt-4 h-4 w-2/12 rounded-full bg-neutral-200'></div>
                    <h6 className='mt-4 text-lg font-semibold leading-[22px] tracking-wide'>
                      <div className='h-4 w-11/12 rounded-full bg-neutral-200'></div>
                      <div className='mt-1 h-4 w-5/12 rounded-full bg-neutral-200'></div>
                    </h6>
                    <div className='mt-5 py-3 pt-2'>
                      <div className='mt-1 flex justify-between'>
                        <div className='h-8 w-3/12 rounded-full bg-neutral-200'></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !movementData?.data?.length ? (
                <div className='my-8 py-8 text-center text-lg font-bold text-[#67747B]'>
                  Todavía no se registran {MovementTabs[selectedTab].plural}
                </div>
              ) : (
                <>
                  {MovementTabs.map((tab) => (
                    <Tab.Panel key={tab.value}>
                      {movementData?.data?.map((movement: IMovement) => (
                        <MovementCard key={movement.id} movement={movement} />
                      ))}
                    </Tab.Panel>
                  ))}
                </>
              )}
            </Tab.Panels>
          </Tab.Group>
          {/* {!isLoading && !isFetching && <>{paginationComponent()}</>} */}
          {paginationComponent()}
        </div>
      )}
    </>
  );
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { IconAdd } from '@/common/components/icons/movements/IconAdd';
import { IconInternalTransfer } from '@/common/components/icons/movements/IconInternalTransfer';
import { IconRemove } from '@/common/components/icons/movements/IconRemove';
import { ContextRoutesEnum } from '@/common/enums';
import { useAppDispatch, useAppSelector } from '@/common/hooks';
import { IMovement } from '@/common/interfaces/movement.interface';
import {
  SubscriptionFormEnum,
  TabInvestmentSubscriptionEnum,
} from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setInvestmentTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { setCurrentFund } from '@/modules/dashboard/slice/subscriptionSlice';
import {
  MoneyTypeSymbolEnum,
  MovementStatusData,
  MovementStatusEnum,
  TypeMovementEnum,
} from '@/modules/movements/enums';

interface IProps {
  movement: IMovement;
}

export const MovementCard: FC<IProps> = ({ movement }) => {
  const status = MovementStatusData.find(
    (e) =>
      e.type ===
      MovementStatusEnum[
        movement.descripParametro as keyof typeof MovementStatusEnum
      ]
  );
  const isPending = movement.descripParametro === 'PENDING';
  const isRescue = movement.tipoSolicitud === TypeMovementEnum.RESCUE;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const funds = useAppSelector((state) => state.subscription.funds);

  return (
    <div
      className={clsx(
        'col-span-12 flex items-start space-x-2 rounded-lg border-b-2 border-dashed bg-white py-3.5',
        isPending && !isRescue && 'cursor-pointer'
      )}
      onClick={() => {
        if (isPending && !isRescue) {
          localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_DETAIL);
          localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_RECEIPT);
          dispatch(
            setCurrentFund(funds.find((e) => e.id === movement.fund_id)!)
          );
          router.push(
            {
              pathname: ContextRoutesEnum.SUBSCRIPTION_INVESTMENT,
              query: {
                id: movement.id,
                amount: movement.montoNetoSolicitud,
                moneda: movement.moneda,
                funds_origin_id: movement.fund_origin,
              },
            },
            ContextRoutesEnum.SUBSCRIPTION_INVESTMENT
          );
          dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.DETAIL));
        }
      }}
    >
      {movement.tipoSolicitud === TypeMovementEnum.SUBSCRIPTION ? (
        <div className={clsx('rounded-full bg-[#85BC49] p-1')}>
          <IconAdd />
        </div>
      ) : (
        <div className={clsx('rounded-full bg-[#D53943] p-1')}>
          <IconRemove />
        </div>
      )}
      <div className='flex w-full flex-col'>
        <div className='flex w-full justify-between text-primary-900'>
          <div>
            <h6
              className={clsx(
                'mb-3 block text-lg font-bold md:hidden',
                movement.tipoSolicitud === TypeMovementEnum.SUBSCRIPTION
                  ? 'text-[#85BC49]'
                  : 'text-[#D53943]'
              )}
            >
              {
                MoneyTypeSymbolEnum[
                  movement.moneda as keyof typeof MoneyTypeSymbolEnum
                ]
              }
              {roundToTwoDecimalsString(movement.montoNetoSolicitud)}
            </h6>
            <h4 className='text-lg font-bold '>{movement.descripFondo}</h4>
          </div>
          <h6
            className={clsx(
              'hidden text-lg font-bold md:block',
              movement.tipoSolicitud === TypeMovementEnum.SUBSCRIPTION
                ? 'text-[#85BC49]'
                : 'text-[#D53943]'
            )}
          >
            {movement.tipoSolicitud === TypeMovementEnum.SUBSCRIPTION
              ? '+ '
              : '- '}

            {
              MoneyTypeSymbolEnum[
                movement.moneda as keyof typeof MoneyTypeSymbolEnum
              ]
            }
            {roundToTwoDecimalsString(movement.montoNetoSolicitud)}
          </h6>
        </div>
        <div className='mt-1 flex items-center gap-3 text-primary-900'>
          <h6>{movement.descripFondoSerie}</h6>
          {movement.internal_transfer && (
            <div className='border-lg flex items-center gap-1 rounded-lg border border-[#BFE1E1] bg-[#EEF7F8] px-1 py-0.5 text-[11px] font-bold text-[#018786]'>
              <IconInternalTransfer />
              Traspaso
            </div>
          )}
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <h6
            style={{
              backgroundColor: status?.background,
              color: status?.font,
            }}
            className='mb-1 rounded p-2 text-xs font-bold leading-none md:mb-0'
          >
            {
              MovementStatusEnum[
                movement.descripParametro as keyof typeof MovementStatusEnum
              ]
            }
          </h6>
          <h6 className='text-sm leading-none text-neutral-300'>
            {getDDMMYYYYFormat(
              new Date(movement.fechaSolicitud).toDateString()
            )}
          </h6>
        </div>
      </div>
    </div>
  );
};

export const getDDMMYYYYFormat = (createdAt: string): string => {
  const date = new Date(createdAt);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = String(date.getUTCFullYear());

  return `${day} / ${month} / ${year}`;
};

function roundToTwoDecimalsString(num: number): string {
  return (Math.round(num * 100) / 100).toFixed(2);
}

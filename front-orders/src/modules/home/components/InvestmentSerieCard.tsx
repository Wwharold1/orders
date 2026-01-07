/* eslint-disable @typescript-eslint/no-non-null-assertion */
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';

import { Button, Modal } from '@/common/components';
import { IconHide } from '@/common/components/icons/dashboard/IconHide';
import { IconPasswordClosed } from '@/common/components/icons/dashboard/IconPasswordClosed';
import IconInfo from '@/common/components/icons/utils/IconInfo';
import { Tooltip } from '@/common/components/Tooltip';
import { ContextRoutesEnum, ContextSplashEnum } from '@/common/enums';
import { convertAmount } from '@/common/helper';
import {
  useAppDispatch,
  useAppSelector,
  useStatePersist,
} from '@/common/hooks';
import { IFund, IFundsSerie } from '@/common/interfaces';
import { getDDMMYYYYFormat } from '@/common/utils/convert-date';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { SubscriptionFormEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import { setCurrentFund } from '@/modules/dashboard/slice/subscriptionSlice';
import { SpectrumConverted } from '@/modules/home/enum/money.type.enum';
import { FundProductBg } from '@/modules/home/utils/fundProducts';
import { RescueFormEnum } from '@/modules/rescue/enum/rescue.form.enum';
import {
  setCurrentMoneyType,
  setCurrentRescueFund,
} from '@/modules/rescue/slice/rescueSlice';
import { setSplash } from '@/redux/common/layoutSlice';

interface IProps {
  fundItem: IFundsSerie;
}

export const InvestmentSerieCard: FC<IProps> = ({ fundItem }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const [openNoExistModal, setOpenNoExistModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useStatePersist<boolean>(
    true,
    'fund-item-' + fundItem.cod_fund + '-' + fundItem.cod_fund_serie
  );
  const {
    state: { hasPDR },
  } = useRiskProfile(false);

  const { funds } = useAppSelector((state) => state.subscription);

  const Fund = FundProductBg.find(
    (fundbg) => fundbg.codFund === (fundItem && fundItem.cod_fund)
  )!;

  const _handleOpenModal = () => {
    setOpenNoExistModal(true);
  };

  const onHandleClickInvest = () => {
    if (currentUser?.has_passed_year && currentUser.status !== -3) {
      dispatch(
        setSplash({
          show: true,
          type: ContextSplashEnum.ANUALLY_UPDATED,
        })
      );
      return;
    }
    if (!hasPDR) {
      router.push(ContextRoutesEnum.DASHBOARD_RISK_PROFILE);
      return;
    }
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_DETAIL);
    localStorage.removeItem(SubscriptionFormEnum.SUBCRIPTION_RECEIPT);

    const currentFund = funds.find((a: IFund) => a.id === fundItem.fund_id);
    if (!currentFund) throw new Error('Fund not found');

    dispatch(setCurrentFund(currentFund)); // Update the type of fundItem
    router.push(ContextRoutesEnum.SUBSCRIPTION_INVESTMENT);
  };

  return (
    <div className='relative col-span-12 mb-10 flex flex-col rounded-t-2xl border-b-[10px] border-[#0066CC] bg-white p-4 px-5 pb-2 pt-10 md:col-span-6 md:mb-10 md:mr-0 md:p-4 md:pt-4'>
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${Fund?.from}, ${Fund?.to})`,
        }}
        className='relative hidden self-start rounded-[4px] p-1 text-white md:block'
      >
        <svg
          className='absolute right-0 top-0 w-full'
          width='100%'
          height='100%'
          viewBox='0 0 352 129'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M85.809 51.6909C53.2128 42.2386 15.0213 55.6294 0 63.5064V129H632V-25.9835C600.455 -20.5765 573.658 -21.9786 568.589 6.25821C564.454 29.2883 564.27 45.7097 542.302 50.5159C520.215 55.3478 507.377 27.0853 485.221 6.25821C467.496 -10.4035 437.644 11.2778 426.628 18.2201C407.1 30.3026 362.708 3.94054 343.47 -16.782C316 -46.3714 279.875 -49.0777 252.591 -16.782C225.308 15.5138 198.246 -10.9642 164.26 6.25821C130.275 23.4806 126.554 63.5064 85.809 51.6909Z'
            fill={`url(#${Fund?.codFund})`}
          />
          <defs>
            <linearGradient
              id={Fund?.codFund}
              x1='316'
              y1='-40'
              x2='316'
              y2='129'
              gradientUnits='userSpaceOnUse'
            >
              <stop stopColor={Fund?.gradient} stopOpacity='0.5' />
              <stop offset='1' stopColor={Fund?.gradient} stopOpacity='0' />
            </linearGradient>
          </defs>
        </svg>
        <div className='relative flex justify-between overflow-hidden'></div>
      </div>
      <div>
        <h1 className='mt-4 text-lg font-bold text-primary-900'>
          <div className='hidden md:block'>{fundItem.fund_description}</div>
          <div className='block md:hidden'>
            {fundItem.fund_description?.length > 40 ? (
              <>{fundItem.fund_description}</>
            ) : (
              <>
                {fundItem.fund_description
                  .split(' ')
                  .slice(0, fundItem.fund_description.split(' ').length - 1)
                  .join(' ')}
                <br />
                {
                  fundItem.fund_description.split(' ')[
                    fundItem.fund_description.split(' ').length - 1
                  ]
                }
              </>
            )}
          </div>
        </h1>
        <p className='mt-1 text-primary-900 md:mt-6'>
          {fundItem.serie_description
            .split(' ')
            .map(
              (e) => e.at(0)!.toUpperCase() + e.slice(1, e.length).toLowerCase()
            )
            .join(' ')}
        </p>
        <div className='mt-4 flex items-center space-x-1'>
          <p className='text-sm font-bold text-neutral-300'>SALDO ACTUAL</p>
          <Tooltip
            ButtonIcon={IconInfo}
            content='Suscripciones - Rescates + Rentabilidad'
            title='Saldo actual'
          />
        </div>
        <div className='relative mt-1 inline-flex space-x-1 md:mt-1.5'>
          <p className='relative h-10 text-2xl font-bold leading-none text-primary-900 md:text-[28px]'>
            {SpectrumConverted[
              fundItem.money_type as keyof typeof SpectrumConverted
            ] + ' '}
            {showPassword ? convertAmount(fundItem.current_balance) : '****'}
          </p>
          <div
            className={clsx(
              'absolute -right-12 -top-1.5 z-10 grid cursor-pointer place-content-center rounded-full p-2 hover:bg-gray-100 md:-top-1.5'
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IconPasswordClosed className='scale-95' fill='#B8BFC3' />
            ) : (
              <IconHide fill='#B8BFC3' />
            )}
          </div>
        </div>
      </div>
      <div className='mt-2 flex items-center space-x-1'>
        <p className='text-sm font-bold text-neutral-300'>
          {`${new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          }).format(fundItem.installments_number)} cuotas`}
        </p>
      </div>
      <div className='mt-2 flex items-center space-x-1'>
        <p className='text-sm font-bold text-neutral-300'>FECHA VALOR</p>
        <Tooltip
          ButtonIcon={IconInfo}
          content={getDDMMYYYYFormat(fundItem.date_value)}
          title='Fecha valor'
        />
      </div>
      <div className='flex items-start gap-2 rounded bg-[#F6F0FB] p-2'>
        <Image
          src='/icons/infoCard.svg'
          alt='info money transfer'
          width={20}
          height={20}
          className='mt-1 md:mt-0.5'
        />
        <span className='mt-1 text-sm font-semibold text-[#A36FD7]'>
          En caso cuente con operaciones pendientes, el monto será actualizado
          una vez que la operación haya sido procesada
        </span>
      </div>
      <div className='mb-4 mt-7 flex w-full flex-grow space-x-2'>
        <Button
          handleClick={onHandleClickInvest}
          className='w-full'
          title='Invertir'
        />

        <Button
          className={clsx(
            'w-full',
            fundItem.disabled &&
              '!text-primary-500/50 opacity-50 !ring-primary-500/50 hover:scale-100 active:scale-100'
          )}
          disabled={fundItem.disabled || fundItem.current_balance === 0}
          // FUNCIONALIDAD PARA RESCATE
          handleClick={() => {
            dispatch(setCurrentRescueFund(fundItem.fund_spectrum));
            dispatch(setCurrentMoneyType(fundItem.money_type));
            localStorage.removeItem(RescueFormEnum.RESCUE_DETAIL);
            localStorage.removeItem('is-partial');
            localStorage.removeItem('is-quotes');
            router.push(ContextRoutesEnum.RESCUE_BIOMETRIC_VALIDATION);
          }}
          // FUNCIONALIDAD PARA RESCATE - DESHABILITADO
          // handleClick={() => handleOpenModal()}
          title='Rescatar'
          alternative
        />
      </div>
      <Modal
        urlIcon='/icons/celebration.svg'
        title='Tenemos buenas noticias'
        isOpen={openNoExistModal}
        modalLength={450}
        setIsOpen={setOpenNoExistModal}
        confirmationText='Entendido'
        closeIcon
      >
        <span>
          Próximamente podrás realizar tus operaciones de rescate por este
          canal. Si tienes un requerimiento, por favor contáctate con tu Asesor
          de Inversiones o envíanos un email a <br></br>
        </span>
        <span className='cursor-pointer font-bold  text-primary-500'>
          backoffice@prudentialsaf.com.pe
        </span>
      </Modal>
    </div>
  );
};

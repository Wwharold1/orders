/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import { Button, Card, Modal } from '@/common/components';
import { IconEdit } from '@/common/components/icons/accounts';
import { IconStar } from '@/common/components/icons/dashboard';
import { IconDocument } from '@/common/components/icons/products/IconDocument';
import { IconEmail } from '@/common/components/icons/profile/IconEmail';
import { IconEmptyDocument } from '@/common/components/icons/profile/IconEmptyDocument';
import { IconPhone } from '@/common/components/icons/profile/IconPhone';
import {
  ContextRoutesEnum,
  ContextSidebarEnum,
  MediaQueryEnum,
} from '@/common/enums';
import { AUTH_LOCAL_STORAGE_KEY } from '@/common/helper';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import {
  setChangeFinalBeneficiaryTab,
  setFormBeneficiaryFinal,
  setIsFinalBeneficiaryDatabase,
  setIsFinalBeneficiaryFromModal,
} from '@/modules/dashboard/slice/finalBeneficiarySlice';
import {
  setChangeRiskTab,
  setIsFromOpenYourAccount,
} from '@/modules/dashboard/slice/riskProfileSlice';
import { AssociateProduct } from '@/modules/profile/components/AssociateProduct';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { RiskProfilesBg } from '@/modules/profile/utils/riskProfiles';
import { setSidebar } from '@/redux/common/layoutSlice';
import { NaturalClientService } from '@/services/NaturalClientService';

export const Profile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { queries } = useProfile(true);
  const { funds } = useAppSelector((state) => state.subscription);
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const currentRisk = useAppSelector((state) => state.riskProfile);

  const {
    state: { hasPDR },
  } = useRiskProfile(false);

  const RiskProfile = currentRisk.customer_risk
    ? RiskProfilesBg.find(
        (fundbg) =>
          fundbg.name ===
          ('customer_risk_profile' in currentRisk.customer_risk!
            ? currentRisk.customer_risk.customer_risk_profile
            : currentRisk.customer_risk?.name)
      )!
    : undefined;

  const lsValue = JSON.parse(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)!);

  const isMdDown = useMediaQuery(MediaQueryEnum.MD);

  const [isFinalBeneficiary, setFinalBeneficiary] =
    useStateCallback<boolean>(false);

  const [openFinalBeneficiary, setOpenFinalBeneficiary] =
    useStateCallback<boolean>(false);

  const [openNotFinalBeneficiary, setOpenNotFinalBeneficiary] =
    useStateCallback<boolean>(false);

  const { data: finalBeneficiaryData } = useQuery<any>(
    ['final-beneficiary-list'],
    () =>
      NaturalClientService().getFinalBeneficiary(
        lsValue ? lsValue.user.id : ''
      ),
    {
      onSuccess: (data) => {
        if (data.updated_at) setFinalBeneficiary(true);
        else setFinalBeneficiary(false);
        setIsFinalBeneficiaryDatabase(isFinalBeneficiary);
      },
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  return (
    <div>
      <div className='grid w-full grid-cols-12 gap-x-6 gap-y-6 text-primary-900 lg:gap-y-0'>
        <div className='col-span-12 inline-flex max-h-full flex-col rounded-lg lg:col-span-8'>
          <div className='inline-flex max-h-full flex-col rounded-lg bg-white p-6'>
            <div
              onClick={() => router.push(ContextRoutesEnum.EDIT_PROFILE)}
              className='flex cursor-pointer items-center space-x-1 self-end'
            >
              <IconEdit fill='#0066CC' className='mb-0.5' />
              <p className='font-bold leading-none text-prudential-500'>
                Editar
              </p>
            </div>
            <div className='flex flex-col space-y-3'>
              <p className='mb-1 text-xl font-bold'>{currentUser?.username}</p>
              <div className='flex items-center space-x-1'>
                <IconEmail fill='#0066CC' className='mb-0.5' />
                <p className='leading-none'>{currentUser?.email}</p>
              </div>
              <div className='flex items-center space-x-1'>
                <IconPhone fill='#0066CC' className='mb-1' />
                <p className='leading-none'>{currentUser?.phone_number}</p>
              </div>
            </div>
          </div>
          {!hasPDR && (
            <Card
              title='Queremos conocerte'
              content='Antes de comenzar a invertir, es importante conocer tu perfil de tolerancia al riesgo para darte las mejores recomendaciones.
        Te tomará un par de minutos.'
              buttonHandleClick={() => {
                dispatch(setIsFromOpenYourAccount(false));
                router.push(ContextRoutesEnum.DASHBOARD_RISK_PROFILE);
              }}
              className='mt-6 !block lg:!hidden'
              buttonClassName='!px-4 !text-base'
              buttonTitle='Comenzar cuestionario'
              size={1}
            />
          )}
          <div className='mt-6 inline-flex max-h-full flex-col rounded-lg bg-white p-6'>
            <div className='flex flex-col space-y-3'>
              <p className='mb-1 text-xl font-bold'>Estados de Cuenta </p>
              <p className='text-sm text-neutral-500'>
                Descarga los Estados de Cuenta de los últimos 3 meses y haz
                seguimiento de tus inversiones.{' '}
              </p>
            </div>
            <div className='mt-6'>
              <Button
                handleClick={() =>
                  router.push(ContextRoutesEnum.PROFILE_DOWNLOAD_EECC)
                }
                title='Consultar'
              />
            </div>
          </div>
          {isFinalBeneficiary ? (
            <div className='mt-6 inline-flex max-h-full flex-col rounded-lg bg-white p-6'>
              <div className='flex flex-col space-y-3'>
                <p className='mb-1 text-xl font-bold'>Beneficiario final </p>
                <p className='text-sm text-neutral-500'>
                  Ya se ha registrado el beneficiario final. Si necesita
                  realizar alguna modificación, por favor comuníquese con su
                  asesor.
                </p>
              </div>
              <div className='mt-6'>
                <Button
                  handleClick={() => setOpenFinalBeneficiary(true)}
                  title='Ver datos'
                />
              </div>
            </div>
          ) : (
            <div className='mt-6 inline-flex max-h-full flex-col rounded-lg bg-white p-6'>
              <div className='flex flex-col space-y-3'>
                <p className='mb-1 text-xl font-bold'>Beneficiario final </p>
                <p className='text-sm text-neutral-500'>
                  A partir de octubre del 2025, la SUNAT exigirá a todas las
                  SAFs (Sociedades Administradoras de Fondos) reportar la
                  identidad de los beneficiarios finales de los fondos. Esta
                  nueva regulación busca garantizar mayor transparencia y
                  cumplimiento normativo.{' '}
                </p>
              </div>
              <div className='mt-6'>
                <Button
                  handleClick={() => setOpenNotFinalBeneficiary(true)}
                  title='Registrar beneficiario final'
                />
              </div>
            </div>
          )}{' '}
          <div className='mb-6 mt-10 pl-1 md:pl-0'>
            <div className='flex items-center space-x-2'>
              <h3 className='text-xl font-bold text-primary-900'>
                Documentos asociados{' '}
              </h3>
            </div>
            <p className='text-sm text-neutral-500'>
              Accede a los documentos de los Fondos Mutuos en los que
              invertiste.{' '}
            </p>
          </div>
          {queries.listFundsByCustomerQuery?.isLoading ? (
            <div className='animate-pulse rounded-lg bg-white p-2'>
              <div className='flex flex-col items-center justify-center bg-neutral-50 py-6 text-primary-500'>
                <div className='h-10 w-10 rounded-xl bg-neutral-200'></div>
                <div className='mt-1 h-4 w-5/12 rounded-full bg-neutral-200'></div>
                <div className='mt-1 h-4 w-4/12 rounded-full bg-neutral-200'></div>
              </div>
            </div>
          ) : queries.listFundsByCustomerQuery?.data?.data?.filter(
              (fund) => !!fund.is_approved
            )?.length && !!funds?.length ? (
            <div className='mb-6 grid grid-cols-12 gap-4'>
              {queries.listFundsByCustomerQuery?.data?.data
                .filter((fund) => !!fund.is_approved)
                .map((fund, index) => {
                  return <AssociateProduct fund={fund} key={index} />;
                })}
            </div>
          ) : (
            <div className='rounded-lg bg-white p-2'>
              <div className='flex flex-col items-center justify-center bg-[#E2F4FF4D] py-6 text-primary-500'>
                <IconEmptyDocument />
                <p className='pt-2 text-sm font-bold'>
                  Los documentos aparecerán en este espacio
                </p>
                <p className='text-xs'>
                  Para comenzar, haz tu primera inversión
                </p>
              </div>
            </div>
          )}
        </div>
        <div className='col-span-12 flex min-h-fit flex-col rounded-lg lg:col-span-4'>
          {hasPDR && RiskProfile ? (
            <div className='order-2 mb-6 w-full rounded-lg bg-white p-2 md:order-1 md:mb-0'>
              <div className='relative'>
                <div
                  style={{
                    backgroundImage: `linear-gradient(147deg, ${RiskProfile?.from}, ${RiskProfile?.to})`,
                  }}
                  className='h-20 rounded md:h-16'
                ></div>
                <div className='absolute -bottom-16 left-1/2 grid -translate-x-1/2 place-content-center rounded-full bg-white p-2 md:-bottom-16'>
                  <RiskProfile.icon className='scale-110' />
                </div>
                <div className='absolute right-6 top-1/2 grid -translate-y-1/2 place-content-center rounded-lg bg-white/20 p-2.5'>
                  <IconStar fill='#FFFFFF' className='scale-150' />
                </div>
              </div>
              <div className='p-7'>
                <div className='mt-20 flex flex-col items-center text-center text-primary-900 md:mt-14 md:block'>
                  <p className='text-xl font-bold'>
                    {'customer_risk_profile' in currentRisk.customer_risk!
                      ? currentRisk.customer_risk?.customer_risk_profile.toUpperCase()
                      : currentRisk.customer_risk?.name.toUpperCase()}
                  </p>
                  <p className='font-bold text-neutral-400'>
                    {currentRisk.customer_risk?.subtitle.toUpperCase()}
                  </p>
                </div>
                <div className='mt-5 h-0.5 bg-neutral-100'></div>
                <div className='mt-5 text-primary-900'>
                  <p className='mb-2 text-base font-bold'>Sobre el perfil</p>
                  {currentRisk.customer_risk?.detail}
                </div>
                <div className='mt-5 flex flex-col'>
                  <Button
                    className='w-full md:px-16'
                    handleClick={() => {
                      dispatch(setSidebar(ContextSidebarEnum.HOME));

                      router.push(ContextRoutesEnum.PRODUCTS_RECOMMENDED);
                    }}
                    title='Invertir'
                  />
                  {!!queries.listFundsByCustomerQuery?.data?.data?.length && (
                    <Button
                      className='mt-2 w-full md:px-16'
                      handleClick={() => {
                        router.push(ContextRoutesEnum.PROFILE_CHANGE_RISK);
                        dispatch(setChangeRiskTab(0));
                      }}
                      alternative
                      title='Cambiar perfil'
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card
              title='Queremos conocerte'
              content='Antes de comenzar a invertir, es importante conocer tu perfil de tolerancia al riesgo para darte las mejores recomendaciones.
        Te tomará un par de minutos.'
              buttonHandleClick={() => {
                dispatch(setIsFromOpenYourAccount(false));
                router.push(ContextRoutesEnum.DASHBOARD_RISK_PROFILE);
              }}
              className='!hidden !px-6 lg:!block'
              buttonClassName='!px-4 !text-base !self-start'
              buttonTitle='Comenzar cuestionario'
              size={1}
            />
          )}
          <div className='order-2 my-6 rounded-lg bg-white p-2'>
            <div className='relative border border-primary-50 bg-[#E2F4FF4D] px-3 py-4'>
              <IconDocument className='absolute mb-0.5' />
              <p className='indent-5 text-sm font-bold text-primary-900'>
                ¿Deseas solicitar tu certificado de participación?
              </p>
              <p className='mt-3 text-sm'>
                Envíanos un email a{' '}
                <a
                  href='mailto:backoffice@prudentialsaf.com.pe'
                  target='_blank'
                  className='cursor-pointer font-bold text-prudential-500 focus-visible:outline-none'
                >
                  backoffice@prudentialsaf.com.pe
                </a>{' '}
                con tu requerimiento. Recuerda que, para poder generar tu
                certificado, es necesario que transcurran 5 días hábiles desde
                que recibiste la confirmación de tu inversión.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openFinalBeneficiary}
        title='Beneficiario final'
        setIsOpen={setOpenFinalBeneficiary}
        customIcon={<IconEdit fill='#007BC3' className='ml-1' />}
        modalLength={300}
        extended={isMdDown}
        onlyTitle
        closeIcon
      >
        <p>
          {finalBeneficiaryData?.name_beneficiary +
            ' ' +
            finalBeneficiaryData?.lastname_beneficiary}
          <br />
          {'DNI ' + finalBeneficiaryData?.document_number}
        </p>
      </Modal>
      <Modal
        isOpen={openNotFinalBeneficiary}
        title='Información necesaria'
        setIsOpen={setOpenNotFinalBeneficiary}
        customIcon={<IconEdit fill='#007BC3' className='ml-1' />}
        confirmationText='Soy el beneficiario final'
        confirmationCustomFunction={() => {
          dispatch(setFormBeneficiaryFinal(null));
          dispatch(setIsFinalBeneficiaryFromModal(true));
          router.push(ContextRoutesEnum.PROFILE_FINAL_BENEFICIARY);
        }}
        secondaryConfirmationText='No soy el beneficiario final'
        secondaryCustomFunction={() => {
          dispatch(setChangeFinalBeneficiaryTab(0));
          dispatch(setFormBeneficiaryFinal(null));
          dispatch(setIsFinalBeneficiaryFromModal(false));
          router.push(ContextRoutesEnum.PROFILE_FINAL_BENEFICIARY);
        }}
        extended={isMdDown}
        modalLength={600}
        onlyTitle
        closeIcon
      >
        <p>
          Tu información es importante para cumplir con las regulaciones y
          mantener la transparencia. Indícanos si eres el beneficiario final.
        </p>
      </Modal>
    </div>
  );
};

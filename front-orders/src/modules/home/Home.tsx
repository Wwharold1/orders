import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { Modal } from '@/common/components';
import { IconEdit } from '@/common/components/icons/accounts';
import { IconArrowLeft } from '@/common/components/icons/utils/IconArrowLeft';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import { AUTH_LOCAL_STORAGE_KEY } from '@/common/helper';
import { useAppSelector, useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { apiUrl } from '@/common/utils/axios';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import {
  setChangeFinalBeneficiaryTab,
  setFormBeneficiaryFinal,
  setIsFinalBeneficiaryDatabase,
  setIsFinalBeneficiaryFromModal,
} from '@/modules/dashboard/slice/finalBeneficiarySlice';
import { CardDisclaimer } from '@/modules/home/components/CardDisclaimer';
import { InvestmentCards } from '@/modules/home/components/InvestmentCards';
import { NoInvestmentCards } from '@/modules/home/components/NoInvestmentCards';
import { ProductCards } from '@/modules/home/components/ProductCards';
import { useHome } from '@/modules/home/hooks/useHome';
import { toggleOpenedAnuallyUpdate } from '@/redux/common/layoutSlice';
import { NaturalClientService } from '@/services/NaturalClientService';

export const Home = () => {
  // const treatment = localStorage.getItem('dataTreatment');
  // const currentUser = useAppSelector((state) => state.session.currentUser);
  // const validateCountTreatment =
  //   !currentUser?.accept_data_treatment &&
  //   (currentUser?.data_treatment_reject_count ?? 0) <= 3;
  // const [openModalCancel, setOpenModalCancel] = useStateCallback<boolean>(
  //   (validateCountTreatment && treatment === null) ||
  //     (validateCountTreatment && treatment !== 'false')
  // );
  // const { queries } = useHome();
  // const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  // const {
  //   state: { hasPDR },
  // } = useRiskProfile(false);
  // const dispatch = useDispatch();
  // const router = useRouter();

  // const listFundsData = queries.listFundsByCustomerQuery?.data;

  // // Función reutilizable para actualizar tratamiento de datos
  // const handleUpdateDataTreatment = async (acceptDataTreatment: boolean) => {
  //   try {
  //     await apiUrl.post('/app/customer/update-data-treatment', {
  //       accept_data_treatment: acceptDataTreatment,
  //     });
  //     localStorage.setItem('dataTreatment', 'false');
  //   } catch (error: unknown) {
  //     // eslint-disable-next-line no-console
  //   }
  // };

  // const [openFinalBeneficiary, setFinalBeneficiary] =
  //   useStateCallback<boolean>(false);
  // const lsValue = JSON.parse(localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)!);
  // const { isFinalBeneficiaryDatabase } = useAppSelector(
  //   (state) => state.finalBeneficiary
  // );

  // useQuery<any>(
  //   ['final-beneficiary-list-dashboard'],
  //   () =>
  //     NaturalClientService().getFinalBeneficiary(
  //       lsValue ? lsValue.user.id : ''
  //     ),
  //   {
  //     refetchOnMount: true,
  //     refetchOnWindowFocus: true,
  //     onSuccess: (res) => {
  //       if (res.statusCode) {
  //         setFinalBeneficiary(true);
  //         dispatch(setIsFinalBeneficiaryDatabase(true));
  //       } else {
  //         dispatch(setIsFinalBeneficiaryDatabase(false));
  //       }
  //     },
  //     enabled: !isFinalBeneficiaryDatabase,
  //   }
  // );

  // const modalImageStyle = {
  //   backgroundImage: 'url(/images/modalPerson.jpg)',
  //   height: '354px',
  //   width: '432px',
  //   backgroundSize: 'cover',
  //   backgroundRepeat: 'no-repeat',
  // };

  return (
    <>
      {/* {listFundsData?.data.funds_serie.length ||
      listFundsData?.data.funds.length ? (
        <InvestmentCards listFundsData={listFundsData.data} />
      ) : (
        <div className='px-3 lg:px-10'>
          <NoInvestmentCards
            withPDR={hasPDR}
            loading={queries.listFundsByCustomerQuery?.isLoading}
          />
        </div>
      )}
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
            <div
              onClick={() => {
                dispatch(toggleOpenedAnuallyUpdate(true));
                router.push(
                  {
                    pathname: ContextRoutesEnum.DASHBOARD_RISK_PROFILE,
                    query: {
                      anually_update: true,
                    },
                  },
                  ContextRoutesEnum.DASHBOARD_RISK_PROFILE
                );
              }}
              className='grid h-10 w-10 cursor-pointer place-content-center rounded-full bg-[#018786] p-3'
            >
              <IconArrowLeft className='rotate-180 scale-125' fill='white' />
            </div>
          </div>
        )}
      </div>
      <div className='px-3 lg:px-10'>
        <ProductCards withPDR={hasPDR} />
        <CardDisclaimer withPDR={hasPDR} />
      </div>
      <Modal
        isOpen={openModalCancel}
        setIsOpen={setOpenModalCancel}
        confirmationText='Sí deseo'
        modalNews={true}
        confirmationCustomFunction={async () => {
          await handleUpdateDataTreatment(true); // Maneja el caso de "true"
        }}
        confirmationModalCustomFunction={async () => {
          await handleUpdateDataTreatment(false); // Maneja el caso de "false"
        }}
        closeIcon
        extended={isMdDown}
      >
        <main className='flex flex-col gap-4'>
          <div className='flex h-[354px] w-full items-center justify-center'>
            <div
              style={modalImageStyle}
              className='h-[354px] w-[432px] rounded-lg text-center'
            />
          </div>

          <section className='flex flex-col gap-2'>
            <p className='text-center text-[18px] font-bold text-primary-900'>
              ¿Deseas recibir información, novedades y noticias sobre nuestros
              fondos mutuos?
            </p>
            <p className='text-center text-[16px] font-medium text-neutral-600'>
              Al aceptar, tus datos serán tratados de acuerdo a nuestra Política
              de Privacidad disponible en nuestra web.
            </p>
          </section>
        </main>
      </Modal>

      <Modal
        isOpen={openFinalBeneficiary}
        title='Información necesaria'
        setIsOpen={setFinalBeneficiary}
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
      </Modal> */}
    </>
  );
};

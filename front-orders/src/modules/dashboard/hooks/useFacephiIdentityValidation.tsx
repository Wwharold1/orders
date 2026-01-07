/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, Transition } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { notifyError, Spinner } from '@/common/components';
import {
  CivilMessages,
  ContextRoutesEnum,
  ContextSidebarEnum,
  ContextSplashEnum,
  OriginTypeEnum,
} from '@/common/enums';
import { IdentityValidationEnum } from '@/common/enums/identity-validation.enum';
import { getSavedQueryParams } from '@/common/helper/queryParams';
import { sendGMT } from '@/common/helper/sendGMT';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
  useStatePersist,
} from '@/common/hooks';
import { FacephiCivilValidation } from '@/common/interfaces';
import { GMTEnum } from '@/modules/auth/enums/gmt.enum';
import FacePhiComponent from '@/modules/auth/facephi/FacephiComponent';
import {
  setAnuallyUpdate,
  setExistSpectrum,
  setStatus,
} from '@/modules/auth/slice/authSlice';
import { useInvestment } from '@/modules/dashboard/hooks/useInvestment';
import { useNaturalClient } from '@/modules/dashboard/hooks/useNaturalClient';
import { useRiskProfile } from '@/modules/dashboard/hooks/useRiskProfile';
import { TabInvestmentSubscriptionEnum } from '@/modules/dashboard/modules/subscription/enum/subscription.form.enum';
import {
  setChangeFinalBeneficiaryTab,
  setFinishStepFinalBeneficiary,
  setIsFinalBeneficiaryDatabase,
} from '@/modules/dashboard/slice/finalBeneficiarySlice';
import {
  setInvestmentTab,
  setNaturalClientTab,
} from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { setSidebar, setSplash } from '@/redux/common/layoutSlice';
import { FacephiService } from '@/services/FacephiService';
import { NaturalClientService } from '@/services/NaturalClientService';

export const useFacephiIdentityValidation = (
  isInside: boolean,
  goNext?: () => void,
  redirect?: ContextRoutesEnum,
  anuallyState?: any,
  finalBeneficiary: any = false,
  showSuccess = true,
  isSubscription = false,
  isRescue = false
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { forms } = useNaturalClient();
  const { mutations } = useRiskProfile(false);
  const { submitHandlers, getInvestmentFormData } = useInvestment();
  const [isOpenFacephi, setIsOpenFacephi] = useStateCallback<boolean>(false);
  const { currentFund } = useAppSelector((state) => state.subscription);
  const { currentFund: currentFundRescue } = useAppSelector(
    (state) => state.rescue
  );
  const [facialState, setFacialState] =
    useStateCallback<IdentityValidationEnum>(IdentityValidationEnum.INITIAL);
  const [token, setToken] = useStateCallback<any>(null);
  const [tokenImage, setTokenImage] = useStatePersist<any>(null, 'token-image');
  const currentUser = useAppSelector((state) => state.session.currentUser);

  const { setFormBeneficiaryFinal } = useAppSelector(
    (state) => state.finalBeneficiary
  );

  const { finishStepFinalBeneficiary } = useAppSelector(
    (state) => state.finalBeneficiary
  );

  const [facialErrorString, setFacialErrorString] = useStateCallback<string>(
    'Error en la validación facial'
  );

  const handleCloseSession = () => {
    setIsOpenFacephi(false);
  };

  const handleInvestmentForm = () => {
    submitHandlers.submitPayment({
      ...getInvestmentFormData(),
      imageBiometric: tokenImage,
    });
  };

  const finalBeneficiaryCustomerMutation = async () => {
    if (setFormBeneficiaryFinal) {
      const request = { ...setFormBeneficiaryFinal };
      delete request.contact_department_id;
      delete request.document_type_id;
      delete request.document_type_spouse_id;
      const dpr = request.date_property_regime
        ? request.date_property_regime
        : '2000-01-01';
      request.date_property_regime = dpr;
      if (localStorage.getItem('token-image')) {
        const image = localStorage.getItem('token-image') ?? '';
        request.image = image.replaceAll('"', '');
      }
      const response = await dispatch(
        NaturalClientService().postFinalBeneficiary(request)
      );
      if (response.payload?.statusCode > 200) {
        throw response.payload;
      }
      return response;
    }
  };

  const finalBeneficiaryUpdateCustomerMutation = useMutation(
    finalBeneficiaryCustomerMutation,
    {
      onSuccess: async (data) => {
        handleCloseSession();
        dispatch(setChangeFinalBeneficiaryTab(1));
        dispatch(setIsFinalBeneficiaryDatabase(true));
        forms.finalBeneficiaryForm.reset();
        if (data?.payload['status'] !== 'success') {
          dispatch(setStatus(-3));
          setFacialErrorString('Se produjo un error');
          notifyError({ title: 'Se produjo un error' });
          setFacialState(IdentityValidationEnum.FAILURE);
          handleCloseSession();
          return;
        }
        if (data?.payload['status'] == 'success') {
          handleCloseSession();
          dispatch(
            setSplash({
              type: ContextSplashEnum.PROFILE_FINAL_BENFICIARY,
              show: true,
            })
          );
          setTimeout(() => {
            dispatch(setSidebar(ContextSidebarEnum.PROFILE));
            router.push('/dashboard');
          }, 5000);
          return;
        } else {
          notifyError({ title: data?.payload.serviceResultLog });
          setFacialState(IdentityValidationEnum.FAILURE);
          setFacialErrorString(data?.payload.serviceResultLog);
          handleCloseSession();
        }
      },
      onError(error: any) {
        dispatch(setChangeFinalBeneficiaryTab(1));
        forms.finalBeneficiaryForm.reset();
        setIsOpenFacephi(false);
        setFacialState(IdentityValidationEnum.FAILURE);
        if (error?.statusCode === 412) {
          dispatch(
            setSplash({
              show: true,
              type: ContextSplashEnum.IDENTITY_VALIDATION_LIMIT,
            })
          );
          return;
        }
        setFacialErrorString(
          'Se produjo un error inesperado, vuelva a intentar por favor.'
        );
        notifyError({
          title: 'Se produjo un error inesperado, vuelva a intentar por favor.',
        });
      },
      retry: 0,
    }
  );

  const anuallyCustomerMutation = async (token: any) => {
    setToken(token);
    setTokenImage(token.bestImage.currentSrc.split(',')[1]);
    const response = await dispatch(
      NaturalClientService().anuallyUpdateCustomer({
        ...anuallyState.anuallyUpdateData,
        identity_validation: {
          resend: true,
          sendCreatePassword: false,
          operation: 'FACIAL',
          platform: 'WEB',
          documentNumber: localStorage.getItem('register_dni') ?? '',
          imageFrontDocument: '',
          imageBackDocument: '',
          countryCode: 'PER',
          tokenOcr: '',
          bestImage: token.bestImage.currentSrc.split(',')[1],
          bestImageTemplateRaw: token.bestImageTokenized,
          templateRaw: token.templateRaw,
          codFund:
            redirect === ContextRoutesEnum.ADD_ACCOUNT
              ? (currentFundRescue?.codFund as string)
              : (currentFund?.codFund as string),
          returnPII: true,
        },
      })
    );
    if (response.payload?.statusCode && response.payload?.statusCode !== 200) {
      throw response.payload;
    }
    return response;
  };

  const anuallyUpdateCustomerMutation = useMutation(anuallyCustomerMutation, {
    onSuccess: async (data) => {
      if (
        data.payload['aml_success'] === false ||
        data.payload['spouse_failed']
      ) {
        dispatch(setStatus(-3));
        setFacialErrorString('Se produjo un error');
        notifyError({ title: 'Se produjo un error' });
        setFacialState(IdentityValidationEnum.FAILURE);
        handleCloseSession();
        return;
      }
      if (data.payload?.data?.serviceResultLog === CivilMessages.POSITIVE) {
        dispatch(setNaturalClientTab(0));
        dispatch(setAnuallyUpdate(false));
        handleCloseSession();
        dispatch(
          setSplash({
            type: ContextSplashEnum.ANUALLY_PROFILE_UPDATED,
            show: true,
          })
        );
        setTimeout(() => {
          router.push(
            {
              pathname: ContextRoutesEnum.DASHBOARD,
              query: {
                redirect: true,
              },
            },
            ContextRoutesEnum.DASHBOARD
          );
        }, 5000);
        return;
      } else {
        notifyError({ title: data.payload.serviceResultLog });
        setFacialState(IdentityValidationEnum.FAILURE);
        setFacialErrorString(data.payload.serviceResultLog);
        handleCloseSession();
      }
    },
    onError(error: any) {
      setIsOpenFacephi(false);
      setFacialState(IdentityValidationEnum.FAILURE);
      if (error?.statusCode === 412) {
        dispatch(
          setSplash({
            show: true,
            type: ContextSplashEnum.IDENTITY_VALIDATION_LIMIT,
          })
        );
        return;
      }
      setFacialErrorString(
        'Se produjo un error inesperado, vuelva a intentar por favor.'
      );
      notifyError({
        title: 'Se produjo un error inesperado, vuelva a intentar por favor.',
      });
    },
    retry: 0,
  });

  const updateDataMutation = async (token: any) => {
    setToken(token);
    setTokenImage(token.bestImage.currentSrc.split(',')[1]);
    const additionalData = getValuesSuscriptionContract(); //ex: uuid and utm
    const response = await dispatch(
      FacephiService().FacephiCivilValidationCall({
        resend: true,
        sendCreatePassword: false,
        operation: 'FACIAL',
        platform: 'WEB',
        documentNumber: localStorage.getItem('register_dni') ?? '',
        imageFrontDocument: '',
        imageBackDocument: '',
        countryCode: 'PER',
        tokenOcr: '',
        bestImage: token.bestImage.currentSrc.split(',')[1],
        bestImageTemplateRaw: token.bestImageTokenized,
        templateRaw: token.templateRaw,
        codFund:
          redirect === ContextRoutesEnum.ADD_ACCOUNT
            ? (currentFundRescue?.codFund as string)
            : (currentFund?.codFund as string),
        returnPII: true,
        channel_register: OriginTypeEnum.WEB,
        ...additionalData,
      })
    );
    if (
      response.payload?.statusCode &&
      (response.payload?.statusCode < 200 ||
        response.payload?.statusCode >= 300)
    ) {
      throw response.payload;
    }
    if (additionalData.transac_id)
      sendGMT(GMTEnum.SUBSCRIPTION, additionalData.transac_id); // Send GMT when success registration
    return response;
  };

  //set values gmt and utm in civil-validation in case is suscription
  const getValuesSuscriptionContract = () => {
    if (isSubscription || !currentUser?.exist_spectrum) {
      const data: Partial<FacephiCivilValidation> = {
        channel_register: OriginTypeEnum.WEB,
      };
      const savedQueryParams = getSavedQueryParams();
      const uuid = uuidv4();
      if (uuid) data.transac_id = uuid;
      if (savedQueryParams) {
        const { utm_source, utm_medium, utm_campaign } = savedQueryParams;
        if (utm_source) data.utm_source = utm_source;
        if (utm_medium) data.utm_medium = utm_medium;
        if (utm_campaign) data.utm_campaign = utm_campaign;
      }

      return data;
    }
    return {};
  };

  const onSetSplash = (show: boolean, type: ContextSplashEnum) => {
    dispatch(setSplash({ show, type }));
  };

  const {
    mutate: facephiCivilValidationMutation,
    isLoading: isFacephiCivilValidationLoading,
  } = useMutation(updateDataMutation, {
    onSuccess: async ({ payload }) => {
      if (payload.data.serviceResultLog === CivilMessages.POSITIVE) {
        if (
          finalBeneficiary == true &&
          isSubscription == false &&
          isRescue == false
        ) {
          await finalBeneficiaryUpdateCustomerMutation.mutate();
          return;
        } else {
          handleCloseSession();
          if (isSubscription) {
            handleInvestmentForm();
            return;
          }
          if (goNext) goNext();
          if (showSuccess)
            onSetSplash(true, ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS);
          if (finishStepFinalBeneficiary) {
            finalBeneficiaryUpdateCustomerMutation.mutate;
            dispatch(setFinishStepFinalBeneficiary(false));
          } else {
            dispatch(setFinishStepFinalBeneficiary(false));
            validateRedirect(redirect);
          }
        }
      } else {
        setIsOpenFacephi(false);
        setFacialState(IdentityValidationEnum.FAILURE);
        notifyError({
          title: payload.data.serviceResultLog,
        });
      }
    },
    onError(error: any) {
      setIsOpenFacephi(false);
      setFacialState(IdentityValidationEnum.FAILURE);
      if (error?.statusCode === 412) {
        dispatch(setNaturalClientTab(0));
        dispatch(
          setSplash({
            show: true,
            type: ContextSplashEnum.IDENTITY_VALIDATION_LIMIT,
          })
        );
        return;
      }
      setFacialErrorString(
        'Se produjo un error inesperado, vuelva a intentar por favor.'
      );
      notifyError({
        title: 'Se produjo un error inesperado, vuelva a intentar por favor.',
      });
    },
    retry: 0,
  });

  const validateRedirect = async (redirect: ContextRoutesEnum | undefined) => {
    if (redirect) {
      if (redirect === ContextRoutesEnum.EDIT_PROFILE) {
        onSetSplash(true, ContextSplashEnum.PROFILE_FINAL_BENFICIARY);
        await mutations.setCustomerRiskMutation.mutateAsync(token);
      } else if (redirect === ContextRoutesEnum.DASHBOARD) {
        onSetSplash(true, ContextSplashEnum.PROFILE_CHANGED_RISK);
        await mutations.setCustomerRiskMutation.mutateAsync(token);
      } else {
        if (redirect === ContextRoutesEnum.ADD_RESCUE) {
          onSetSplash(
            true,
            ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS_RESCUE
          );
        } else {
          onSetSplash(true, ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS);
        }
      }
      const query: any = {
        redirect: true,
      };
      if (redirect === ContextRoutesEnum.ADD_ACCOUNT) {
        query.codFund = currentFundRescue?.codFund;
      }
      dispatch(setInvestmentTab(TabInvestmentSubscriptionEnum.DETAIL));
      dispatch(setExistSpectrum(true));
      if (redirect === ContextRoutesEnum.DASHBOARD) {
        router.push(
          {
            pathname: redirect,
            query,
          },
          redirect
        );
        onSetSplash(false, ContextSplashEnum.PROFILE_CHANGED_RISK);
        return;
      }
      setTimeout(() => {
        router.push(
          {
            pathname: redirect,
            query,
          },
          redirect
        );
      }, 5000);
    }
  };

  const ModalFacialComponent = () => {
    return (
      <Transition show={isOpenFacephi} as={React.Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => handleCloseSession()}
        >
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-[#001F45] opacity-80' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={React.Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  //id='container'
                  className={clsx(
                    'flex w-[300px] transform flex-col items-center justify-center space-y-5 overflow-hidden rounded-sm bg-white align-middle  shadow-xl transition-all md:w-[800px]'
                  )}
                >
                  {isFacephiCivilValidationLoading ||
                  anuallyUpdateCustomerMutation.isLoading ||
                  finalBeneficiaryUpdateCustomerMutation.isLoading ? (
                    <div className='flex flex-col items-center justify-center py-20'>
                      {isFacephiCivilValidationLoading ||
                        (anuallyUpdateCustomerMutation.isLoading &&
                          finalBeneficiaryUpdateCustomerMutation.isLoading && (
                            <h5 className='py-2 font-semibold text-neutral-800'>
                              Validando información...
                            </h5>
                          ))}
                      <Spinner />
                    </div>
                  ) : (
                    <FacePhiComponent
                      onValidate={
                        anuallyState
                          ? anuallyUpdateCustomerMutation.mutate
                          : facephiCivilValidationMutation
                      }
                      setIsOpen={setIsOpenFacephi}
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };

  return {
    state: {
      setFacialState,
      facialState,
      setIsOpenFacephi,
      isOpenFacephi,
      setFacialErrorString,
      facialErrorString,
    },
    loaders: {
      isFacephiCivilValidationLoading,
    },
    mutations: {
      facephiCivilValidationMutation,
    },
    ModalFacialComponent,
  };
};

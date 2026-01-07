/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

import { notifyError } from '@/common/components';
import {
  CivilStatusTabs,
  ContextSplashEnum,
  ContextTabs,
  FormStepsEnum,
  IdentifyCustomerErrorsDictionary,
  PersonalInformationErrorsDictionary,
  SpectrumDocumentType,
} from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
  useStatePersist,
} from '@/common/hooks';
import {
  setFormStep,
  setFormStepPayload,
  setNumberDocument,
} from '@/modules/auth/slice/authSlice';
import {
  activityClientValidationSchema,
  homeClientValidationSchema,
  identifyCustomerValidationSchema,
  personalInformationValidationSchema,
  preFinalBeneficiaryClientValidationSchema,
  preSpouseClientValidationSchema,
  TActivityClientForm,
  TFinalBeneficiaryForm,
  THomeClientForm,
  TIdentifyCustomerForm,
  TPersonalInformationForm,
  TPreSpouseClientForm,
  TSpouseClientForm,
  TTypeParticipateForm,
  typeParticipateValidationSchema,
} from '@/modules/dashboard/helpers/naturalClientValidationSchemas';
import { setNaturalClientTab } from '@/modules/dashboard/slice/subscriptionLayoutSlice';
import { setContextTabs } from '@/modules/dashboard/slice/subscriptionSlice';
import { setSplash } from '@/redux/common/layoutSlice';
import { NaturalClientService } from '@/services/NaturalClientService';

import {
  ICivilStatusResponse,
  IDocumentType,
  IDocumentTypeResponse,
} from '../../../common/interfaces/natural.client.interface';

export const useNaturalClient = () => {
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const [openModalInterrupt, setOpenModalInterrupt] =
    useStateCallback<boolean>(false);
  const [isSpoused, setIsSpoused] = useStatePersist<boolean>(
    false,
    'is-spoused'
  );
  const [anuallyUpdateData, setAnuallyUpdateData] = useStateCallback<any>([]);
  const [openModalPep, setOpenModalPep] = useStateCallback<boolean>(false);
  const [openModalDocument, setOpenModalDocument] =
    useStateCallback<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { naturalClientTab } = useAppSelector(
    (state) => state.subscription_layout
  );

  const typeParticipateForm = useForm<TTypeParticipateForm>({
    resolver: zodResolver(typeParticipateValidationSchema),
    defaultValues: {
      certified_information_provided: true,
    },
  });

  const personalInformationForm = useForm<TPersonalInformationForm>({
    resolver: zodResolver(personalInformationValidationSchema),
    mode: 'onChange',
  });

  const identifyCustomerForm = useForm<TIdentifyCustomerForm>({
    resolver: zodResolver(identifyCustomerValidationSchema),
    mode: 'onTouched',
  });

  const activityClientForm = useForm<TActivityClientForm>({
    resolver: zodResolver(activityClientValidationSchema),
    mode: 'onChange',
  });
  const homeClientForm = useForm<THomeClientForm>({
    resolver: zodResolver(homeClientValidationSchema),
    mode: 'onChange',
  });
  const spouseClientForm = useForm<TPreSpouseClientForm>({
    resolver: zodResolver(preSpouseClientValidationSchema),
    mode: 'onChange',
  });
  const finalBeneficiaryForm = useForm<TFinalBeneficiaryForm>({
    resolver: zodResolver(preFinalBeneficiaryClientValidationSchema),
    mode: 'onChange',
  });

  const typeParticipateMutation = useMutation(
    (userData: TTypeParticipateForm) =>
      dispatch(NaturalClientService().postTypeParticipate(userData))
  );

  const identifyCustomerMutation = useMutation(
    (userData: TIdentifyCustomerForm) =>
      dispatch(NaturalClientService().postIdentifyCustomer(userData))
  );

  const personalInformationMutation = useMutation(
    (userData: TPersonalInformationForm) =>
      dispatch(NaturalClientService().postProfileCustomer(userData))
  );
  const spouseCustomerMutation = useMutation((userData: TSpouseClientForm) =>
    dispatch(NaturalClientService().postSpouseCustomer(userData))
  );

  const activityClientMutation = useMutation((userData: TActivityClientForm) =>
    dispatch(NaturalClientService().postActivityCustomer(userData))
  );

  const homeClientMutation = useMutation((userData: THomeClientForm) =>
    dispatch(NaturalClientService().postHomeCustomer(userData))
  );

  const finalBeneficiaryMutation = useMutation(
    (userData: TFinalBeneficiaryForm) =>
      dispatch(NaturalClientService().postFinalBeneficiary(userData))
  );

  const chargePublicMutation = useMutation(
    () => dispatch(NaturalClientService().postChargePublic()),
    {
      onSuccess: () => {
        dispatch(
          setSplash({
            type: ContextSplashEnum.NATURAL_PERSON_PEP_COMPLETED,
            show: true,
          })
        );
      },
    }
  );

  const submitTypeParticipate: SubmitHandler<TTypeParticipateForm> = (
    values
  ) => {
    typeParticipateMutation.mutate(values, {
      onSuccess: () => {
        if (values.type_participate_item_id === 1) {
          router.push('/subscription/natural-client');
        } else {
          dispatch(
            setSplash({
              show: true,
              type: ContextSplashEnum.TYPE_PARTICIPATE_COMPLETED,
            })
          );
          dispatch(setFormStep(FormStepsEnum.TIPO_PARTICIPE));
        }
      },
    });
  };

  const submitIdentifyCustomer = (
    values: TIdentifyCustomerForm,
    typeDocumentData: IDocumentTypeResponse
  ) => {
    const data = { ...values };
    data.document_type_id = typeDocumentData.data.find(
      (e: IDocumentType) =>
        e.code === identifyCustomerForm.getValues('document_type_id')
    )?.id;
    data.business_executive_id = values.business_executive_id || '';

    identifyCustomerMutation.mutate(data, {
      onSuccess: ({ payload }) => {
        if (
          payload.message ==
          IdentifyCustomerErrorsDictionary.DOCUMENT_NUMBER_EXIST
        ) {
          notifyError({
            title: 'Ya existe una cuenta con el documento ingresado',
            subtitle:
              'Este documento está registrado en otra cuenta. Si crees que se trata de un error, comuníquese con',
            bolded: 'backoffice@prudentialsaf.com.pe',
          });
          dispatch(setNumberDocument(data.number_document));
          return;
        }
        dispatch(
          setFormStepPayload({
            form_step: FormStepsEnum.PROCESO_INVERSION,
          })
        );
        dispatch(setFormStep(FormStepsEnum.VALIDACION_CLIENTE));

        if (
          !Array.from([SpectrumDocumentType.DNI]).includes(
            values.document_type_id
          )
        ) {
          dispatch(
            setSplash({
              type: ContextSplashEnum.NATURAL_PERSON_PEP_COMPLETED,
              show: true,
            })
          );
          return;
        }
        dispatch(setNaturalClientTab(1));
      },
    });
  };

  const submitPersonalInformation = (
    values: TPersonalInformationForm,
    civilStatusData: ICivilStatusResponse
  ) => {
    const data = { ...values };
    if (data.birthdate.includes('/')) {
      const firstHalf = data.birthdate.split('/')[2];
      data.birthdate =
        firstHalf.length > 3
          ? data.birthdate.split('/')[2] +
            '-' +
            data.birthdate.split('/')[1] +
            '-' +
            data.birthdate.split('/')[0]
          : data.birthdate;
    }
    personalInformationMutation.mutate(data, {
      onSuccess: ({ payload }) => {
        if (
          payload.message === PersonalInformationErrorsDictionary.NOT_LEGAL_USER
        ) {
          notifyError({
            title: 'Edad insuficiente',
            subtitle:
              'Lo sentimos, no puedes continuar porque eres menor de edad',
          });
          return;
        }

        if (
          civilStatusData.data.find((e) => e.id === values.civil_status_id)
            ?.code === '02'
        ) {
          const newTabs = ContextTabs.slice(0, 4).concat(CivilStatusTabs);
          dispatch(setContextTabs(newTabs));
          setIsSpoused(true);
        } else {
          dispatch(setContextTabs(ContextTabs));
          setIsSpoused(false);
        }
        dispatch(setFormStep(FormStepsEnum.PERFIL_CLIENTE));
        dispatch(setNaturalClientTab(2));
      },
    });
  };

  const submitActivityCustomer = (values: TActivityClientForm) => {
    activityClientMutation.mutate(values, {
      onSuccess: () => {
        dispatch(setFormStep(FormStepsEnum.ACTIVIDAD_CLIENTE));
        dispatch(setNaturalClientTab(3));
      },
    });
  };

  const submitHomeCustomer = (values: THomeClientForm) => {
    homeClientMutation.mutate(values, {
      onSuccess: () => {
        dispatch(setFormStep(FormStepsEnum.RESIDENCIA));
        dispatch(setNaturalClientTab((naturalClientTab + 1) as any));
      },
    });
  };

  const submitSpouseCustomer = (values: TPreSpouseClientForm) => {
    delete (values as any).fullname;
    spouseCustomerMutation.mutate(values, {
      onSuccess: () => {
        dispatch(setFormStep(FormStepsEnum.CONYUGE));
        dispatch(setNaturalClientTab((naturalClientTab + 1) as any));
      },
    });
  };

  const submitFinalBeneficiary = (values: TFinalBeneficiaryForm) => {
    finalBeneficiaryMutation.mutate(values, {
      onSuccess: () => {
        dispatch(setFormStep(FormStepsEnum.FINAL_BENEFICIARY));
        dispatch(setNaturalClientTab((naturalClientTab + 1) as any));
      },
    });
  };

  return {
    forms: {
      typeParticipateForm,
      identifyCustomerForm,
      personalInformationForm,
      activityClientForm,
      homeClientForm,
      spouseClientForm,
      finalBeneficiaryForm,
    },
    submitHandlers: {
      submitTypeParticipate,
      submitIdentifyCustomer,
      submitPersonalInformation,
      submitActivityCustomer,
      submitHomeCustomer,
      submitSpouseCustomer,
      submitFinalBeneficiary,
    },
    mutations: {
      typeParticipateMutation,
      identifyCustomerMutation,
      personalInformationMutation,
      activityClientMutation,
      homeClientMutation,
      spouseCustomerMutation,
      chargePublicMutation,
      finalBeneficiaryMutation,
    },
    modal: {
      openModalCancel,
      setOpenModalCancel,
      openModalPep,
      setOpenModalPep,
      openModalInterrupt,
      setOpenModalInterrupt,
      openModalDocument,
      setOpenModalDocument,
    },
    state: {
      isSpoused,
      setAnuallyUpdateData,
      anuallyUpdateData,
    },
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { persistStore } from 'redux-persist';

import { notifyError, notifyInfo } from '@/common/components/Notify';
import {
  ContextRoutesEnum,
  ContextSidebarEnum,
  ContextSplashEnum,
  SpectrumDocumentType,
} from '@/common/enums';
import {
  CreatePasswordErrorsDictionary,
  LoginErrorsDictionary,
  PasswordRegistrationErrorsDictionary,
  SearchCollaboratorErrorsDictionary,
  SendCodeRecoveryErrorsDictionary,
  SendEmailCreateErrorsDictionary,
  UpdateEmailCustomerErrorsDictionary,
} from '@/common/enums/custom-errors.dictionary';
import { countryCodesMapping } from '@/common/helper/countryCodes';
import { removeQueryParams } from '@/common/helper/queryParams';
import { sendGMT } from '@/common/helper/sendGMT';
import { useAppDispatch } from '@/common/hooks/redux-hooks';
import { useStateCallback } from '@/common/hooks/useStateCallback';
import { useStatePersist } from '@/common/hooks/useStatePersist';
import {
  IRegisterEmail,
  IUpdatePasswordRegistration,
} from '@/common/interfaces';
import { GMTEnum } from '@/modules/auth/enums/gmt.enum';
import {
  createPasswordSchema,
  documentValidationSchema,
  loginValidationSchema,
  passwordRegistrationValidationSchema,
  recoverGenerateSchema,
  registerEmailValidationSchema,
  resetPasswordSchema,
  sendProspectValidationSchema,
  TCreatePasswordForm,
  TDocumentValidationForm,
  TLoginForm,
  TPasswordRegistrationForm,
  TRecoverGenerateForm,
  TRecoverValidateForm,
  TRegisterEmailForm,
  TResetPasswordForm,
  TSendProspectForm,
  TUpdateEmailForm,
  TVerifyForm,
  updateEmailValidationSchema,
  validateRecoverSchema,
  verifyAccountValidationSchema,
} from '@/modules/auth/helpers/authValidationSchemas';
import {
  AutocaptureFacialStateEnum,
  CollaboratorRegisterStepEnum,
  FacialStateEnum,
  RegisterStepEnum,
} from '@/modules/auth/helpers/registerSteps';
import { transformTimestamp } from '@/modules/auth/hooks/useErrorTimer';
import { useGoogleRecaptcha } from '@/modules/auth/hooks/useGoogleRecaptcha';
import { deleteAuth } from '@/modules/auth/slice/authSlice';
import { persistor, store } from '@/redux';
import { setSidebar, setSplash } from '@/redux/common/layoutSlice';
import { SpectrumService } from '@/services';

import {
  RegisterEmailErrorsDictionary,
  ValidateRecoverErrorsDictionary,
} from '../../../common/enums/custom-errors.dictionary';
import { AuthService } from '../../../services/AuthService';

export const useAuthentication = () => {
  const { handleReCaptchaVerify } = useGoogleRecaptcha();

  const [resendEmailAttempt, setResendEmailAttempt] =
    useStateCallback<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isOpenResend, setIsOpenResend] = useStateCallback<boolean>(false);
  const [isOpenNoFunds, setIsOpenNoFunds] = useStateCallback<boolean>(false);
  const [openInvalidModal, setOpenInvalidModal] =
    useStateCallback<boolean>(false);
  const [openFormDocument, setOpenFormDocument] =
    useStateCallback<boolean>(false);
  const [openExistentModal, setOpenExistentModal] =
    useStateCallback<boolean>(false);
  const [openNoExistModal, setOpenNoExistModal] =
    useStateCallback<boolean>(false);
  const [resetStep, setResetStep] = useStateCallback<number>(0);
  const [registerStep, setRegisterStep] = useStateCallback<
    RegisterStepEnum | CollaboratorRegisterStepEnum
  >(RegisterStepEnum.DOCUMENT_VALIDATION);
  const [verifyAttempt, setVerifyAttempt] = useStateCallback<number>(3);
  const [recoverTimer, setRecoverTimer] = useStateCallback<any>(null);
  const [facialState, setFacialState] = useStateCallback<number>(
    FacialStateEnum.INITIAL_VALIDATION
  );
  const [autocaptureState, setAutocaptureState] = useStateCallback<number>(
    AutocaptureFacialStateEnum.BACK_DOCUMENT
  );
  const [isCollaborator, setIsCollaborator] = useStatePersist<string>(
    '0',
    'is-collaborator'
  );
  const [currentEmail, setCurrentEmail] = useStatePersist<string>(
    localStorage.getItem('current-email') || '',
    'current-email'
  );
  const [currentDNI, setCurrentDNI] = useStatePersist<string>(
    '',
    'current-dni'
  );
  const [currentTypeDocument, setCurrentTypeDocument] = useStatePersist<string>(
    '',
    'current-type-document'
  );
  const router = useRouter();
  const dispatch = useAppDispatch();

  const generateForm = useForm<TRecoverGenerateForm>({
    resolver: zodResolver(recoverGenerateSchema),
  });

  const validateForm = useForm<TRecoverValidateForm>({
    resolver: zodResolver(validateRecoverSchema),
  });

  const resetForm = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const sendProspectForm = useForm<TSendProspectForm>({
    resolver: zodResolver(sendProspectValidationSchema),
    mode: 'onChange',
  });

  const loginForm = useForm<TLoginForm>({
    resolver: zodResolver(loginValidationSchema),
  });

  const documentValidationForm = useForm<TDocumentValidationForm>({
    resolver: zodResolver(documentValidationSchema),
  });


  const verifyForm = useForm<TVerifyForm>({
    resolver: zodResolver(verifyAccountValidationSchema),
  });

  const createPasswordForm = useForm<TCreatePasswordForm>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      accept_data_treatment: false,
      accept_terms_conditions: true,
    },
  });

  const registerEmailForm = useForm<TRegisterEmailForm>({
    resolver: zodResolver(registerEmailValidationSchema),
    mode: 'onChange',
  });

  const updateEmailForm = useForm<TUpdateEmailForm>({
    resolver: zodResolver(updateEmailValidationSchema),
  });

  const passwordRegistrationForm = useForm<TPasswordRegistrationForm>({
    resolver: zodResolver(passwordRegistrationValidationSchema),
    defaultValues: {
      phone_country: '+51',
      name: '',
      lastname: '',
      accept_data_treatment: false,
      accept_terms_conditions: true,
      password: '',
      password_confirmation: '',
    },
    mode: 'onChange',
  });

  const { mutate: createPasswordMutation, isLoading: loadCreatePassword } =
    useMutation(
      (userData: TCreatePasswordForm) =>
        dispatch(AuthService().createPasswordCustomer(userData)),
      {
        onSuccess(data, userData) {
          if (data.payload.message) {
            if (
              data.payload.message === CreatePasswordErrorsDictionary.HASH_ERROR
            ) {
              setOpenInvalidModal(true);
            }
            if (
              data.payload.message ===
              CreatePasswordErrorsDictionary.ACCOUNT_EXIST
            ) {
              setOpenExistentModal(true);
            }
            if (
              data.payload.message ===
              CreatePasswordErrorsDictionary.EMAIL_NOT_EXIST
            ) {
              dispatch(
                setSplash({
                  show: true,
                  type: ContextSplashEnum.AUTH_REGISTER_COMPLETED,
                })
              );
              sendGMT(GMTEnum.REGISTRATION_COMPLETED, userData.transac_id); // Send GMT when success registration
              setTimeout(() => {
                router.push('/');
              }, 5000);
            }
            setTimeout(() => {
              router.push('/');
            }, 3000);
            return;
          } else {
            dispatch(
              setSplash({
                show: true,
                type: ContextSplashEnum.AUTH_REGISTER_COMPLETED,
              })
            );
            sendGMT(GMTEnum.REGISTRATION_COMPLETED, userData.transac_id); // Send GMT when success registration
            setTimeout(() => {
              router.push('/');
            }, 5000);
          }
        },
      }
    );

  const {
    mutate: documentValidationMutation,
    isLoading: loadDocumentValidation,
  } = useMutation(
    (userData: TDocumentValidationForm) =>
      dispatch(SpectrumService().searchCollaborator(userData)),
    {
      onSuccess(data) {
        if (data.payload.message) {
          setVerifyAttempt(verifyAttempt - 1);
          if (
            data.payload.message ===
            SearchCollaboratorErrorsDictionary.LIMIT_SHIPMENTS
          ) {
            notifyError({
              title:
                'Has alcanzado el límite de intentos posibles para enviar código de validación',
            });
            return;
          }
          if (
            data.payload.message ===
            SearchCollaboratorErrorsDictionary.EMAIL_ALREADY_VERIFIED
          ) {
            notifyError({
              title: 'Ya existe una cuenta con este número de documento.',
            });
            return;
          }
          //user not found
          setIsCollaborator('0');
          setCurrentTypeDocument(
            documentValidationForm.getValues('tipoIdentidad')
          );
          setCurrentDNI(documentValidationForm.getValues('numIdentidad'));

          return;
        }

        setIsCollaborator('1');
        if (data.payload.email && data.payload.email !== 'string') {
          setCurrentEmail(data.payload.email);
          verifyForm.setValue('email', data.payload.email);
          setRegisterStep(
            CollaboratorRegisterStepEnum.OPEN_IDENTITY_VALIDATION
          );
        } else {
          updateEmailForm.setValue('id', data.payload.id);
          updateEmailForm.setValue(
            'code_unique_spectrum',
            data.payload.code_unique_spectrum
          );
          updateEmailForm.setValue(
            'type_document',
            documentValidationForm.getValues('tipoIdentidad')
          );
          updateEmailForm.setValue(
            'number_document',
            documentValidationForm.getValues('numIdentidad')
          );
          setRegisterStep(CollaboratorRegisterStepEnum.EMAIL_REGISTRATION);
        }
        setCurrentTypeDocument(
          documentValidationForm.getValues('tipoIdentidad')
        );
        setCurrentDNI(documentValidationForm.getValues('numIdentidad'));

        return;
      },
    }
  );

  const { mutate: registerEmailMutation, isLoading: loadDocument } =
    useMutation(
      (data: IRegisterEmail) => dispatch(AuthService().register(data)),
      {
        onSuccess({ payload }) {
          if (
            payload.message === RegisterEmailErrorsDictionary.ALREADY_REGISTER
          ) {
            notifyError({
              title: 'Ya existe una cuenta con este correo.',
              subtitle: `Por favor ingrese uno nuevamente.`,
            });
            return;
          }

          setRegisterStep(RegisterStepEnum.EMAIL_VERIFICATION);
          setCurrentEmail(payload.data.email);
          verifyForm.setValue('email', payload.data.email);
        },
      }
    );

  const {
    mutate: sendEmailValidationMutation,
    isLoading: loadEmailValidation,
  } = useMutation(
    (data: IRegisterEmail) => dispatch(AuthService().register(data)),
    {
      onSuccess() {
        if (resendEmailAttempt === 3) {
          notifyError({
            title:
              'Has alcanzado el límite de intentos posibles para enviar código de validación',
          });
          return;
        }
        notifyInfo({
          subtitle: `Código enviado`,
        });
        localStorage.removeItem('public-token');
        setResendEmailAttempt(resendEmailAttempt + 1);
        return;
      },
    }
  );

  const { mutate: verifyEmailMutation, isLoading: loadVerifyEmail } =
    useMutation(
      (userData: TVerifyForm) =>
        dispatch(AuthService().verifyEmailCode(userData)),
      {
        onSuccess({ payload }) {
          if (payload.message) {
            notifyError({
              title: 'Código no coincide',
              subtitle: `Por favor, inténtalo de nuevo.`,
            });
            return;
          }

          dispatch(
            setSplash({
              show: true,
              type: ContextSplashEnum.AUTH_EMAIL_VERIFIED,
            })
          );

          verifyForm.resetField('code');
          if (isCollaborator === '0') {
            passwordRegistrationForm.setValue('id', payload.data.id);
            passwordRegistrationForm.setValue(
              'securityHash',
              payload.data.securityHash
            );
            passwordRegistrationForm.setValue('email', payload.data.email);
            setRegisterStep(RegisterStepEnum.NAME_VALIDATION);
          } else {
          
          }
        },
      }
    );

  const { mutate: sendProspectMutation, isLoading: loadSendProspect } =
    useMutation(
      (userData: TSendProspectForm) =>
        dispatch(AuthService().sendProspectForm(userData)),
      {
        onSuccess({ payload }) {
          if (payload.data) {
            setOpenFormDocument(false);
            dispatch(
              setSplash({
                type: ContextSplashEnum.AUTH_PROSPECT_COMPLETED,
                show: true,
              })
            );
          }
        },
      }
    );

  const { mutate: loginMutation, isLoading: loadLogin } = useMutation(
    (userData: TLoginForm) => dispatch(AuthService().login(userData)),
    {
      onSuccess(data) {
        if (data.payload.message == 'Error') {
          const message = data.payload.message.split(' ');
          loginForm.setError('email', {
            message: '',
          });
          loginForm.setError('password', {
            message: '',
          });
          loginForm.setError('root', {
            message: '',
          });
          loginForm.resetField('password');

          if (
            message[0] === LoginErrorsDictionary.USER_BLOQUED ||
            message[0] === LoginErrorsDictionary.USER_DISABLED
          ) {
            notifyError({
              title: 'Usuario no autorizado',
              subtitle: `Para continuar, comuníquese con`,
              bolded: 'backoffice@prudentialsaf.com.pe',
            });
            return;
          }
          if (message[1].length === 1) {
            notifyError({
              title: 'Tus credenciales son incorrectas',
              subtitle: `Te queda${message[1] === '1' ? '' : 'n'} ${message[1]
                } intento${message[1] === '1' ? '' : 's'}.`,
            });

            return;
          }
          if (message[1].length > 1) {
            const timestamp = Math.round(
              (new Date(Number(message[1])).getTime() - new Date().getTime()) /
              1000
            );
            notifyError({
              title: 'Has alcanzado el límite de intentos',
              subtitle: `Podrás volver a intentarlo en ${transformTimestamp(
                timestamp
              )}`,
            });

            return;
          }

          notifyError({
            title: 'Correo o contraseña incorrectos',
            subtitle: `Tus credenciales son incorrectas. Inténtalo de nuevo.`,
          });
          localStorage.removeItem('public-token');

          return;
        }
        persistStore(store);
        dispatch(
          setSplash({
            show: true,
            type: ContextSplashEnum.AUTH,
          })
        );
        dispatch(setSidebar(ContextSidebarEnum.HOME));
        setTimeout(() => {
          router.push('/dashboard');
        }, 4500);
      },
    }
  );

  const { mutate: generateMutation, isLoading: loadGeneratePassword } =
    useMutation(
      (userData: TRecoverGenerateForm) =>
        dispatch(AuthService().generateRecover(userData)),
      {
        onSuccess({ payload }) {
          if (payload.message) {
            if (
              payload.message.includes(
                SendCodeRecoveryErrorsDictionary.LIMIT_SHIPMENTS
              )
            ) {
              notifyError({
                title:
                  'Has alcanzado el límite de intentos posibles para validar tu correo',
                subtitle: `Por favor, contáctate a`,
                bolded: 'backoffice@prudentialsaf.com.pe',
              });
              return;
            }
          }

          setRecoverTimer(
            Math.round(
              (new Date(payload.data).getTime() - new Date().getTime()) / 1000
            )
          );
          if (generateForm.getValues('resend')) {
            notifyInfo({
              subtitle: `Código enviado`,
            });
          }
          setResetStep(1);
          validateForm.setValue('email', generateForm.watch('email'));
        },
      }
    );

  const {
    mutate: updatePasswordRegistrationMutation,
    isLoading: loadPasswordRegistration,
  } = useMutation(
    (userData: IUpdatePasswordRegistration) =>
      dispatch(AuthService().updatePasswordRegistration(userData)),
    {
      onSuccess({ payload }, userData) {
        if (
          payload.message === PasswordRegistrationErrorsDictionary.PHONE_EXIST
        ) {
          notifyError({
            title: 'Este número ya está siendo usado',
            subtitle: `Por favor ingrese uno nuevo`,
          });
          return;
        }
        dispatch(
          setSplash({
            show: true,
            type: ContextSplashEnum.AUTH_REGISTER_COMPLETED,
          })
        );
        sendGMT(GMTEnum.REGISTRATION_COMPLETED, userData.transac_id); // Send GMT when success registration
        setTimeout(() => {
          router.push('/');
        }, 5000);
      },
    }
  );

  const { mutate: validateMutation, isLoading: loadValidatePassword } =
    useMutation(
      (userData: TRecoverValidateForm) =>
        dispatch(AuthService().validateRecoverCode(userData)),
      {
        onSuccess({ payload }) {
          if (
            ValidateRecoverErrorsDictionary.CODE_EXPIRED === payload.message
          ) {
            notifyError({
              title: 'Tiempo vencido',
              subtitle: `Por favor, solicita un nuevo código`,
            });
            return;
          }
          if (payload.message) {
            notifyError({
              title: 'Código no coincide',
              subtitle: `Por favor, inténtalo de nuevo.`,
            });
            return;
          }

          setResetStep(2);
          resetForm.setValue('code', validateForm.watch('code'));
        },
      }
    );

  const {
    mutate: sendEmailCreationPasswordMutation,
    isLoading: loadEmailCreationPassword,
  } = useMutation(
    () => dispatch(AuthService().sendEmailCreationPassword(currentEmail)),
    {
      onSuccess(data) {
        if (data.payload.message) {
          if (
            data.payload.message ===
            SendEmailCreateErrorsDictionary.LIMIT_SHIPMENTS
          ) {
            setFacialState(4);
          }
          return;
        }
        setIsOpenResend(true);
        return;
      },
    }
  );

  const { mutate: editEmailMutation, isLoading: loadEditEmail } = useMutation(
    (userData: TUpdateEmailForm) =>
      dispatch(AuthService().updateEmailCustomer(userData)),
    {
      onSuccess(data) {
        if (data.payload.message) {
          if (
            data.payload.message ===
            UpdateEmailCustomerErrorsDictionary.EMAIL_EXIST
          ) {
            updateEmailForm.setError('email', {
              message: 'El correo se encuentra registrado.',
            });
          }
          return;
        } else {
          setRegisterStep(
            CollaboratorRegisterStepEnum.OPEN_IDENTITY_VALIDATION
          );
          verifyForm.setValue('email', updateEmailForm.getValues('email'));
          setCurrentEmail(updateEmailForm.getValues('email'));
        }
      },
    }
  );

  const { mutate: resetPasswordMutation, isLoading: loadResetPassword } =
    useMutation(
      (userData: TResetPasswordForm) =>
        dispatch(AuthService().resetPassword(userData)),
      {
        onSuccess(data) {
          if (data.payload.message) {
            return;
          } else {
            dispatch(
              setSplash({
                show: true,
                type: ContextSplashEnum.AUTH_RECOVERY_COMPLETED,
              })
            );
            setTimeout(() => {
              router.push('/');
            }, 5000);
          }
        },
      }
    );

  const logoutMutation = useMutation(
    () => dispatch(AuthService().logoutCustomer()),
    {
      onSuccess() {
        localStorage.removeItem('openModalBeneficiary');
        dispatch(deleteAuth());
        localStorage.clear();
        persistor.purge();
        // document.cookie = '';
        router.push('/');
        removeQueryParams(); // Remove query params when logout
      },
      onSettled() {
      },
    }
  );

  const submitGenerate: SubmitHandler<TRecoverGenerateForm> = async (
    values
  ) => {
    generateForm.setValue('resend', false);
    await handleReCaptchaVerify();
    generateMutation(values);
  };

  const submitResendGenerate = async () => {
    generateForm.setValue('resend', true);
    await handleReCaptchaVerify();
    generateMutation(generateForm.getValues());
  };

  const submitValidate: SubmitHandler<TRecoverValidateForm> = async (
    values
  ) => {
    await handleReCaptchaVerify();
    validateMutation(values);
  };

  const submitReset: SubmitHandler<TResetPasswordForm> = async (values) => {
    await handleReCaptchaVerify();
    resetPasswordMutation(values);
  };

  const submitLogin: SubmitHandler<TLoginForm> = async (values) => {
    await handleReCaptchaVerify();
    loginMutation(values);
  };

  const submitDocumentValidation: SubmitHandler<
    TDocumentValidationForm
  > = async (values) => {
    if (
      ![SpectrumDocumentType.CE, SpectrumDocumentType.DNI].includes(
        values.tipoIdentidad as SpectrumDocumentType
      ) 
    ) {
      sendProspectForm.setValue('number_document', values.numIdentidad);
      sendProspectForm.setValue('document_type', values.tipoIdentidad);
      setOpenFormDocument(true);
      return;
    }
    await handleReCaptchaVerify();
    documentValidationMutation(values);
  };

  const submitUpdateEmail: SubmitHandler<TUpdateEmailForm> = (values) => {
    editEmailMutation(values);
  };

  const submitCreatePassword: SubmitHandler<TCreatePasswordForm> = (values) => {
    const { accept_data_treatment, accept_terms_conditions } =
      createPasswordForm.getValues();
    createPasswordMutation({
      ...values,
      accept_data_treatment,
      accept_terms_conditions,
    });
  };

  const submitVerify: SubmitHandler<TVerifyForm> = (values) => {
    verifyEmailMutation(values);
  };
  const submitSendProspect: SubmitHandler<TSendProspectForm> = (values) => {
    sendProspectMutation(values);
  };

  const submitDocument: SubmitHandler<TRegisterEmailForm> = async (values) => {
    registerEmailMutation({
      email: values.email,
      numIdentidad: documentValidationForm.getValues('numIdentidad'),
      tipoIdentidad: documentValidationForm.getValues('tipoIdentidad'),
    });
  };

  const submitPasswordRegistration: SubmitHandler<TPasswordRegistrationForm> = (
    values
  ) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { password_confirmation, ...commonProperties } = values;
    updatePasswordRegistrationMutation({
      ...commonProperties,
      phone_number:
        commonProperties.phone_country + commonProperties.phone_number,
    });
  };

  const submitSendEmail = async () => {
    await handleReCaptchaVerify();
    isCollaborator === '0'
      ? sendEmailValidationMutation({
        email: registerEmailForm.getValues('email'),
        numIdentidad: documentValidationForm.getValues('numIdentidad'),
        tipoIdentidad: documentValidationForm.getValues('tipoIdentidad'),
      })
      : documentValidationMutation(documentValidationForm.getValues());
  };

  const submitSendEmailCreation = () => {
    sendEmailCreationPasswordMutation();
  };

  return {
    forms: {
      generateForm,
      validateForm,
      resetForm,
      loginForm,
      verifyForm,
      registerEmailForm,
      updateEmailForm,
      passwordRegistrationForm,
      documentValidationForm,
      createPasswordForm,
      sendProspectForm,
    },
    resetStep,
    registerStep,
    setRegisterStep,
    facialState,
    setFacialState,
    currentEmail,
    setIsCollaborator,
    currentDNI,
    isCollaborator,
    setAutocaptureState,
    autocaptureState,
    currentTypeDocument,
    attempts: {
      verifyAttempt,
      setVerifyAttempt,
    },
    timers: {
      emailRecoverTimer: {
        setTimer: setRecoverTimer,
        timer: recoverTimer,
      },
    },
    submitHandlers: {
      submitGenerate,
      submitValidate,
      submitReset,
      submitLogin,
      submitVerify,
      submitDocument,
      submitSendEmail,
      submitResendGenerate,
      submitPasswordRegistration,
      submitDocumentValidation,
      submitUpdateEmail,
      submitSendEmailCreation,
      submitCreatePassword,
      submitSendProspect,
    },
    loaders: {
      loadLogin,
      loadDocument,
      loadEmailValidation,
      loadGeneratePassword,
      loadValidatePassword,
      loadResetPassword,
      loadVerifyEmail,
      loadPasswordRegistration,
      loadDocumentValidation,
      loadEditEmail,
      loadEmailCreationPassword,
      loadCreatePassword,
      loadSendProspect,
    },
    modal: {
      isOpenResend,
      setIsOpenResend,
      isOpenNoFunds,
      setIsOpenNoFunds,
      openInvalidModal,
      openNoExistModal,
      openExistentModal,
      setOpenExistentModal,
      setOpenInvalidModal,
      setOpenNoExistModal,
      openFormDocument,
      setOpenFormDocument,
    },
    mutations: {
      logoutMutation,
      sendProspectMutation,
    },
  };
};

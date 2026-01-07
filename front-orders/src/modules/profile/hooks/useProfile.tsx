import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdOutlineMail, MdOutlinePhoneIphone } from 'react-icons/md';

import { notifyError } from '@/common/components';
import {
  ContextRoutesEnum,
  ContextSplashEnum,
  UpdateEmailErrorsDictionary,
  UpdatePhoneErrorsDictionary,
  ValidateEmailErrorsDictionary,
  ValidatePhoneErrorsDictionary,
} from '@/common/enums';
import { useAppDispatch, useStateCallback } from '@/common/hooks';
import { IProfileFundsByCustomerResponse } from '@/common/interfaces/profile.interface';
import { useGoogleRecaptcha } from '@/modules/auth/hooks/useGoogleRecaptcha';
import {
  setEmail,
  setPhoneNumber,
  setUsername,
} from '@/modules/auth/slice/authSlice';
import { EditProfileStepEnum } from '@/modules/profile/enums/edit.profile.step.enum';
import {
  emailValidationSchema,
  passwordValidationSchema,
  phoneNumberValidationSchema,
  profileUpdateEmailValidationSchema,
  profileUpdatePhoneValidationSchema,
  TEmailValidationForm,
  TPasswordValidationForm,
  TPhoneValidationForm,
  TProfileUpdateEmailForm,
  TProfileUpdatePhoneForm,
  TUpdatePasswordForm,
  TUpdateUsernameForm,
  updatePasswordValidationSchema,
  updateUsernameValidationSchema,
} from '@/modules/profile/helpers/profileValidationSchemas';
import { setSplash } from '@/redux/common/layoutSlice';
import { ProfileService } from '@/services/ProfileService';

export const useProfile = (enabled = false) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { handleReCaptchaVerify } = useGoogleRecaptcha();
  const [editProfileStep, setEditProfileStep] = useStateCallback<number>(
    EditProfileStepEnum.VALIDATE_PASSWORD
  );
  const listFundsByCustomerQuery = useQuery<IProfileFundsByCustomerResponse>(
    ['profile-list-funds-by-customer'],
    () => ProfileService().listFundsByCustomer(),
    {
      enabled,
    }
  );

  const passwordValidationForm = useForm<TPasswordValidationForm>({
    resolver: zodResolver(passwordValidationSchema),
  });
  const emailValidationForm = useForm<TEmailValidationForm>({
    resolver: zodResolver(emailValidationSchema),
  });
  const phoneValidationForm = useForm<TPhoneValidationForm>({
    resolver: zodResolver(phoneNumberValidationSchema),
  });
  const updateUsernameForm = useForm<TUpdateUsernameForm>({
    resolver: zodResolver(updateUsernameValidationSchema),
  });
  const updateEmailForm = useForm<TProfileUpdateEmailForm>({
    resolver: zodResolver(profileUpdateEmailValidationSchema),
  });
  const updatePhoneForm = useForm<TProfileUpdatePhoneForm>({
    resolver: zodResolver(profileUpdatePhoneValidationSchema),
  });
  const updatePasswordForm = useForm<TUpdatePasswordForm>({
    resolver: zodResolver(updatePasswordValidationSchema),
  });

  const passwordValidationMutation = useMutation({
    mutationFn: () =>
      ProfileService().validatePassword(passwordValidationForm.getValues()),
    onSuccess: (res) => {
      if (res.data) {
        setEditProfileStep(EditProfileStepEnum.EDIT_DATA);
        localStorage.setItem(
          'pwd',
          passwordValidationForm.getValues('password')
        );
      } else {
        notifyError({
          title: 'Contraseña incorrecta',
          subtitle:
            'La contraseña ingresada es incorrecta. Inténtalo de nuevo.',
        });
      }
    },
  });

  const emailValidationMutation = useMutation({
    mutationFn: () =>
      ProfileService().validateEmail(emailValidationForm.getValues()),
    onSuccess: (res) => {
      if (res.message === ValidateEmailErrorsDictionary.SAME_AS_THE_OLD) {
        notifyError({
          title: 'El correo ingresado es igual al actual',
          subtitle: 'El nuevo correo no puede ser el mismo que el actual.',
          Icon: MdOutlineMail,
        });
        return;
      }
      if (res.message === ValidateEmailErrorsDictionary.ALREADY_REGISTERED) {
        notifyError({
          title: 'El correo ya ha sido registrado',
          subtitle: 'Este correo ya se encuentra registrado en una cuenta.',
          Icon: MdOutlineMail,
        });
        return;
      }

      router.push(ContextRoutesEnum.PROFILE_VALIDATE_EMAIL);
      localStorage.setItem('email', emailValidationForm.getValues('email'));
    },
  });

  const phoneValidationMutation = useMutation({
    mutationFn: (phoneNumber: string) =>
      ProfileService().validatePhone({ phone_number: phoneNumber }),
    onSuccess: (res) => {
      if (res.message === ValidatePhoneErrorsDictionary.SAME_AS_THE_OLD) {
        notifyError({
          title: 'El número de celular ingresado es igual al actual',
          subtitle: 'El nuevo número no puede ser el mismo que el actual.',
          Icon: MdOutlinePhoneIphone,
        });
        return;
      }
      if (res.message === ValidatePhoneErrorsDictionary.ALREADY_REGISTERED) {
        notifyError({
          title: 'El número de celular ya ha sido registrado',
          subtitle: 'Este número ya se encuentra registrado en una cuenta.',
          Icon: MdOutlinePhoneIphone,
        });
        return;
      }
      router.push(ContextRoutesEnum.PROFILE_VALIDATE_PHONE);
      localStorage.setItem(
        'phone_number',
        phoneValidationForm.getValues('phone_number')
      );
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: () =>
      ProfileService().updateUsername(updateUsernameForm.getValues()),
    onSuccess: () => {
      dispatch(
        setSplash({
          show: true,
          type: ContextSplashEnum.PROFILE_UPDATED,
        })
      );
      dispatch(setUsername(updateUsernameForm.getValues('username')));
      setTimeout(() => {
        router.push(ContextRoutesEnum.DASHBOARD);
      }, 5000);
    },
  });
  const updateEmailMutation = useMutation({
    mutationFn: () => ProfileService().updateEmail(updateEmailForm.getValues()),
    onSuccess: (res) => {
      if (res.message === UpdateEmailErrorsDictionary.INVALID_CODE) {
        notifyError({
          subtitle: 'El código es inválido.',
        });
        return;
      }

      dispatch(
        setSplash({
          type: ContextSplashEnum.PROFILE_EMAIL_VERIFIED,
          show: true,
        })
      );
      dispatch(setEmail(updateEmailForm.getValues('email')));
      setTimeout(() => {
        router.replace(ContextRoutesEnum.DASHBOARD);
      }, 5000);
    },
  });
  const updatePasswordMutation = useMutation({
    mutationFn: () =>
      ProfileService().updatePassword(updatePasswordForm.getValues()),
    onSuccess: () => {
      dispatch(
        setSplash({
          type: ContextSplashEnum.PROFILE_PASSWORD_UPDATED,
          show: true,
        })
      );
      setTimeout(() => {
        router.replace(ContextRoutesEnum.DASHBOARD);
      }, 5000);
    },
  });
  const updatePhoneMutation = useMutation({
    mutationFn: () =>
      ProfileService().updatePhone({
        ...updatePhoneForm.getValues(),
        phone_number: `+51` + updatePhoneForm.getValues('phone_number'),
      }),
    onSuccess: (res) => {
      if (res.message === UpdatePhoneErrorsDictionary.INVALID_CODE) {
        notifyError({
          subtitle: 'El código es inválido.',
        });
        return;
      }

      dispatch(
        setSplash({
          type: ContextSplashEnum.PROFILE_PHONE_VERIFIED,
          show: true,
        })
      );
      dispatch(
        setPhoneNumber(`+51` + updatePhoneForm.getValues('phone_number'))
      );
      setTimeout(() => {
        router.replace(ContextRoutesEnum.DASHBOARD);
      }, 5000);
    },
  });

  const submitReset: SubmitHandler<TPasswordValidationForm> = async () => {
    passwordValidationMutation.mutate();
  };

  const submitValidateEmail = async () => {
    const email = emailValidationForm.getValues('email');
    const regex = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    if (!email.match(regex)) {
      notifyError({
        title: 'Correo inválido',
        subtitle: 'Ingresa un correo válido para verificarlo.',
        Icon: MdOutlineMail,
      });
      return;
    }

    emailValidationMutation.mutate();
  };

  const submitValidatePhone = async () => {
    const phone_number = phoneValidationForm.getValues('phone_number');
    const regex = new RegExp('^[9][0-9]{8}$');

    if (!phone_number.match(regex)) {
      notifyError({
        title: 'Número de celular inválido',
        subtitle: 'Ingresa un número de celular para verificarlo.',
        Icon: MdOutlinePhoneIphone,
      });
      return;
    }
    phoneValidationMutation.mutate(`+51${phone_number}`);
  };

  const submitUpdateUsername: SubmitHandler<TUpdateUsernameForm> = async () => {
    updateUsernameMutation.mutate();
  };
  const submitUpdateEmail: SubmitHandler<
    TProfileUpdateEmailForm
  > = async () => {
    updateEmailMutation.mutate();
  };
  const submitUpdatePassword: SubmitHandler<TUpdatePasswordForm> = async () => {
    await handleReCaptchaVerify();
    updatePasswordMutation.mutate();
  };
  const submitUpdatePhone: SubmitHandler<
    TProfileUpdatePhoneForm
  > = async () => {
    updatePhoneMutation.mutate();
  };

  return {
    queries: {
      listFundsByCustomerQuery,
    },
    forms: {
      passwordValidationForm,
      updateUsernameForm,
      emailValidationForm,
      updateEmailForm,
      phoneValidationForm,
      updatePhoneForm,
      updatePasswordForm,
    },
    mutations: {
      passwordValidationMutation,
      updateUsernameMutation,
      emailValidationMutation,
      updateEmailMutation,
      phoneValidationMutation,
      updatePhoneMutation,
      updatePasswordMutation,
    },
    submitHandlers: {
      submitReset,
      submitUpdateUsername,
      submitValidateEmail,
      submitUpdateEmail,
      submitValidatePhone,
      submitUpdatePhone,
      submitUpdatePassword,
    },
    state: {
      editProfileStep,
      setEditProfileStep,
    },
  };
};

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Dialog, Transition } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

import { notifyError } from '@/common/components';
import { Spinner } from '@/common/components/Spinner';
import {
  CivilMessages,
  ContextRoutesEnum,
  ContextSplashEnum,
  FacephiIdentityValidationErrorsDictionary,
} from '@/common/enums';
import { useAppDispatch } from '@/common/hooks/redux-hooks';
import FacePhiComponent from '@/modules/auth/facephi/FacephiComponent';
import { useAuthentication } from '@/modules/auth/hooks/useAuthentication';
import { setSplash } from '@/redux/common/layoutSlice';
import { FacephiService } from '@/services/FacephiService';
interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFacialState: any;
  setAutocaptureState: any;
}

export const ModalFacial = ({ isOpen, setIsOpen, setFacialState }: IProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentDNI, currentEmail, isCollaborator } = useAuthentication();

  const {
    mutate: facephiFaceVsReniecCallMutation,
    isLoading: isFacephiFaceVsReniecLoading,
  } = useMutation(
    (token: any) =>
      dispatch(
        FacephiService().FacephiFaceVsReniecCall({
          origin: 'WEB',
          resend: true,
          sendCreatePassword: false,
          operation: 'FACIAL',
          platform: 'WEB',
          documentNumber: currentDNI ?? '',
          dni: currentDNI ?? '',
          imageFrontDocument: '',
          imageBackDocument: '',
          countryCode: 'PER',
          tokenOcr: '',
          bestImage: '',
          bestImageTemplateRaw: token.bestImageTokenized,
          templateRaw: token.templateRaw,
          codFund: '',
          returnPII: true,
        })
      ),
    {
      onSuccess(data) {
        if (data.payload.message) {
          if (data.payload.message.includes('limit')) {
            setFacialState(3);
          } else {
            setFacialState(1);
          }
          setIsOpen(false);
          return;
        } else {
          if (
            data.payload.data.serviceResultLog ===
            FacephiIdentityValidationErrorsDictionary.NEGATIVE
          ) {
            setFacialState(1);
          } else if (
            data.payload.data.serviceResultLog !== CivilMessages.POSITIVE
          ) {
            notifyError({
              title: data.payload.data.serviceResultLog,
            });
            setFacialState(1);
          } else {
            dispatch(
              setSplash({
                show: true,
                type: ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS,
              })
            );
            setTimeout(() => {
              if (isCollaborator === '1') {
                router.push(
                  `${ContextRoutesEnum.AUTH_GENERATE_PASSWORD}?email=${currentEmail}&hash=${data.payload.data.securityHash}`
                );
              } else {
                router.push(
                  {
                    pathname: ContextRoutesEnum.AUTH_REGISTER,
                    query: {
                      validate: true,
                    },
                  },
                  ContextRoutesEnum.AUTH_REGISTER
                );
              }
            }, 5000);
          }
          setIsOpen(false);
        }
      },
      onError() {
        setIsOpen(false);
        setFacialState(1);
      },
      retry: 0,
    }
  );

  const { mutate: facephiNoAuthCivilValidationMutation } = useMutation(
    (token: any) =>
      dispatch(
        FacephiService().FacephiNoAuthCivilValidationCall({
          origin: 'WEB',
          resend: true,
          sendCreatePassword: false,
          operation: 'FACIAL',
          platform: 'WEB',
          documentNumber: currentDNI ?? '',
          dni: currentDNI ?? '',
          imageFrontDocument: '',
          imageBackDocument: '',
          countryCode: 'PER',
          tokenOcr: '',
          bestImage: '',
          bestImageTemplateRaw: token.bestImageTokenized,
          templateRaw: token.templateRaw,
          codFund: '',
          returnPII: true,
        })
      ),
    {
      onSuccess: async (data) => {
        if (data.payload.message) {
          if (data.payload.message.includes('limit')) {
            setFacialState(3);
          } else {
            setFacialState(1);
          }
          setIsOpen(false);
          return;
        } else {
          if (
            data.payload.data.serviceResultLog ===
            FacephiIdentityValidationErrorsDictionary.NEGATIVE
          ) {
            setFacialState(1);
          } else if (
            data.payload.data.serviceResultLog !== CivilMessages.POSITIVE
          ) {
            notifyError({
              title: data.payload.data.serviceResultLog,
            });
            setFacialState(1);
          } else {
            dispatch(
              setSplash({
                show: true,
                type: ContextSplashEnum.IDENTITY_VALIDATION_SUCCESS,
              })
            );
            setTimeout(() => {
              if (isCollaborator === '1') {
                router.push(
                  `${ContextRoutesEnum.AUTH_GENERATE_PASSWORD}?email=${currentEmail}&hash=${data.payload.data.securityHash}`
                );
              } else {
                router.push(
                  {
                    pathname: ContextRoutesEnum.AUTH_REGISTER,
                    query: {
                      validate: true,
                    },
                  },
                  ContextRoutesEnum.AUTH_REGISTER
                );
              }
            }, 5000);
          }
          setIsOpen(false);
        }
      },
      onError() {
        // handleCloseSession();
        notifyError({
          title: 'Se produjo un error inesperado, vuelva a intentar por favor.',
        });
        setIsOpen(false);
      },
      retry: 0,
    }
  );

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsOpen(false)}
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
                id='container'
                className={clsx(
                  'flex w-[300px] transform flex-col items-center justify-center space-y-5 overflow-hidden rounded-sm bg-white align-middle  shadow-xl transition-all md:w-[800px]'
                )}
              >
                {isFacephiFaceVsReniecLoading ? (
                  <div className='flex flex-col items-center justify-center py-20'>
                    {isFacephiFaceVsReniecLoading && (
                      <h5 className='py-2 font-semibold text-neutral-800'>
                        Validando información...
                      </h5>
                    )}
                    <Spinner />
                  </div>
                ) : (
                  <FacePhiComponent
                    onValidate={
                      isCollaborator == '1'
                        ? facephiFaceVsReniecCallMutation
                        : facephiNoAuthCivilValidationMutation
                    }
                    setIsOpen={setIsOpen}
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

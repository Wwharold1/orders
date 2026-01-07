import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React from 'react';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalEmail = ({ isOpen, setIsOpen }: IProps) => {
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
          <div className='fixed inset-0 bg-neutral-800 opacity-80' />
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
              <Dialog.Panel className='flex w-[640px] transform flex-col items-center space-y-5 overflow-hidden rounded-sm bg-white p-10 align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='flex flex-col items-center space-y-3 text-lg font-bold leading-6 text-neutral-900 md:text-xl'
                >
                  <div className='rounded-full bg-primary-50 p-3'>
                    <Image
                      src='/icons/mailModal.svg'
                      alt='Email icon'
                      width={20}
                      height={20}
                    />
                  </div>
                  <p>¿Deseas editar tu correo electrónico?</p>
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='font-regular text-sm text-neutral-800 md:text-base'>
                    Si quieres editar el correo asociado a tu cuenta, por favor
                    comunícate con tu Asesor de Inversiones o, de lo contrario,
                    contáctanos a{' '}
                    <span className='cursor-pointer font-bold text-primary-500'>
                      backoffice@prudentialsaf.com.pe
                    </span>{' '}
                    para que podamos ayudarte.
                  </p>
                </div>

                <div className='flex'>
                  <button
                    type='button'
                    className='group relative mt-5 flex items-center justify-center space-x-5 rounded-md bg-primary-500 px-16  py-2.5 text-[16px] font-semibold text-white focus-visible:outline  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 md:px-36'
                    onClick={() => setIsOpen(false)}
                  >
                    Aceptar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

import { prudentialModern } from '@/common/helper/fontHelper';

interface IProps {
  isOpen: boolean;
  setIsOpen: any;
  title?: string;
  subtitle?: string;
  confirmationText?: string;
  secondaryConfirmationText?: string;
  confirmationCustomFunction?: any;
  secondaryCustomFunction?: any;
  urlIcon?: string;
  iconSize?: number;
  children?: JSX.Element | JSX.Element[];
  modalLength?: number;
  closeOnTouchOutside?: boolean;
  closeIcon?: boolean;
  customIcon?: JSX.Element;
  size?: 1 | 2;
  customColor?: string;
  extended?: boolean;
  rounded?: boolean;
  onlyTitle?: boolean;
  closeOnSaved?: boolean;
  disabledPrimary?: boolean;
  modalNews?: boolean;
  confirmationModalCustomFunction?: any;
}
export const Modal = ({
  isOpen,
  setIsOpen,
  title,
  subtitle,
  confirmationText,
  secondaryConfirmationText,
  urlIcon,
  iconSize = 20,
  children,
  modalLength = 640,
  closeOnTouchOutside = true,
  closeIcon,
  customIcon,
  size = 1,
  customColor,
  extended,
  confirmationCustomFunction,
  secondaryCustomFunction,
  rounded = false,
  onlyTitle = false,
  closeOnSaved = true,
  disabledPrimary = false,
  modalNews = false, // Nuevo parámetro
  confirmationModalCustomFunction,
}: IProps) => {
  const hasTwoButtons = secondaryConfirmationText && confirmationText;

  const handleOutsideClick = () => {
    if (closeOnTouchOutside) {
      setIsOpen(false); // Cierra el modal
      if (modalNews && confirmationModalCustomFunction) {
        confirmationModalCustomFunction(); // Ejecuta la función solo si modalNews es true
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as='div'
        className='relative z-[100]'
        onClose={handleOutsideClick} // Llama a la función personalizada
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
                className={clsx(
                  prudentialModern.variable,
                  'font-primary',
                  size === 1 ? 'space-y-5' : 'space-y-2',
                  size === 1 ? 'p-8 md:p-10' : 'p-12',
                  rounded && 'rounded-sm',
                  `flex transform flex-col items-center overflow-hidden bg-white align-middle shadow-xl transition-all`
                )}
                style={{
                  width: modalLength,
                }}
              >
                <Dialog.Title
                  as='h3'
                  className='flex flex-col items-center space-y-4 text-lg font-bold leading-6 text-neutral-900 md:text-xl'
                >
                  {customIcon && (
                    <div className='grid h-11 w-11 place-content-center rounded-full bg-primary-50'>
                      {urlIcon && (
                        <Image
                          src={urlIcon}
                          alt={urlIcon}
                          width={iconSize}
                          height={20}
                        />
                      )}
                      {customIcon && customIcon}
                    </div>
                  )}
                  {title && (
                    <p
                      className={clsx(
                        size === 2 && 'pt-3',
                        'text-xl font-bold',
                        customColor ?? 'text-primary-900'
                      )}
                    >
                      {title}
                    </p>
                  )}
                </Dialog.Title>
                <div className='mt-1'>
                  <p className='text-sm text-neutral-600 md:text-base'>
                    {children ? children : subtitle}
                  </p>
                </div>

                <div
                  className={clsx(
                    'flex flex-col space-x-0 md:flex-row md:space-x-2',
                    extended && 'w-full'
                  )}
                >
                  {secondaryConfirmationText && (
                    <div className={clsx('flex', extended && 'w-full')}>
                      <button
                        type='button'
                        className={clsx(
                          'group relative mt-2.5 flex items-center justify-center space-x-5 rounded-full bg-white px-10 py-4 pb-3.5  text-[16px] font-semibold leading-none text-prudential-500 ring-[2px] ring-inset ring-prudential-500 focus-visible:outline-none md:px-16',
                          extended && 'w-full',
                          hasTwoButtons && 'md:!px-10',
                          onlyTitle && 'md:!mt-0'
                        )}
                        onClick={() => {
                          secondaryCustomFunction && secondaryCustomFunction();
                          setIsOpen(false);
                        }}
                      >
                        {secondaryConfirmationText}
                      </button>
                    </div>
                  )}
                  {confirmationText && (
                    <div className={clsx('flex', extended && 'w-full')}>
                      <button
                        type='button'
                        className={clsx(
                          'group relative mt-2.5 flex items-center justify-center space-x-5 rounded-full bg-prudential-500 px-10 py-4 pb-3.5  text-[16px] font-semibold leading-none text-white focus-visible:outline-none md:px-16',
                          extended && 'w-full',
                          hasTwoButtons && 'md:!px-10',
                          onlyTitle && 'md:!mt-0'
                        )}
                        disabled={disabledPrimary}
                        onClick={() => {
                          confirmationCustomFunction &&
                            confirmationCustomFunction();

                          closeOnSaved && setIsOpen(false);
                        }}
                      >
                        {confirmationText}
                      </button>
                    </div>
                  )}
                </div>
                {closeIcon && (
                  <Image
                    src='/icons/closeIcon.svg'
                    alt={urlIcon || ''}
                    onClick={handleOutsideClick}
                    className='absolute right-5 top-0 cursor-pointer rounded-full p-2 hover:bg-gray-50'
                    width={32}
                    height={32}
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { FC, SVGProps } from 'react';

import IconInfo from '@/common/components/icons/utils/IconInfo';
import { MediaQueryEnum } from '@/common/enums';
import { useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';

interface IProps {
  ContentIcon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  ButtonIcon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  title: string;
  content: string;
  positioning?: 'right' | 'top' | 'bottom' | 'left';
}

export const Tooltip: FC<IProps> = ({
  ButtonIcon,
  ContentIcon = IconInfo,
  content,
  title,
  positioning,
}) => {
  const [openModal, setOpenModal] = useStateCallback<boolean>(false);
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);

  const position = positioning ? positioning : !isMdDown ? 'right' : 'bottom';

  return (
    <>
      <Popover className='relative z-[100] hidden lg:block'>
        <Popover.Button className='mb-1 cursor-pointer rounded-full p-1.5 transition duration-150 hover:bg-neutral-300/10 focus:outline-none'>
          <ButtonIcon />
        </Popover.Button>

        <Transition
          enter='transition duration-100 ease-out'
          enterFrom='transform scale-95 opacity-0'
          enterTo='transform scale-100 opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform scale-100 opacity-100'
          leaveTo='transform scale-95 opacity-0'
        >
          <Popover.Panel
            as='div'
            style={{
              zIndex: 99999,
            }}
            className={clsx(
              'absolute h-full w-full',
              position === 'right' && 'md:bottom-14 md:ml-10',
              position === 'left' && 'md:-left-[420px] md:bottom-14'
            )}
          >
            <div
              className={clsx(
                'absolute z-30 w-60 rounded-lg border border-[#7ECAF2] bg-white shadow-md',
                content.length < 40 ? 'md:min-w-max' : 'md:w-[400px]'
              )}
            >
              <div className='bg-[#E2F4FF26] p-3'>
                <div className='flex items-center space-x-1'>
                  <ContentIcon fill='#007BC3' />
                  <p className='mt-0.5 font-bold text-primary-900'>{title}</p>
                </div>
                <p className='mt-1 text-xs text-neutral-500'>{content}</p>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      <div className='block lg:hidden'>
        <div
          onClick={() => setOpenModal(true)}
          className='mb-1 cursor-pointer rounded-full p-1.5 transition duration-150 hover:bg-neutral-300/10 focus:outline-none'
        >
          <ButtonIcon />
        </div>
        <Transition appear show={openModal} as={React.Fragment}>
          <Dialog
            as='div'
            className='relative z-30'
            onClose={() => setOpenModal(false)}
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

            <div className='fixed inset-0 z-30 overflow-y-auto'>
              <div className='z-30 min-h-full items-end justify-center p-4'>
                <Dialog.Panel className='z-30 rounded bg-white'>
                  <div className='absolute bottom-0 left-0 z-30 w-full rounded-t-lg border bg-[white] p-3 shadow-md md:rounded-lg '>
                    <div className='flex h-auto flex-col bg-[#E2F4FF26] pb-5'>
                      <div className='flex items-center space-x-3'>
                        <ContentIcon
                          fill='#007BC3'
                          className='mt-1 scale-125'
                        />
                        <p className='mt-1 font-bold text-primary-900'>
                          {title}
                        </p>
                      </div>
                      <p className='mt-3 font-light text-neutral-500'>
                        {content}
                      </p>
                    </div>
                  </div>

                  {/* ... */}
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

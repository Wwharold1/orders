import { Disclosure, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { FC } from 'react';

import { IconChevron } from '@/common/components/icons/utils/IconChevron';

interface IProps {
  title: string;
  children: JSX.Element | JSX.Element[] | React.ReactNode | React.ReactNode[];
}

export const Accordion: FC<IProps> = ({ children, title }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <div className='rounded-lg bg-white'>
          <Disclosure.Button className='flex w-full items-center justify-between rounded-lg bg-white px-3 py-3 pt-3.5 font-bold text-primary-900'>
            <p className='leading-none'>{title}</p>

            <IconChevron
              className={clsx(
                'transition duration-150 ease-in-out',
                open && `rotate-180`
              )}
            />
          </Disclosure.Button>

          <Transition
            show={open}
            enter='transition duration-100 ease-out'
            enterFrom='transform scale-95 opacity-0'
            enterTo='transform scale-100 opacity-100'
            leave='transition duration-75 ease-out'
            leaveFrom='transform scale-100 opacity-100'
            leaveTo='transform scale-95 opacity-0'
          >
            <Disclosure.Panel className='rounded-lg bg-white' static>
              {children}
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
};

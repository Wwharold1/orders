import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Modal } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import { useStateCallback } from '@/common/hooks';
import { useAppDispatch, useAppSelector } from '@/common/hooks/redux-hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { ISidebarSchema } from '@/common/interfaces';
import { setSidebar } from '@/redux/common/layoutSlice';

interface IProps {
  option: ISidebarSchema;
  isSelected: boolean;
}

export const SidebarItem: FC<IProps> = ({ option, isSelected }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { sidebarOpened } = useAppSelector((state) => state.layout);
  const isLgDown = useMediaQuery(MediaQueryEnum.LG);

  const [openModalInterrupt, setOpenModalInterrupt] =
    useStateCallback<boolean>(false);

  return (
    <motion.li
      className={clsx(
        'relative items-center pl-8 pr-6 lg:pl-7 xl:pl-[52px]',
        sidebarOpened ? 'xl:pl-[52px]' : 'xl:pl-[52px]'
      )}
    >
      {isSelected && (
        <div className='absolute left-0 top-1/2 h-8 w-2 -translate-y-1/2 rounded-r-md bg-primary-500'></div>
      )}
      <div
        className={clsx(
          'flex h-12 cursor-pointer items-center space-x-3 rounded-md p-3 duration-200 ease-out',
          isSelected && 'bg-primary-500',
          !isSelected && 'hover:bg-primary-50/50',
          !sidebarOpened && !isLgDown ? 'w-12 justify-center' : 'justify-start'
        )}
      >
        <option.icon fill={isSelected ? 'white' : 'rgb(0 123 195 / 0.75)'} />
        {(sidebarOpened || isLgDown) && (
          <p
            className={clsx(
              'mt-0.5 text-base font-bold',
              isSelected ? 'text-white' : 'text-primary-500/75'
            )}
          >
            {option.title}
          </p>
        )}
      </div>
      <Modal
        isOpen={openModalInterrupt}
        title='¿Deseas interrumpir el proceso?'
        setIsOpen={setOpenModalInterrupt}
        customIcon={<IconDanger className='mb-1' />}
        confirmationText='Aceptar'
        confirmationCustomFunction={() => {
          router.push(ContextRoutesEnum.DASHBOARD);
          dispatch(setSidebar(option.type));
        }}
        extended
        modalLength={500}
        secondaryConfirmationText='Cancelar'
      >
        <span className='text-neutral-600'>
          Si sales ahora, tu información podría no guardarse.
        </span>
      </Modal>
    </motion.li>
  );
};

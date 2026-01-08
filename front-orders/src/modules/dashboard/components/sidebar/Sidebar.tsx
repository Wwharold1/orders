/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import { AnimationControls, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect } from 'react';

import { IconArrowLeft } from '@/common/components/icons/utils/IconArrowLeft';
import { DeviceTypeEnum, MediaQueryEnum } from '@/common/enums';
import { useAppDispatch, useAppSelector, useWindowSize } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { SidebarBottomItems } from '@/modules/dashboard/components/sidebar/SidebarBottomItems';
import { SidebarItems } from '@/modules/dashboard/components/sidebar/SidebarItems';
import {
  backgroundVariants,
  sideMobileVariants,
  sideTabletVariants,
  sideVariants,
} from '@/modules/dashboard/motion';
import { toggleSidebarOpened } from '@/redux/common/layoutSlice';

interface IProps {
  controls: AnimationControls;
}

export const Sidebar: FC<IProps> = ({ controls }) => {
  const { sidebarOpened } = useAppSelector((state) => state.layout);
  const { width } = useWindowSize();
  const { deviceType } = useAppSelector((state) => state.layout);
  const isLgDown = useMediaQuery(MediaQueryEnum.LG);
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isMdDown || isLgDown) {
      sidebarOpened && dispatch(toggleSidebarOpened());
      controls.start('closed');
    }
  }, [isMdDown, isLgDown]);

  const applyZIndex = (sidebarOpened || isLgDown) && isLgDown;

  return (
    <div>
      <motion.section
        initial={sidebarOpened ? 'open' : 'closed'}
        animate={controls}
        custom={isMdDown ? '75%' : isLgDown ? '40%' : width}
        variants={
          isMdDown
            ? sideMobileVariants
            : isLgDown
            ? sideTabletVariants
            : sideVariants
        }
        key={isMdDown ? '75%' : isLgDown ? '40%' : width}
        className={clsx('fixed h-full lg:relative', applyZIndex && 'z-[70]')}
      >
        <motion.div
          className={clsx(
            'h-full w-full bg-white lg:w-full',
            applyZIndex && 'z-[69]'
          )}
        >
          <motion.nav className='relative flex h-full w-full flex-grow flex-col py-10'>
            <Link
              href='/dashboard'
              className={clsx(
                deviceType === DeviceTypeEnum.DESKTOP
                  ? 'cursor-pointer self-center justify-self-center lg:self-center lg:justify-self-center lg:pl-0'
                  : sidebarOpened
                  ? 'cursor-pointer self-center justify-self-center lg:self-center lg:justify-self-center '
                  : 'pl-10'
              )}
            >
            </Link>
            <SidebarItems controls={controls} />
            <SidebarBottomItems />
            <div
              className='absolute -right-5 bottom-20 z-10 hidden h-10 w-10 cursor-pointer place-content-center rounded-lg bg-primary-300 lg:grid'
              onClick={() => {
                dispatch(toggleSidebarOpened());
                !sidebarOpened
                  ? controls.start('open')
                  : controls.start('closed');
              }}
            >
              <div
                className={clsx(
                  'cursor-pointer transition-all duration-150 ease-in-out',
                  sidebarOpened ? 'rotate-0' : 'rotate-180'
                )}
              >
                <IconArrowLeft fill='white' />
              </div>
            </div>
          </motion.nav>
        </motion.div>
      </motion.section>
      <motion.div
        initial='closed'
        variants={backgroundVariants}
        animate={controls}
        onClick={() => {
          dispatch(toggleSidebarOpened());
          controls.start('closed');
        }}
        className={clsx(
          'absolute right-0 h-full w-full bg-[#001F45CC]',
          applyZIndex && 'z-[68]'
        )}
      ></motion.div>
    </div>
  );
};

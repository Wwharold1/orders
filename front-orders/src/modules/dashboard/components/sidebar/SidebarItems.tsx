import { AnimationControls, motion } from 'framer-motion';
import React, { FC } from 'react';

import { SidebarOptions } from '@/common/enums';
import { useAppSelector } from '@/common/hooks/redux-hooks';
import { SidebarItem } from '@/modules/dashboard/components/sidebar/SidebarItem';

interface IProps {
  controls: AnimationControls;
}

export const SidebarItems: FC<IProps> = ({ controls }) => {
  const { sidebar } = useAppSelector((state) => state.layout);

  return (
    <motion.ul className='mt-12 space-y-6'>
      {SidebarOptions.map((option, index) => {
        const isSelected = sidebar === option.type;
        return (
          <SidebarItem
            key={index + 1}
            option={option}
            isSelected={isSelected}
            controls={controls}
          />
        );
      })}
    </motion.ul>
  );
};

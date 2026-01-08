import React from 'react';

import { useAppSelector } from '@/common/hooks';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { Home } from '@/modules/home/Home';

import { ContextSidebarEnum } from '../../common/enums/layout-types.enum';

export const Dashboard = () => {
  const { sidebar } = useAppSelector((state) => state.layout);
  const CurrentComponent = DashboardNavigation[sidebar as ContextSidebarEnum];

  return (
    <React.Fragment>
      <div className='relative h-full w-full bg-neutral-50'>
        <DashboardLayout>
          <div>
            <CurrentComponent />
          </div>
        </DashboardLayout>
      </div>
    </React.Fragment>
  );
};

const DashboardNavigation = {
  [ContextSidebarEnum.HOME]: Home
};

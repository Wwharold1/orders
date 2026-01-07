/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GetServerSideProps } from 'next';
import * as React from 'react';

import Seo from '@/common/components/Seo';
import { DeviceTypeEnum } from '@/common/enums';
import { useAppDispatch } from '@/common/hooks';
import { Login } from '@/modules/auth/Login';
import { setDeviceType } from '@/redux/common/layoutSlice';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function Dashboard(props: any) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(setDeviceType(props.deviceType));
    const my_widget = localStorage.getItem('my_widget');
    if (my_widget) {
      localStorage.setItem('my_widget', (parseInt(my_widget) + 1).toString());
    } else {
      localStorage.setItem('my_widget', '1');
    }
  }, []);

  return (
    <React.Fragment>
      {/* <Seo templateTitle='Home' /> */}

      <Seo />

      <section className='app-container overflow-x-hidden'>
        <Login />
      </section>
    </React.Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const UA = context.req.headers['user-agent']!;

  const isMobile = Boolean(
    UA.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );
  // detect tablet device

  return {
    props: {
      deviceType: isMobile ? DeviceTypeEnum.MOBILE : DeviceTypeEnum.DESKTOP,
      UA: UA,
    },
  };
};

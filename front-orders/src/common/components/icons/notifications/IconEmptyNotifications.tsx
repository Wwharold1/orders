import * as React from 'react';
import { SVGProps } from 'react';

export const IconEmptyNotifications = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={64}
    height={64}
    fill='none'
    {...props}
  >
    <circle cx={32} cy={32} r={32} fill='#56B2BD' />
    <path
      fill='#EEF7F8'
      d='M32.557 48a3.292 3.292 0 0 0 3.282-3.282h-6.564A3.282 3.282 0 0 0 32.557 48Zm9.846-9.846v-8.205c0-5.038-2.691-9.256-7.385-10.372v-1.116c0-1.361-1.1-2.461-2.461-2.461a2.458 2.458 0 0 0-2.462 2.462v1.115c-4.71 1.116-7.384 5.317-7.384 10.372v8.205l-3.282 3.282v1.64h26.256v-1.64l-3.282-3.282Z'
    />
  </svg>
);

import * as React from 'react';
import { SVGProps } from 'react';

export const IconAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    {...props}
  >
    <path
      fill='#fff'
      d='M12.667 8.667h-4v4H7.333v-4h-4V7.334h4v-4h1.334v4h4v1.333Z'
    />
  </svg>
);

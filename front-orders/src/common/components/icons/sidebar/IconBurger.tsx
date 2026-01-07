import * as React from 'react';
import { SVGProps } from 'react';

export const IconBurger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <g fill='#fff'>
      <path d='M21 3H3v2h18V3ZM21 19H3v2h18v-2ZM21 11H3v2h18v-2Z' />
    </g>
  </svg>
);

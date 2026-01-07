import * as React from 'react';
import { SVGProps } from 'react';

export const IconCheckCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={40}
    height={40}
    fill='none'
    {...props}
  >
    <path fill='#fff' d='M6.667 10h26.667v20H6.667z' />
    <path
      fill='#3A9BCE'
      d='M20 3.333C10.8 3.333 3.333 10.8 3.333 20c0 9.2 7.467 16.667 16.667 16.667 9.2 0 16.666-7.467 16.666-16.667C36.666 10.8 29.2 3.334 20 3.334Zm-3.334 25L8.333 20l2.35-2.35 5.983 5.967 12.65-12.65 2.35 2.367-15 15Z'
    />
  </svg>
);

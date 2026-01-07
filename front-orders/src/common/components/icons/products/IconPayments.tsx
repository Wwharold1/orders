import * as React from 'react';
import { SVGProps } from 'react';

export const IconPayments = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={20}
    height={20}
    fill='none'
    {...props}
  >
    <path
      fill='#fff'
      d='M19.166 6.666V15c0 .916-.75 1.666-1.666 1.666H4.166a.836.836 0 0 1-.833-.833c0-.458.375-.833.833-.833H17.5V6.666c0-.458.375-.833.833-.833.458 0 .833.375.833.833ZM3.333 13.333a2.497 2.497 0 0 1-2.5-2.5v-5c0-1.383 1.117-2.5 2.5-2.5h10c1.383 0 2.5 1.117 2.5 2.5v5.833c0 .917-.75 1.667-1.667 1.667H3.333Zm2.5-5c0 1.383 1.117 2.5 2.5 2.5s2.5-1.117 2.5-2.5-1.117-2.5-2.5-2.5a2.497 2.497 0 0 0-2.5 2.5Z'
      opacity={0.3}
    />
  </svg>
);

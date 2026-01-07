import * as React from 'react';
import { SVGProps } from 'react';

export const IconInvest = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={120}
    height={120}
    fill='none'
    {...props}
  >
    <g clipPath='url(#a)'>
      <path fill='#AAD8DE' d='M85 0H75v50h10V0Z' />
      <path fill='#56B2BD' d='M120 120H40l35-70h10l35 70Z' />
      <path fill='#AAD8DE' d='M70 120H0l30-50h10l30 50Z' />
      <path fill='#CF70AF' d='M120 35H85V5h35l-10 15 10 15Z' />
      <path
        fill='#E7B7D7'
        d='M40 30v10h8L38 50H23L1.5 71.5l7 7L27 60h15l13-13v8h10V30H40Z'
      />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M0 0h120v120H0z' />
      </clipPath>
    </defs>
  </svg>
);

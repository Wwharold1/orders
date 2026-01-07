import * as React from 'react';
import { SVGProps } from 'react';

export const IconVisibility = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    {...props}
  >
    <path
      fill='#67747B'
      d='M8 4.546a5.921 5.921 0 0 1 5.345 3.333A5.921 5.921 0 0 1 8 11.213a5.921 5.921 0 0 1-5.345-3.334A5.921 5.921 0 0 1 8 4.546Zm0-1.212a7.168 7.168 0 0 0-6.667 4.545A7.168 7.168 0 0 0 8 12.425a7.168 7.168 0 0 0 6.667-4.546A7.168 7.168 0 0 0 8 3.334Zm0 3.03a1.516 1.516 0 1 1-.001 3.032A1.516 1.516 0 0 1 8 6.364Zm0-1.212A2.731 2.731 0 0 0 5.273 7.88 2.731 2.731 0 0 0 8 10.607a2.731 2.731 0 0 0 2.727-2.728A2.731 2.731 0 0 0 8 5.152Z'
    />
  </svg>
);

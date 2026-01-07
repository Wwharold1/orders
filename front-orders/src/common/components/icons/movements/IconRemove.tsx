import * as React from 'react';
import { SVGProps } from 'react';

export const IconRemove = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    {...props}
  >
    <path fill='#fff' d='M12.667 8.667H3.333V7.334h9.334v1.333Z' />
  </svg>
);

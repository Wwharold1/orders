import * as React from 'react';
import { SVGProps } from 'react';

export const IconChevron = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill || '#007BC3'}
      d='m7.41 8.295 4.59 4.58 4.59-4.58L18 9.705l-6 6-6-6 1.41-1.41Z'
    />
  </svg>
);

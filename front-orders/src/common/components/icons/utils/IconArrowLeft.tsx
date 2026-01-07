import * as React from 'react';
import { SVGProps } from 'react';

export const IconArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={12}
    height={12}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='M11.334 5.333H3.22l3.727-3.727L6 .667.667 6 6 11.333l.94-.94-3.72-3.727h8.114V5.333Z'
    />
  </svg>
);

import * as React from 'react';
import { SVGProps } from 'react';

export const IconAccount = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={15}
    height={12}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='M13.5 0h-12C.667 0 .007.667.007 1.5L0 10.5c0 .832.667 1.5 1.5 1.5h12c.832 0 1.5-.668 1.5-1.5v-9c0-.833-.668-1.5-1.5-1.5Zm0 10.5h-12V6h12v4.5Zm0-7.5h-12V1.5h12V3Z'
    />
  </svg>
);

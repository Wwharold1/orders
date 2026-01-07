import * as React from 'react';
import { SVGProps } from 'react';

export const IconReceipt = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    {...props}
  >
    <g fill={props.fill || '#007BC3'}>
      <path d='m13 2.333-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1v9.333H2v2c0 1.107.893 2 2 2h8c1.107 0 2-.893 2-2V1.333l-1 1Zm-.333 10.333c0 .367-.3.667-.667.667a.669.669 0 0 1-.667-.667v-2h-6V3.333h7.334v9.333Z' />
      <path d='M10 4.666H6V6h4V4.666ZM12 4.666h-1.333V6H12V4.666ZM10 6.666H6V8h4V6.666ZM12 6.666h-1.333V8H12V6.666Z' />
    </g>
  </svg>
);

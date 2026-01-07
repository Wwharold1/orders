import * as React from 'react';
import { SVGProps } from 'react';

export const IconHome = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={20}
    height={18}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='m10 3.19 5 4.5v7.81h-2v-6H7v6H5V7.69l5-4.5ZM10 .5l-10 9h3v8h6v-6h2v6h6v-8h3l-10-9Z'
    />
  </svg>
);

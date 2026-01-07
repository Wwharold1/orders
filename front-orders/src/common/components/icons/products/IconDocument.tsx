import * as React from 'react';
import { SVGProps } from 'react';

export const IconDocument = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={12}
    height={14}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill || '#06C'}
      d='M3.334 9.667h5.333v1.334H3.334V9.667Zm0-2.666h5.333v1.333H3.334V7.001Zm4-6.667H2c-.733 0-1.333.6-1.333 1.333v10.667c0 .733.593 1.333 1.327 1.333H10c.734 0 1.334-.6 1.334-1.333v-8l-4-4Zm2.666 12H2V1.667h4.667v3.334H10v7.333Z'
    />
  </svg>
);

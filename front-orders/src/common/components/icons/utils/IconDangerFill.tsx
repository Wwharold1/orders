import * as React from 'react';
import { SVGProps } from 'react';

export const IconDangerFill = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill || '#D53943'}
      d='M.666 14.334h14.667L7.999 1.667.666 14.334Zm8-2H7.333V11h1.333v1.334Zm0-2.667H7.333V7h1.333v2.667Z'
    />
  </svg>
);

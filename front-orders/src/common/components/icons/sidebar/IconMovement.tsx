import * as React from 'react';
import { SVGProps } from 'react';

export const IconMovement = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={18}
    height={14}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='M3.99 6 0 10l3.99 4v-3H11V9H3.99V6ZM18 4l-3.99-4v3H7v2h7.01v3L18 4Z'
    />
  </svg>
);

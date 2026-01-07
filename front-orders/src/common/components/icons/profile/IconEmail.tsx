import * as React from 'react';
import { SVGProps } from 'react';

export const IconEmail = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={20}
    height={20}
    fill='none'
    {...props}
  >
    <path
      fill='#007BC3'
      d='M16.667 3.334H3.333c-.916 0-1.658.75-1.658 1.667l-.008 10c0 .916.75 1.666 1.666 1.666h13.334c.916 0 1.666-.75 1.666-1.666V5c0-.917-.75-1.667-1.666-1.667Zm0 11.667H3.333V6.667L10 10.834l6.667-4.167v8.334ZM10 9.167 3.333 5.001h13.334L10 9.167Z'
    />
  </svg>
);

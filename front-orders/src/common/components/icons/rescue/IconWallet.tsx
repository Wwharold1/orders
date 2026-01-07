import * as React from 'react';
import { SVGProps } from 'react';

export const IconWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    {...props}
  >
    <g fill='#007BC3'>
      <path d='M13.668 4.853v-1.52c0-.733-.6-1.333-1.333-1.333H3c-.74 0-1.333.6-1.333 1.333v9.334c0 .733.593 1.333 1.333 1.333h9.334c.733 0 1.333-.6 1.333-1.333v-1.52c.393-.234.667-.654.667-1.147V6c0-.493-.274-.913-.667-1.147ZM13.001 6v4H8.335V6H13Zm-10 6.667V3.333h9.334v1.334h-4C7.6 4.667 7 5.267 7 6v4c0 .733.6 1.333 1.334 1.333h4v1.334H3Z' />
      <path d='M10.335 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z' />
    </g>
  </svg>
);

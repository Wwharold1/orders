import * as React from 'react';
import { SVGProps } from 'react';

export const IconMore = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={3}
    height={12}
    fill='none'
    {...props}
  >
    <path
      fill='#06C'
      d='M1.333 3.333c.734 0 1.334-.6 1.334-1.334 0-.733-.6-1.333-1.334-1.333C.6.666 0 1.266 0 1.999c0 .734.6 1.334 1.333 1.334Zm0 1.333C.6 4.666 0 5.266 0 5.999c0 .734.6 1.334 1.333 1.334.734 0 1.334-.6 1.334-1.334 0-.733-.6-1.333-1.334-1.333Zm0 4C.6 8.666 0 9.266 0 9.999c0 .734.6 1.334 1.333 1.334.734 0 1.334-.6 1.334-1.334 0-.733-.6-1.333-1.334-1.333Z'
    />
  </svg>
);

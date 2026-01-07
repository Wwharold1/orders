import * as React from 'react';
import { SVGProps } from 'react';

export const IconArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={11}
    height={12}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='M6.333 10.527V3.081l3.254 3.253c.26.26.686.26.946 0 .26-.26.26-.68 0-.94L6.14 1.001a.664.664 0 0 0-.94 0L.8 5.387a.664.664 0 1 0 .94.94L5 3.081v7.446c0 .367.3.667.667.667.366 0 .666-.3.666-.667Z'
    />
  </svg>
);

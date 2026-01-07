import * as React from 'react';
import { SVGProps } from 'react';

export const IconBagFund = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={33}
    height={32}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='M18 21.333h-2.667C14.6 21.333 14 20.733 14 20H4.68v5.333C4.68 26.8 5.88 28 7.347 28H26c1.467 0 2.667-1.2 2.667-2.667V20h-9.334c0 .733-.6 1.333-1.333 1.333Zm9.333-12H22A5.332 5.332 0 0 0 16.667 4a5.332 5.332 0 0 0-5.334 5.333H6A2.674 2.674 0 0 0 3.333 12v4A2.657 2.657 0 0 0 6 18.667h8v-1.334C14 16.6 14.6 16 15.333 16H18c.733 0 1.333.6 1.333 1.333v1.334h8C28.8 18.667 30 17.467 30 16v-4c0-1.467-1.2-2.667-2.667-2.667ZM14 9.333c0-1.466 1.2-2.666 2.667-2.666 1.466 0 2.666 1.2 2.666 2.666h-5.346H14Z'
      opacity={0.3}
    />
  </svg>
);

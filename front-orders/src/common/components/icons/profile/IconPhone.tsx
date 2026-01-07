import * as React from 'react';
import { SVGProps } from 'react';

export const IconPhone = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={20}
    height={20}
    fill='none'
    {...props}
  >
    <path
      fill='#007BC3'
      d='M13.333.834H6.667c-1.15 0-2.084.933-2.084 2.083v14.167c0 1.15.934 2.083 2.084 2.083h6.666c1.15 0 2.084-.933 2.084-2.083V2.917c0-1.15-.934-2.083-2.084-2.083ZM10 18.334c-.692 0-1.25-.558-1.25-1.25s.558-1.25 1.25-1.25 1.25.558 1.25 1.25-.558 1.25-1.25 1.25Zm3.75-3.333h-7.5V3.334h7.5v11.667Z'
    />
  </svg>
);

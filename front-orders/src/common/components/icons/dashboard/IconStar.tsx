import * as React from 'react';
import { SVGProps } from 'react';

export const IconStar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={14}
    height={14}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='m7 10.847 4.12 2.487-1.093-4.687 3.64-3.153-4.794-.407L7 .667l-1.873 4.42-4.794.407 3.64 3.153-1.093 4.687L7 10.847Z'
    />
  </svg>
);

import * as React from 'react';
import { SVGProps } from 'react';

export const IconHide = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={20}
    height={14}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill || '#007BC3'}
      d='M10 1.818a8.882 8.882 0 0 1 8.018 5 8.882 8.882 0 0 1-8.018 5 8.882 8.882 0 0 1-8.018-5c1.5-3.063 4.573-5 8.018-5ZM10 0C5.455 0 1.573 2.827 0 6.818c1.573 3.991 5.455 6.818 10 6.818 4.546 0 8.427-2.827 10-6.818C18.427 2.828 14.546 0 10 0Zm0 4.545a2.274 2.274 0 1 1-.002 4.548A2.274 2.274 0 0 1 10 4.545Zm0-1.818a4.097 4.097 0 0 0-4.09 4.091A4.097 4.097 0 0 0 10 10.91a4.097 4.097 0 0 0 4.09-4.09A4.097 4.097 0 0 0 10 2.726Z'
    />
  </svg>
);

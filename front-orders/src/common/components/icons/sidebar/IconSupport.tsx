import * as React from 'react';
import { SVGProps } from 'react';

export const IconSupport = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='M11.5 23.295v-3.6c-5.01-.26-9-4.42-9-9.49 0-5.24 4.26-9.5 9.5-9.5s9.5 4.26 9.5 9.5c0 4.95-3.44 9.93-8.57 12.4l-1.43.69Zm.5-20.59c-4.14 0-7.5 3.36-7.5 7.5 0 4.14 3.36 7.5 7.5 7.5h1.5v2.3c3.64-2.3 6-6.08 6-9.8 0-4.14-3.36-7.5-7.5-7.5Zm-1 11.5h2v2h-2v-2Zm2-1.5h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5Z'
    />
  </svg>
);

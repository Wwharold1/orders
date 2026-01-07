import * as React from 'react';
import { SVGProps } from 'react';

export const IconDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <path fill='#fff' d='M19 9.5h-4v-6H9v6H5l7 7 7-7Zm-14 9v2h14v-2H5Z' />
  </svg>
);

import * as React from 'react';
import { SVGProps } from 'react';

export const IconCardDeclined = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill='#007BC3'
      stroke='#007BC3'
      d='m15.692 10.794-3-3H21.155v-3H9.692l-1-1h11.963c.834 0 1.5.667 1.5 1.5v11.963l-1-1v-5.463h-5.463ZM2.755 2.102l19.093 19.093-.704.703-2.966-2.958-.146-.146H4.655c-.834 0-1.5-.666-1.5-1.5l.01-12c0-.262.062-.497.167-.687l.183-.328-.265-.267-1.2-1.206.705-.704ZM5.009 5.77l-.854-.854v2.878h2.877L6.18 6.94l-1.17-1.17Zm10.816 12.023h1.207l-.854-.853-6-6-.146-.147H4.155v7h11.67Z'
    />
  </svg>
);

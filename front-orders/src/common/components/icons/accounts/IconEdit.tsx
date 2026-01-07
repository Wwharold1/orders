import * as React from 'react';
import { SVGProps } from 'react';

export const IconEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={16}
    height={16}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill || '#67747B'}
      d='m9.372 6.013.614.614-6.04 6.04h-.614v-.614l6.04-6.04ZM11.772 2a.667.667 0 0 0-.466.193l-1.22 1.22 2.5 2.5 1.22-1.22c.26-.26.26-.68 0-.94l-1.56-1.56A.655.655 0 0 0 11.773 2Zm-2.4 2.127L2 11.5V14h2.5l7.374-7.373-2.5-2.5Z'
    />
  </svg>
);

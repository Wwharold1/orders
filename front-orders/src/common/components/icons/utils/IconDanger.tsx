import * as React from 'react';
import { SVGProps } from 'react';

export const IconDanger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill || '#007BC3'}
      stroke={props.fill || '#007BC3'}
      strokeWidth={0.8}
      d='M12.346 6.29 12 5.69l-.346.599-7.53 13.01-.348.6h16.448l-.348-.6-7.53-13.01ZM1.694 21.1 12 3.298 22.306 21.1H1.694Zm9.706-3v-1.2h1.2v1.2h-1.2Zm0-4v-3.2h1.2v3.2h-1.2Z'
    />
  </svg>
);

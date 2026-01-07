import * as React from 'react';
import { SVGProps } from 'react';

export const IconEdit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={15}
    height={12}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill}
      d='M26.6465 22.2002L21.8467 27H20.4336V25.5869L25.2334 20.7871L26.6465 22.2002ZM17.4336 21V22H11.4336V21H17.4336ZM27.0068 19.0137C27.1772 18.8434 27.4387 18.8216 27.6318 18.9492L27.71 19.0137L28.4199 19.7236C28.5903 19.894 28.6122 20.1555 28.4844 20.3486L28.4199 20.4268L28.0635 20.7832L26.6504 19.3701L27.0068 19.0137ZM21.4336 17V18H11.4336V17H21.4336ZM21.4336 13V14H11.4336V13H21.4336Z'
    />
  </svg>
);

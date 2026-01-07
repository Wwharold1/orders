import * as React from 'react';
import { SVGProps } from 'react';

export const IconBankCard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={15}
    height={12}
    fill='none'
    {...props}
  >
    <path
      fill='#007BC3'
      stroke='#007BC3'
      d='M.507 1.5c0-.56.44-1 .993-1h12c.556 0 1 .444 1 1v9c0 .556-.444 1-1 1h-12c-.556 0-1-.444-1-1l.007-9ZM13.5 11h.5V5.5H1V11h12.5Zm0-7.5h.5V1H1v2.5h12.5Z'
    />
  </svg>
);

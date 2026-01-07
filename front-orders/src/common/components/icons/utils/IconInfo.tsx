import * as React from 'react';
import { SVGProps } from 'react';

const IconInfo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={14}
    height={14}
    fill='none'
    {...props}
  >
    <path
      fill={props.fill || '#B8BFC3'}
      d='M6 3.333v1.334h1.333V3.333H6ZM8 10V8.667h-.667V6h-2v1.333H6v1.334h-.667V10H8Zm5.333-3.333c0 3.666-3 6.666-6.666 6.666C3 13.333 0 10.333 0 6.667 0 3 3 0 6.667 0c3.666 0 6.666 3 6.666 6.667Zm-1.333 0a5.332 5.332 0 0 0-5.333-5.334 5.332 5.332 0 0 0-5.334 5.334A5.332 5.332 0 0 0 6.667 12 5.332 5.332 0 0 0 12 6.667Z'
    />
  </svg>
);
export default IconInfo;

import * as React from 'react';
import { SVGProps } from 'react';

export const IconBgProduct = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={352}
    height={129}
    fill='none'
    {...props}
  >
    <path
      fill='url(#a)'
      d='M85.809 51.69C53.213 42.24 15.021 55.63 0 63.507V129h632V-25.983c-31.545 5.407-58.342 4.004-63.411 32.241-4.135 23.03-4.319 39.452-26.287 44.258-22.087 4.832-34.925-23.43-57.081-44.258-17.725-16.662-47.577 5.02-58.593 11.962-19.528 12.083-63.92-14.28-83.158-35.002-27.47-29.59-63.595-32.296-90.879 0-27.283 32.296-54.345 5.818-88.331 23.04-33.985 17.223-37.706 57.248-78.451 45.433Z'
    />
    <defs>
      <linearGradient
        id='a'
        x1={316}
        x2={316}
        y1={-40}
        y2={129}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#BA93E1' stopOpacity={0.5} />
        <stop offset={1} stopColor='#BA93E1' stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);

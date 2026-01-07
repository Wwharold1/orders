import * as React from 'react';
import { SVGProps } from 'react';

export const IconInvestmentProcess = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={120}
    height={120}
    fill='none'
    {...props}
  >
    <g clipPath='url(#a)'>
      <path
        fill='#CF70AF'
        d='M55 110c30.376 0 55-24.624 55-55S85.376 0 55 0 0 24.624 0 55s24.624 55 55 55Z'
      />
      <path
        fill='#fff'
        d='M55 95c22.091 0 40-17.909 40-40S77.091 15 55 15 15 32.909 15 55s17.909 40 40 40Z'
      />
      <path
        fill='#CF70AF'
        d='M55 80c13.807 0 25-11.193 25-25S68.807 30 55 30 30 41.193 30 55s11.193 25 25 25Z'
      />
      <path fill='#56B2BD' d='m120 95-15-15H80v25l15 15 25-25Z' />
      <path
        fill='#018786'
        d='m58.527 51.447-7.071 7.072 59.998 59.998 7.071-7.072-59.998-59.997Z'
      />
      <path fill='#56B2BD' d='m70 50-25-5 5 25 20-20Z' />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M0 0h120v120H0z' />
      </clipPath>
    </defs>
  </svg>
);

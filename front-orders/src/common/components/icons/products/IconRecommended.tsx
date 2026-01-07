import * as React from 'react';
import { SVGProps } from 'react';

export const IconRecommended = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='100%'
    height='100%'
    fill='none'
    {...props}
  >
    <g clipPath='url(#a)'>
      <rect width='100%' height='100%' fill='#075D8F' rx={8} />
      <g filter='url(#b)'>
        <circle cx={223} cy={292} r={60} fill='#007BC3' />
      </g>
      <g filter='url(#c)'>
        <circle cx={343} cy={12} r={60} fill='#007BC3' />
      </g>
      <g filter='url(#d)'>
        <circle cx={23} cy={92} r={60} fill='#007BC3' />
      </g>
    </g>
    <defs>
      <filter
        id='b'
        width={280}
        height={280}
        x={83}
        y={152}
        colorInterpolationFilters='sRGB'
        filterUnits='userSpaceOnUse'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur
          result='effect1_foregroundBlur_1307_592'
          stdDeviation={40}
        />
      </filter>
      <filter
        id='c'
        width={280}
        height={280}
        x={203}
        y={-128}
        colorInterpolationFilters='sRGB'
        filterUnits='userSpaceOnUse'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur
          result='effect1_foregroundBlur_1307_592'
          stdDeviation={40}
        />
      </filter>
      <filter
        id='d'
        width={280}
        height={280}
        x={-117}
        y={-48}
        colorInterpolationFilters='sRGB'
        filterUnits='userSpaceOnUse'
      >
        <feFlood floodOpacity={0} result='BackgroundImageFix' />
        <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
        <feGaussianBlur
          result='effect1_foregroundBlur_1307_592'
          stdDeviation={40}
        />
      </filter>
      <clipPath id='a'>
        <rect width='100%' height='100%' fill='#fff' rx={8} />
      </clipPath>
    </defs>
  </svg>
);

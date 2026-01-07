import localFont from 'next/font/local';

export const prudentialModern = localFont({
  src: [
    {
      path: '../../../public/fonts/PrudentialModern-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/PrudentialModern-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/PrudentialModern-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-prudential-modern',
});

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CONTACT_NUMBER = '51908911551';

export const WhatsappButton = () => (
  <Link
    aria-label='Chat on Whatsapp'
    href={``}
    className='fixed bottom-2 right-5 z-50 rounded-full bg-green-500 p-2 text-white shadow transition-all duration-300 hover:scale-105 hover:bg-green-700'
    target='_blank'
  >
    <Image
      src='/images/whatsappLogo.svg'
      alt='whatsapp logo'
      width='40'
      height='40'
    />
  </Link>
);

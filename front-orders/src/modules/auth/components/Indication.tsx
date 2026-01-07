import Image from 'next/image';
import React from 'react';

interface IProps {
  isBoolean: boolean | null;
  name: string;
}

const Indication = ({ isBoolean, name }: IProps) => {
  return (
    <>
      <div className='flex items-center gap-2 '>
        <Image
          src={
            isBoolean ? '/icons/check_success.svg' : '/icons/check_error.svg'
          }
          alt='check'
          width={20}
          height={20}
        />
        <p className='font-medium'>{name}</p>
      </div>
    </>
  );
};

export default Indication;

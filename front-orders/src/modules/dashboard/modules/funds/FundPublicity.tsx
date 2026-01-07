/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { useEffect } from 'react';

import { DocumentTagEnum } from '@/common/enums/document-tag.enum';
import { useAppSelector } from '@/common/hooks';
import { FundsService } from '@/services';

export const FundPublicity = () => {
  const { currentFund } = useAppSelector((state) => state.subscription);
  const [imagePublicity, setImagePublicity] = React.useState<string | null>(
    null
  );
  useEffect(() => {
    FundsService()
      .getFilesByTag({
        fund_id: currentFund!.id,
        document_tag: DocumentTagEnum.PUBLICITY_FUND,
      })
      .then((response: any) => {
        setImagePublicity(response.constancy_url);
      });
  }, []);

  return (
    <>
      <div
        className='h-full w-full rounded-lg bg-white pb-2'
        style={{ maxHeight: '1600px' }}
      >
        <div className='h-full border-b border-neutral-50 px-6 py-8 pb-7'>
          {imagePublicity && (
            <img
              src={imagePublicity!}
              alt='imagePublicity'
              loading='eager'
              className='h-full w-full object-cover'
            />
          )}
        </div>
      </div>
    </>
  );
};

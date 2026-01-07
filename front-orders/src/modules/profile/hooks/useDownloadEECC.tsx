/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { MdDescription } from 'react-icons/md';

import { notifyError } from '@/common/components';
import { SpectrumDocumentType } from '@/common/enums';
import {
  useAppDispatch,
  useAppSelector,
  useStateCallback,
} from '@/common/hooks';
import { IFundSearchProduct, IFundSearchUser } from '@/common/interfaces';
import {
  downloadEECCValidationSchema,
  TDownloadEECCForm,
} from '@/modules/profile/helpers/downloadValidationSchemas';
import { FundsService } from '@/services';

export const useDownloadEECC = (enabled = true) => {
  const controller = new AbortController();
  const currentUser = useAppSelector((state) => state.session.currentUser);
  const dispatch = useAppDispatch();
  const [isSuccessDownload, setIsSuccessDownload] = useStateCallback(false);
  const currentUserFinded: IFundSearchUser = {
    numIdentidad: currentUser?.number_document as string,
    tipoIdentidad:
      SpectrumDocumentType[
        currentUser?.document_type as keyof typeof SpectrumDocumentType
      ],
  };

  const downloadEECCForm = useForm<TDownloadEECCForm>({
    resolver: zodResolver(downloadEECCValidationSchema),
  });

  const fundByUserQuery = useQuery(
    ['fund-by-user'],
    () => {
      return dispatch(FundsService(controller).fundByUser());
    },
    {
      enabled,
    }
  );

  const downloadFundMutation = useMutation(
    ['download-eecc'],
    (fundSearch: IFundSearchProduct) =>
      FundsService(controller).downloadEECC({
        searchUser: currentUserFinded,
        searchFund: fundSearch,
      }),
    {
      onSuccess: (res) => {
        if (new Blob([res], { type: 'application/pdf' }).size >= 1000) {
          const url = window.URL.createObjectURL(
            new Blob([res], { type: 'application/pdf' })
          );
          window.open(url);
          setIsSuccessDownload(true);
        } else {
          notifyError({
            title: 'Estado de cuenta no disponible',
            subtitle: 'Por favor, inténtalo en otro momento.',
            Icon: MdDescription,
          });
          setIsSuccessDownload(false);
        }
      },
    }
  );

  return {
    mutations: {
      downloadFundMutation,
    },
    forms: {
      downloadEECCForm,
    },
    queries: {
      fundByUserQuery,
    },
    state: {
      controller,
      setIsSuccessDownload,
      isSuccessDownload,
    },
  };
};

import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { OriginTypeEnum } from '@/common/enums';
import {
  ISearchCollaborator,
  ISearchCollaboratorResponse,
} from '@/common/interfaces/auth.interface';
import { spectrumApiUrl } from '@/common/utils/axios';

export const SpectrumService = () => {
  const searchCollaborator = createAsyncThunk(
    'spectrum/search-collaborator',
    async (values: ISearchCollaborator) => {
      try {
        return (
          await spectrumApiUrl.get<ISearchCollaboratorResponse>(
            `/search-collaborator-app?numIdentidad=${values.numIdentidad}&tipoIdentidad=${values.tipoIdentidad}&origin=${OriginTypeEnum.APP}`,
            {
              headers: {
                'x-platform-request': 'WEB',
              },
            }
          )
        ).data;
      } catch (error) {
        if (isAxiosError(error)) {
          return error.response?.data;
        }
      }
    }
  );

  return {
    searchCollaborator,
  };
};

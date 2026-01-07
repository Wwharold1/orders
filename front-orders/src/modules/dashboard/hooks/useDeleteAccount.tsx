import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { ICanDelete, IRequestDelete } from '@/common/interfaces';
import { ProfileService } from '@/services/ProfileService';

export const useDeleteAccount = () => {
  const [modalState, setModalState] = useState({
    openAskDeleteAccount: false,
    openDeleteTermsConditions: false,
    openSuccessDeleteAccount: false,
    openErrorDeleteAccount: false,
    openDeleteAlreadySended: false,
  });

  const canDeleteQuery = useQuery<{ data: ICanDelete }>({
    queryKey: ['getCanDelete'],
    queryFn: ProfileService().getCanDelete,
    enabled: false,
  });

  const canDeleteMutation = useMutation<{ data: ICanDelete }>({
    mutationFn: ProfileService().getCanDelete,
    onSuccess: ({ data }) => {
      const modalChoosed = getDeleteScenario(data);
      handleModalToggle(modalChoosed, true);
    },
    onError: () => {
      handleModalToggle('openErrorDeleteAccount', true);
    },
  });

  const requestDeleteMutation = useMutation<{
    data: IRequestDelete;
  }>({
    mutationFn: ProfileService().requestDelete,
    onSuccess: ({ data }) => {
      setModalState((prev) => ({
        ...prev,
        openAskDeleteAccount: false,
        [data.status ? 'openSuccessDeleteAccount' : 'openErrorDeleteAccount']:
          true,
      }));
    },
    onError: () => {
      setModalState((prev) => ({
        ...prev,
        openAskDeleteAccount: false,
        openErrorDeleteAccount: true,
      }));
    },
  });

  const getDeleteScenario = (canDelete: ICanDelete) => {
    const { canBeDeleted, requestDate } = canDelete;
    if (canBeDeleted) {
      return 'openAskDeleteAccount';
    }
    if (requestDate) {
      return 'openDeleteAlreadySended';
    }
    return 'openDeleteTermsConditions';
  };

  const handleModalToggle = (modalName: string, value: boolean) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalName]: value,
    }));
  };

  return {
    queries: {
      canDeleteQuery,
    },
    mutations: {
      canDeleteMutation,
      requestDeleteMutation,
    },
    modal: {
      modalState,
    },
    handlers: {
      handleModalToggle,
    },
  };
};

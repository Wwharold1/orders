import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { notifyError } from '@/common/components';
import {
  ContextSplashEnum,
  CreateRescueErrorsDictionary,
} from '@/common/enums';
import { useAppDispatch } from '@/common/hooks';
import { RescueTypeEnum } from '@/common/interfaces/rescue.interface';
import {
  createRescueValidationSchema,
  TCreateRescueForm,
} from '@/modules/rescue/helpers/rescueValidationSchemas';
import {
  setCurrentMoneyType,
  setCurrentRescue,
  setRescueDetail,
} from '@/modules/rescue/slice/rescueSlice';
import { setSplash } from '@/redux/common/layoutSlice';
import { RescueService } from '@/services/RescueService';

export const useRescue = () => {
  const dispatch = useAppDispatch();
  const createRescueForm = useForm<TCreateRescueForm>({
    resolver: zodResolver(createRescueValidationSchema),
    defaultValues: {
      rescue_type: RescueTypeEnum.TOTAL,
    },
  });

  const rescueMutation = useMutation((rescue: TCreateRescueForm) =>
    RescueService().createRescue(rescue)
  );

  const submitRescue = (values: TCreateRescueForm) => {
    rescueMutation.mutate(values, {
      onSuccess: (res) => {
        if (
          res.message === CreateRescueErrorsDictionary.ONLY_ONE_RESCUE_PER_DAY
        ) {
          notifyError({
            title:
              'Lo sentimos, no puede realizar un nuevo rescate en menos de 24 horas.',
          });
          return;
        }
        if (res.message.includes(CreateRescueErrorsDictionary.MINIMUN_AMOUNT)) {
          notifyError({
            title:
              'El monto mínimo para rescatar es de: ' +
              res.message.split(' ')[res.message.split(' ').length - 1],
          });
          return;
        }
        if (
          res.message.includes(
            CreateRescueErrorsDictionary.MINIMUN_AMOUNT_PERMANENCE
          )
        ) {
          notifyError({
            title:
              'El monto mínimo para rescatar es de: ' +
              res.message.split(' ')[res.message.split(' ').length - 1],
          });
          return;
        }
        if (!res.data) {
          if (res.message) {
            notifyError({
              title: res.message,
            });
            return;
          }
        }
        createRescueForm.reset();
        dispatch(setRescueDetail(null));
        dispatch(setCurrentRescue(null));
        dispatch(setCurrentMoneyType(null));
        dispatch(
          setSplash({
            type: ContextSplashEnum.RESCUE_CREATED,
            show: true,
          })
        );
      },
    });
  };

  return {
    forms: {
      createRescueForm,
    },
    mutations: {
      rescueMutation,
    },
    submitHandlers: {
      submitRescue,
    },
  };
};

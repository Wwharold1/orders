import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Modal } from '@/common/components';
import { IconDanger } from '@/common/components/icons/utils/IconDanger';
import { ContextRoutesEnum, MediaQueryEnum } from '@/common/enums';
import { useStateCallback } from '@/common/hooks';
import useMediaQuery from '@/common/hooks/useMediaQuery';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { useInvestment } from '@/modules/dashboard/hooks/useInvestment';
import { IdentityValidation } from '@/modules/dashboard/modules/subscription/components/natural-client/IdentityValidation';

interface IProps {
  mode: 'subscription' | 'rescue';
}

export const BiometricValidation: FC<IProps> = ({ mode }) => {
  const [openModalCancel, setOpenModalCancel] =
    useStateCallback<boolean>(false);
  const router = useRouter();
  const isMdDown = useMediaQuery(MediaQueryEnum.MD);
  const isSubscription = mode === 'subscription';
  const routeBack = isSubscription
    ? () => setOpenModalCancel(true)
    : () => router.back();
  const { clearInvestmentFormData } = useInvestment();

  return (
    <div className='relative h-full w-full bg-neutral-50'>
      <DashboardLayout routeBack={routeBack}>
        <div className='relative rounded-lg bg-white px-6 shadow-md'>
          <IdentityValidation
            setOpenModalCancel={setOpenModalCancel}
            subscription={isSubscription}
            rescue={mode === 'rescue'}
            finalBeneficiary={false}
          />
        </div>
        <Modal
          isOpen={openModalCancel}
          title={`¿Seguro que deseas cancelar tu ${
            isSubscription ? 'suscripción' : 'solicitud de rescate'
          }?`}
          setIsOpen={setOpenModalCancel}
          customIcon={<IconDanger className='mb-1' />}
          confirmationText={`Cancelar ${
            isSubscription ? 'suscripción' : 'solicitud'
          }`}
          confirmationCustomFunction={() => {
            clearInvestmentFormData();
            router.push(ContextRoutesEnum.DASHBOARD);
          }}
          extended={isMdDown}
          secondaryConfirmationText='Volver al formulario'
        >
          <span className='text-neutral-600'>
            Si cancelas el proceso ahora, tu información no se guardará.
          </span>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

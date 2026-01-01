import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { Component } from 'solid-js';

type PremiumFeatureModalProps = {
  ref: HTMLDialogElement;
  text?: string;
};

export const PremiumFeatureModal: Component<PremiumFeatureModalProps> = props => {
  const t = useTranslate();

  const handleUpgradeClick = () => {
    const upgradeUrl = `${import.meta.env.VITE_APP_URL}/dashboard/user/subscription`;

    window.app.openUrl(upgradeUrl);
  };

  return (
    <Modal
      buttons={[
        {
          children: t('upgrade'),
          onClick: handleUpgradeClick,
          variant: 'primary',
        },
        { children: t('close'), autofocus: true },
      ]}
      heading={t('premiumFeatureModalHeading')}
      ref={props.ref}
    >
      <p>{props.text ?? t('premiumFeatureModalText')}</p>
    </Modal>
  );
};

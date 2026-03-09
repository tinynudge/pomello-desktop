import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { Component, Show } from 'solid-js';

export const PremiumFeatureModal: Component = () => {
  const { getPremiumFeatureModal, onPremiumFeatureModalClose } = useDashboard();
  const t = useTranslate();

  const handleUpgradeClick = () => {
    const upgradeUrl = `${import.meta.env.VITE_APP_URL}/dashboard/user/subscription`;

    window.app.openUrl(upgradeUrl);
  };

  return (
    <Show when={getPremiumFeatureModal()}>
      {getCustomText => {
        let text = getCustomText();

        if (typeof text !== 'string') {
          text = t('premiumFeatureModalText');
        }

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
            onHide={onPremiumFeatureModalClose}
            showOnMount
          >
            <p>{text}</p>
          </Modal>
        );
      }}
    </Show>
  );
};

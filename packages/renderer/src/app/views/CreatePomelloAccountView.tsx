import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { ButtonsOverlay } from '@/ui/app/ButtonsOverlay';
import { Component } from 'solid-js';

export const CreatePomelloAccountView: Component = () => {
  const config = usePomelloConfig();
  const t = useTranslate();

  const handleConfirmClick = () => {
    window.app.showAuthWindow({ type: 'pomello', action: 'register' });

    config.actions.registrationPromptHandled();
  };

  const handleSkipClick = () => {
    config.actions.registrationPromptHandled();
  };

  return (
    <ButtonsOverlay
      buttons={[
        { content: t('createPomelloAccountConfirm'), onClick: handleConfirmClick },
        { content: t('createPomelloAccountSkip'), onClick: handleSkipClick },
      ]}
    >
      {t('createPomelloAccountHeading')}
    </ButtonsOverlay>
  );
};

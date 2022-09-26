import ButtonsOverlay from '@/app/ui/ButtonsOverlay';
import usePomelloConfigUpdater from '@/shared/hooks/usePomelloConfigUpdater';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';

const CreatePomelloAccountView: FC = () => {
  const { t } = useTranslation();

  const [setPomelloConfig] = usePomelloConfigUpdater();

  const handleConfirmClick = () => {
    window.app.showAuthWindow();

    setPomelloConfig('didPromptRegistration', true);
  };

  const handleSkipClick = () => {
    setPomelloConfig('didPromptRegistration', true);
  };

  return (
    <ButtonsOverlay
      buttons={[
        { id: 'create', content: t('createPomelloAccountConfirm'), onClick: handleConfirmClick },
        { id: 'skip', content: t('createPomelloAccountSkip'), onClick: handleSkipClick },
      ]}
    >
      {t('createPomelloAccountHeading')}
    </ButtonsOverlay>
  );
};

export default CreatePomelloAccountView;

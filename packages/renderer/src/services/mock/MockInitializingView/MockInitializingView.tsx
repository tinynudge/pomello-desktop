import useTranslation from '@/shared/hooks/useTranslation';
import { InitializingView } from '@domain';
import { useEffect } from 'react';

const MockInitializingView: InitializingView = ({ onReady }) => {
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      onReady();
    }, 300);
  }, [onReady]);

  return <>{t('waitMessage')}</>;
};

export default MockInitializingView;

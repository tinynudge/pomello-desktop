import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';

const LoadingText: FC = () => {
  const { t } = useTranslation();

  return <>{t('waitMessage')}</>;
};

export default LoadingText;

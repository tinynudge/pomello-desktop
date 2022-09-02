import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';
import styles from './LoadingText.module.scss';

const LoadingText: FC = () => {
  const { t } = useTranslation();

  return <div className={styles.loadingText}>{t('waitMessage')}</div>;
};

export default LoadingText;

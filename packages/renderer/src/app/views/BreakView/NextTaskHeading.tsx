import useCurrentTask from '@/app/hooks/useCurrentTask';
import Heading from '@/app/ui/Heading';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';

const NextTaskHeading: FC = () => {
  const { t } = useTranslation();

  const { currentTaskLabel } = useCurrentTask();

  return <Heading>{t('nextTaskHeading', { task: currentTaskLabel })}</Heading>;
};

export default NextTaskHeading;

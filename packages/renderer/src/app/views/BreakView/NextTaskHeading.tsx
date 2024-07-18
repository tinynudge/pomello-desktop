import { useCurrentTask } from '@/app/hooks/useCurrentTask';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Heading } from '@/ui/app/Heading';
import { Component } from 'solid-js';

export const NextTaskHeading: Component = () => {
  const t = useTranslate();
  const currentTask = useCurrentTask();

  return <Heading>{t('nextTaskHeading', { task: currentTask().label })}</Heading>;
};

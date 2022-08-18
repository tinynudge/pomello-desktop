import useCurrentTask from '@/app/hooks/useCurrentTask';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect, useMemo } from 'react';

const TaskCompleteView: FC = () => {
  const { t } = useTranslation();

  const { getCompleteTaskOptions, onTaskCompletePromptHandled } = useService();

  const { taskCompleteHandled } = usePomelloActions();

  const { currentTask, currentTaskLabel } = useCurrentTask();

  const options = useMemo(
    () => getCompleteTaskOptions?.(currentTask.id),
    [currentTask.id, getCompleteTaskOptions]
  );

  useEffect(() => {
    if (!getCompleteTaskOptions || !options) {
      taskCompleteHandled();
    }
  }, [getCompleteTaskOptions, options, taskCompleteHandled]);

  const handleOptionSelect = (optionId: string) => {
    onTaskCompletePromptHandled?.(currentTask.id, optionId);

    taskCompleteHandled();
  };

  if (!options) {
    return null;
  }

  return (
    <>
      <Heading>{currentTaskLabel}</Heading>
      <SelectField
        items={options}
        onChange={handleOptionSelect}
        placeholder={t('taskCompletePlaceholder')}
      />
    </>
  );
};

export default TaskCompleteView;

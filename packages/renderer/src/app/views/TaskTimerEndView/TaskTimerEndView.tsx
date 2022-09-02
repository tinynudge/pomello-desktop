import DialLayout from '@/app/components/DialLayout';
import useCurrentTask from '@/app/hooks/useCurrentTask';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useShowAddNoteView from '@/app/hooks/useShowAddNoteView';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';

const TaskTimerEndView: FC = () => {
  const { t } = useTranslation();
  const { getTaskTimerEndOptions, onTaskTimerEndPromptHandled } = useService();
  const { taskTimerEndPromptHandled } = usePomelloActions();

  const { currentTask, currentTaskLabel } = useCurrentTask();

  const showAddNoteView = useShowAddNoteView();

  const { registerHotkeys } = useHotkeys();
  useEffect(() => {
    return registerHotkeys({
      addNote: () => showAddNoteView('generalNote'),
      continueTask: () => taskTimerEndPromptHandled('continueTask'),
      voidTask: () => taskTimerEndPromptHandled('voidTask'),
    });
  }, [registerHotkeys, showAddNoteView, taskTimerEndPromptHandled]);

  const handleActionSelect = (id: string) => {
    if (id === 'continueTask' || id === 'switchTask' || id === 'voidTask') {
      taskTimerEndPromptHandled(id);
    } else if (id === 'addNote') {
      showAddNoteView('generalNote');
    } else {
      const response = onTaskTimerEndPromptHandled?.(currentTask, id);

      if (response) {
        taskTimerEndPromptHandled(response);
      }
    }
  };

  const items = [
    { id: 'continueTask', label: t('taskTimerEndContinue') },
    { id: 'switchTask', label: t('taskTimerEndSwitch') },
    { id: 'voidTask', label: t('taskTimerEndVoid') },
    { id: 'addNote', label: t('taskTimerEndAddNote') },
    ...(getTaskTimerEndOptions ? getTaskTimerEndOptions() : []),
  ];

  return (
    <DialLayout>
      <Heading>{currentTaskLabel}</Heading>
      <SelectField
        items={items}
        onChange={handleActionSelect}
        placeholder={t('taskTimerEndPlaceholder')}
      />
    </DialLayout>
  );
};

export default TaskTimerEndView;

import { selectPomelloState } from '@/app/appSlice';
import getTasksCacheKey from '@/app/helpers/getTasksCacheKey';
import useDialActions from '@/app/hooks/useDialActions';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePauseDialAction from '@/app/hooks/usePauseDialAction';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import Heading from '@/app/ui/Heading';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectOptionType } from '@domain';
import { FC, useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as CheckIcon } from './assets/check.svg';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { ReactComponent as PencilIcon } from './assets/pencil.svg';
import { ReactComponent as SwitchIcon } from './assets/switch.svg';

interface TaskViewProps {
  getTaskHeading?(): string;
  getTaskLabel?(task: SelectOptionType): string;
  serviceId: string;
}

const TaskView: FC<TaskViewProps> = ({ getTaskHeading, getTaskLabel, serviceId }) => {
  const { t } = useTranslation();

  const { completeTask, switchTask, voidTask } = usePomelloActions();

  const { registerHotkeys } = useHotkeys();

  useEffect(() => {
    return registerHotkeys({
      completeTaskEarly: completeTask,
      switchTask,
      voidTask,
    });
  }, [completeTask, registerHotkeys, switchTask, voidTask]);

  const { registerDialActions } = useDialActions();
  const pauseDialAction = usePauseDialAction();

  useEffect(() => {
    return registerDialActions([
      pauseDialAction,
      {
        Content: <PencilIcon width={12} />,
        id: 'addNote',
        label: t('addNoteLabel'),
        onClick: () => null,
      },
      {
        Content: <SwitchIcon width={16} />,
        id: 'switchTask',
        label: t('switchTaskLabel'),
        onClick: switchTask,
      },
      {
        Content: <CloseIcon width={10} />,
        id: 'voidTask',
        label: t('voidTaskLabel'),
        onClick: voidTask,
      },
      {
        Content: <CheckIcon width={13} />,
        id: 'completeTask',
        label: t('completeTaskLabel'),
        onClick: completeTask,
      },
    ]);
  }, [completeTask, pauseDialAction, registerDialActions, switchTask, t, voidTask]);

  const queryClient = useQueryClient();
  const tasks = queryClient.getQueryData<SelectOptionType[]>(getTasksCacheKey(serviceId));

  const { currentTaskId } = useSelector(selectPomelloState);

  const currentTask = useMemo(() => {
    if (tasks) {
      return tasks.find(item => item.id === currentTaskId);
    }
  }, [tasks, currentTaskId]);

  if (!currentTask) {
    throw new Error(`Unable to find task with id "${currentTask}"`);
  }

  return (
    <>
      {getTaskHeading && <Heading>{getTaskHeading()}</Heading>}
      <p>{getTaskLabel?.(currentTask) ?? currentTask.label}</p>
    </>
  );
};

export default TaskView;

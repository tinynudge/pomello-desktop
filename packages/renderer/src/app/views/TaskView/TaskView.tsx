import { selectPomelloState } from '@/app/appSlice';
import useDialActions from '@/app/hooks/useDialActions';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as CheckIcon } from './assets/check.svg';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { ReactComponent as PauseIcon } from './assets/pause.svg';
import { ReactComponent as PencilIcon } from './assets/pencil.svg';
import { ReactComponent as SwitchIcon } from './assets/switch.svg';

const TaskView: FC = () => {
  const { t } = useTranslation();

  const { completeTask, pauseTimer, switchTask, voidTask } = usePomelloActions();

  const { setDialActions, unsetDialActions } = useDialActions();

  useEffect(() => {
    setDialActions([
      {
        Content: <PauseIcon width={6} />,
        id: 'pauseTimer',
        label: t('pauseTimerLabel'),
        onClick: pauseTimer,
      },
      {
        Content: <PencilIcon width={12} />,
        id: 'addNote',
        label: t('addNoteLabel'),
        onClick: pauseTimer,
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

    return () => {
      unsetDialActions();
    };
  }, [completeTask, pauseTimer, setDialActions, switchTask, t, unsetDialActions, voidTask]);

  const { currentTaskId } = useSelector(selectPomelloState);

  return <div>Task: {currentTaskId}</div>;
};

export default TaskView;

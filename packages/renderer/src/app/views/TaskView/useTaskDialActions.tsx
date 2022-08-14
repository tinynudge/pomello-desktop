import useDialActions from '@/app/hooks/useDialActions';
import usePauseDialAction from '@/app/hooks/usePauseDialAction';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTranslation from '@/shared/hooks/useTranslation';
import { NoteType } from '@domain';
import { useEffect } from 'react';
import { ReactComponent as CheckIcon } from './assets/check.svg';
import { ReactComponent as CloseIcon } from './assets/close.svg';
import { ReactComponent as PencilIcon } from './assets/pencil.svg';
import { ReactComponent as SwitchIcon } from './assets/switch.svg';

interface UseTaskDialActionsOptions {
  showAddNoteView(type: NoteType): void;
}

const useTaskDialActions = ({ showAddNoteView }: UseTaskDialActionsOptions): void => {
  const { t } = useTranslation();

  const { completeTask, switchTask, voidTask } = usePomelloActions();

  const { registerDialActions } = useDialActions();
  const pauseDialAction = usePauseDialAction();

  useEffect(() => {
    return registerDialActions([
      pauseDialAction,
      {
        Content: <PencilIcon width={12} />,
        id: 'addNote',
        label: t('addNoteLabel'),
        onClick: () => showAddNoteView('generalNote'),
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
  }, [
    completeTask,
    pauseDialAction,
    registerDialActions,
    showAddNoteView,
    switchTask,
    t,
    voidTask,
  ]);
};

export default useTaskDialActions;

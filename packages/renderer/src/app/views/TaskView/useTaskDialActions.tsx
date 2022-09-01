import useDialActions from '@/app/hooks/useDialActions';
import useHotkeys from '@/app/hooks/useHotkeys';
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

  const { getHotkeyLabel } = useHotkeys();

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
        title: t('addNoteTitle', { hotkey: getHotkeyLabel('addNote') }),
      },
      {
        Content: <SwitchIcon width={16} />,
        id: 'switchTask',
        label: t('switchTaskLabel'),
        onClick: switchTask,
        title: t('switchTaskTitle', { hotkey: getHotkeyLabel('switchTask') }),
      },
      {
        Content: <CloseIcon width={10} />,
        id: 'voidTask',
        label: t('voidTaskLabel'),
        onClick: voidTask,
        title: t('voidTaskTitle', { hotkey: getHotkeyLabel('voidTask') }),
      },
      {
        Content: <CheckIcon width={13} />,
        id: 'completeTask',
        label: t('completeTaskLabel'),
        onClick: completeTask,
        title: t('completeTaskTitle', { hotkey: getHotkeyLabel('completeTaskEarly') }),
      },
    ]);
  }, [
    completeTask,
    getHotkeyLabel,
    pauseDialAction,
    registerDialActions,
    showAddNoteView,
    switchTask,
    t,
    voidTask,
  ]);
};

export default useTaskDialActions;

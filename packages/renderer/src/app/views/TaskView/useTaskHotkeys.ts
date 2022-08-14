import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import { NoteType } from '@domain';
import { useEffect } from 'react';

interface UseTaskHotkeysOptions {
  showAddNoteView(type: NoteType): void;
}

const useTaskHotkeys = ({ showAddNoteView }: UseTaskHotkeysOptions): void => {
  const { completeTask, switchTask, voidTask } = usePomelloActions();

  const { registerHotkeys } = useHotkeys();

  useEffect(() => {
    return registerHotkeys({
      addNote: () => showAddNoteView('generalNote'),
      completeTaskEarly: completeTask,
      externalDistraction: () => showAddNoteView('externalDistraction'),
      internalDistraction: () => showAddNoteView('internalDistraction'),
      switchTask,
      voidTask,
    });
  }, [completeTask, registerHotkeys, showAddNoteView, switchTask, voidTask]);
};

export default useTaskHotkeys;

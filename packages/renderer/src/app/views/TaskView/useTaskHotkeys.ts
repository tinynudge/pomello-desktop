import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import { useEffect } from 'react';

const useTaskHotkeys = (): void => {
  const { completeTask, switchTask, voidTask } = usePomelloActions();

  const { registerHotkeys } = useHotkeys();

  useEffect(() => {
    return registerHotkeys({
      completeTaskEarly: completeTask,
      switchTask,
      voidTask,
    });
  }, [completeTask, registerHotkeys, switchTask, voidTask]);
};

export default useTaskHotkeys;

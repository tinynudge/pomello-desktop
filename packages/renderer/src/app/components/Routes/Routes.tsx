import { quickTaskSelectEnabled, selectPomelloStatus } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import BreakView from '@/app/views/BreakView';
import CreatePomelloAccountView from '@/app/views/CreatePomelloAccountView';
import SelectTaskView from '@/app/views/SelectTaskView';
import TaskCompleteView from '@/app/views/TaskCompleteView';
import TaskTimerEndView from '@/app/views/TaskTimerEndView';
import TaskView from '@/app/views/TaskView';
import TaskVoidView from '@/app/views/TaskVoidView';
import { usePomelloConfigSelector } from '@/shared/hooks/usePomelloConfig';
import useService from '@/shared/hooks/useService';
import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectPromptCreatePomelloAccount from './selectPromptCreatePomelloAccount';
import useTrackStats from './useTrackStats';

const Routes: FC = () => {
  const dispatch = useDispatch();
  const service = useService();

  useTrackStats();

  const { setReady } = usePomelloActions();

  const promptCreatePomelloAccount = usePomelloConfigSelector(selectPromptCreatePomelloAccount);

  const status = useSelector(selectPomelloStatus);

  const handleServiceReady = useCallback(
    (options: { openTaskSelect?: boolean } = {}) => {
      if (options.openTaskSelect) {
        dispatch(quickTaskSelectEnabled());
      }

      setReady();
    },
    [dispatch, setReady]
  );

  if (status === 'INITIALIZING') {
    if (service.InitializingView) {
      return <service.InitializingView onReady={handleServiceReady} />;
    } else {
      setReady();
      return null;
    }
  }

  if (promptCreatePomelloAccount) {
    return <CreatePomelloAccountView />;
  }

  if (status === 'SELECT_TASK') {
    return <SelectTaskView />;
  }

  if (status === 'TASK') {
    return <TaskView />;
  }

  if (status === 'TASK_TIMER_END_PROMPT') {
    return <TaskTimerEndView />;
  }

  if (status === 'TASK_COMPLETE_PROMPT') {
    return <TaskCompleteView />;
  }

  if (status === 'TASK_VOID_PROMPT') {
    return <TaskVoidView />;
  }

  if (status === 'SHORT_BREAK' || status === 'LONG_BREAK') {
    return <BreakView type={status} />;
  }

  return null;
};

export default Routes;

import { selectPomelloStatus } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import BreakView from '@/app/views/BreakView';
import CreatePomelloAccountView from '@/app/views/CreatePomelloAccountView';
import SelectTaskView from '@/app/views/SelectTaskView';
import TaskCompleteView from '@/app/views/TaskCompleteView';
import TaskTimerEndView from '@/app/views/TaskTimerEndView';
import TaskView from '@/app/views/TaskView';
import TaskVoidView from '@/app/views/TaskVoidView';
import usePomelloConfigSelector from '@/shared/hooks/usePomelloConfigSelector';
import useService from '@/shared/hooks/useService';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import selectPromptCreatePomelloAccount from './selectPromptCreatePomelloAccount';

const Routes: FC = () => {
  const service = useService();

  const actions = usePomelloActions();

  const promptCreatePomelloAccount = usePomelloConfigSelector(selectPromptCreatePomelloAccount);

  const status = useSelector(selectPomelloStatus);

  if (status === 'INITIALIZING') {
    if (service.InitializingView) {
      return <service.InitializingView onReady={actions.setReady} />;
    } else {
      actions.setReady();
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

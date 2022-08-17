import { selectPomelloState } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import BreakView from '@/app/views/BreakView';
import SelectTaskView from '@/app/views/SelectTaskView';
import TaskTimerEndView from '@/app/views/TaskTimerEndView';
import TaskView from '@/app/views/TaskView';
import TaskVoidView from '@/app/views/TaskVoidView';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, Suspense } from 'react';
import { useSelector } from 'react-redux';

const Routes: FC = () => {
  const service = useService();
  const { t } = useTranslation();

  const actions = usePomelloActions();

  const { status } = useSelector(selectPomelloState);

  if (status === 'INITIALIZING') {
    return <service.InitializingView onReady={actions.setReady} />;
  }

  if (status === 'SELECT_TASK') {
    return (
      <Suspense fallback={t('waitMessage')}>
        <SelectTaskView />
      </Suspense>
    );
  }

  if (status === 'TASK') {
    return <TaskView />;
  }

  if (status === 'TASK_TIMER_END_PROMPT') {
    return <TaskTimerEndView />;
  }

  if (status === 'TASK_COMPLETE_PROMPT') {
    // if we have getTaskCompleteOptions then render that
    return <div>task complete prompt</div>;
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

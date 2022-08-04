import { selectPomelloState } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import SelectTaskView from '@/app/views/SelectTaskView';
import TaskTimerEndView from '@/app/views/TaskTimerEndView';
import TaskView from '@/app/views/TaskView';
import useTranslation from '@/shared/hooks/useTranslation';
import { Service } from '@domain';
import { FC, Suspense } from 'react';
import { useSelector } from 'react-redux';

interface RouteProps {
  service: Service;
}

const Routes: FC<RouteProps> = ({ service }) => {
  const { t } = useTranslation();

  const actions = usePomelloActions();

  const { status } = useSelector(selectPomelloState);

  if (status === 'INITIALIZING') {
    return <service.InitializingView onReady={actions.setReady} />;
  }

  if (status === 'SELECT_TASK') {
    return (
      <Suspense fallback={t('waitMessage')}>
        <SelectTaskView fetchTasks={service.fetchTasks} serviceId={service.id} />
      </Suspense>
    );
  }

  if (status === 'TASK') {
    return <TaskView />;
  }

  if (status === 'TASK_TIMER_END_PROMPT') {
    return (
      <TaskTimerEndView
        getCustomOptions={service.getTaskTimerEndOptions}
        onActionSelect={service.onTaskTimerEndPromptHandled}
      />
    );
  }

  if (status === 'TASK_COMPLETE_PROMPT') {
    // if we have getTaskCompleteOptions then render that
    return <div>task complete prompt</div>;
  }

  if (status === 'TASK_VOID_PROMPT') {
    // if we have getTaskVoidOptions then render that
    return <div>task void prompt!</div>;
  }

  if (status === 'SHORT_BREAK') {
    return <div>short break</div>;
  }

  if (status === 'LONG_BREAK') {
    return <div>long break</div>;
  }

  return null;
};

export default Routes;

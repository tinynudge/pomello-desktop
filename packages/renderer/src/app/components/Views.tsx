import { usePomelloActions } from '@/app/context/PomelloContext';
import { useStore, useStoreActions } from '@/app/context/StoreContext';
import { BreakView } from '@/app/views/BreakView';
import { CreatePomelloAccountView } from '@/app/views/CreatePomelloAccountView';
import { SelectTaskView } from '@/app/views/SelectTaskView';
import { TaskCompleteView } from '@/app/views/TaskCompleteView';
import { TaskTimerEndView } from '@/app/views/TaskTimerEndView';
import { TaskView } from '@/app/views/TaskView';
import { TaskVoidView } from '@/app/views/TaskVoidView';
import { usePomelloConfig } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { LoadingText } from '@/ui/app/LoadingText';
import { Match, Suspense, Switch, createEffect } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export const Views = () => {
  const { pomelloState } = useStore();
  const { quickTaskEnabled } = useStoreActions();
  const { setReady } = usePomelloActions();
  const getService = useService();
  const pomelloConfig = usePomelloConfig();

  const getBreakType = () =>
    pomelloState.status === 'SHORT_BREAK' || pomelloState.status === 'LONG_BREAK'
      ? pomelloState.status
      : false;

  const getDidPromptPomelloRegistration = () =>
    !pomelloConfig.store.token && pomelloConfig.store.didPromptRegistration !== true;

  createEffect(() => {
    if (pomelloState.status === 'INITIALIZING' && !getService().InitializingView) {
      setReady();
    }
  });

  const handleServiceReady = (options: { openTaskSelect?: boolean } = {}) => {
    if (options.openTaskSelect) {
      quickTaskEnabled();
    }

    setReady();
  };

  return (
    <Switch>
      <Match when={pomelloState.status === 'INITIALIZING' && getService().InitializingView}>
        <Dynamic component={getService().InitializingView} onReady={handleServiceReady} />
      </Match>
      <Match when={getDidPromptPomelloRegistration()}>
        <CreatePomelloAccountView />
      </Match>
      <Match when={pomelloState.status === 'SELECT_TASK'}>
        <Suspense fallback={<LoadingText />}>
          <SelectTaskView />
        </Suspense>
      </Match>
      <Match when={pomelloState.status === 'TASK'}>
        <TaskView />
      </Match>
      <Match when={pomelloState.status === 'TASK_TIMER_END_PROMPT'}>
        <TaskTimerEndView />
      </Match>
      <Match when={pomelloState.status === 'TASK_COMPLETE_PROMPT'}>
        <TaskCompleteView />
      </Match>
      <Match when={pomelloState.status === 'TASK_VOID_PROMPT'}>
        <TaskVoidView />
      </Match>
      <Match when={getBreakType()}>{type => <BreakView type={type()} />}</Match>
    </Switch>
  );
};

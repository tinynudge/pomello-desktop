import { usePomelloActions } from '@/app/context/PomelloContext';
import { useStore, useStoreActions } from '@/app/context/StoreContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Heading } from '@/ui/components/Heading';
import { SelectField } from '@/ui/components/SelectField';
import { createQuery } from '@tanstack/solid-query';
import { Component, Show, onMount } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { Dynamic } from 'solid-js/web';
import { useTasksCacheKey } from '../hooks/useTasksCacheKey';

export const SelectTaskView: Component = () => {
  const { dialActionsSet, quickTaskReset } = useStoreActions();
  const { selectTask } = usePomelloActions();
  const getService = useService();
  const getTasksCacheKey = useTasksCacheKey();
  const store = useStore();
  const t = useTranslate();

  const tasks = createQuery(() => ({
    gcTime: Infinity,
    queryFn: getService().fetchTasks,
    queryKey: getTasksCacheKey(),
    throwOnError: true,
  }));

  onMount(() => {
    if (store.isQuickTaskSelectEnabled) {
      quickTaskReset();
    }
  });

  const handleTaskSelect = (id: string) => {
    const response = getService().onTaskSelect?.(id);

    if (response !== false) {
      selectTask(id);
    }
  };

  if (store.pomelloState.timer?.isActive) {
    dialActionsSet(['pauseTimer']);
  }

  const shouldOpenSelect = store.pomelloState.timer?.isActive ?? store.isQuickTaskSelectEnabled;

  return (
    <Show when={tasks.data}>
      {tasks => (
        <Show
          fallback={
            <>
              <Show when={getService().getSelectTaskHeading?.()}>
                {getSelectTaskHeading => <Heading>{getSelectTaskHeading()}</Heading>}
              </Show>
              <SelectField
                defaultOpen={shouldOpenSelect}
                items={unwrap(tasks())}
                noResultsMessage={t('noTasksFound')}
                onChange={handleTaskSelect}
                placeholder={t('selectTaskPlaceholder')}
              />
            </>
          }
          when={getService().SelectTaskView}
        >
          {getSelectTaskView => <Dynamic component={getSelectTaskView()} selectTask={selectTask} />}
        </Show>
      )}
    </Show>
  );
};

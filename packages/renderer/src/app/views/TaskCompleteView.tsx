import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useCurrentTask } from '@/app/hooks/useCurrentTask';
import { useInvalidateTasksCache } from '@/app/hooks/useInvalidateTasksCache';
import { useRemoveTaskFromCache } from '@/app/hooks/useRemoveTaskFromCache';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Heading } from '@/ui/app/Heading';
import { SelectField } from '@/ui/app/SelectField';
import { SelectItem } from '@pomello-desktop/domain';
import { produce } from 'immer';
import { Component, Show, createSignal, onMount } from 'solid-js';

export const TaskCompleteView: Component = () => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { taskCompleteHandled } = usePomelloActions();
  const currentTask = useCurrentTask();
  const getService = useService();
  const invalidateTasksCache = useInvalidateTasksCache();
  const removeTaskFromCache = useRemoveTaskFromCache();
  const t = useTranslate();

  let customCompleteTaskItemId: string | null = null;
  let customMoveTaskItemId: string | null = null;

  const [getItems, setItems] = createSignal<SelectItem[]>();

  onMount(() => {
    const result = getService().getTaskCompleteItems?.({
      invalidateTasksCache,
      taskId: currentTask().item.id,
    });

    let customItems: SelectItem[] | undefined;

    if (result) {
      const { completeTaskItemId, items, moveTaskItemId, removeTask } = result;

      if (removeTask) {
        removeTaskFromCache(removeTask, currentTask().item.id);
      }

      customItems = items;

      if (items && (completeTaskItemId || moveTaskItemId)) {
        customItems = produce(items, draft => {
          let completeTaskOption: SelectItem | undefined;
          let moveTaskOption: SelectItem | undefined;

          let isDone = false;
          const itemsToSearch = [...draft];

          while (!isDone && itemsToSearch.length) {
            const item = itemsToSearch.shift()!;

            if (item.type === 'group' || item.type === 'customGroup') {
              itemsToSearch.unshift(...item.items);
            } else if (item.id === completeTaskItemId) {
              completeTaskOption = item;
            } else if (item.id === moveTaskItemId) {
              moveTaskOption = item;
            }

            isDone =
              (!completeTaskItemId || !!completeTaskOption) && // Either no completeTaskId or we found it
              (!moveTaskItemId || !!moveTaskOption); // Either no moveTaskId or we found it
          }

          if (completeTaskOption) {
            customCompleteTaskItemId = completeTaskOption.id;
            completeTaskOption.hint = getHotkeyLabel('completeTaskEarly');
          }

          if (moveTaskOption) {
            customMoveTaskItemId = moveTaskOption.id;
            moveTaskOption.hint = getHotkeyLabel('moveTask');
          }
        });
      }
    }

    if (!customItems || !customItems.length) {
      taskCompleteHandled();
    } else {
      setItems(customItems);
    }
  });

  const handleOptionSelect = (optionId: string) => {
    const response = getService().onTaskCompletePromptHandled?.({
      taskId: currentTask().item.id,
      optionId,
      invalidateTasksCache,
    });

    if (response?.removeTask) {
      removeTaskFromCache(response.removeTask, currentTask().item.id);
    }

    taskCompleteHandled();
  };

  const handleTaskComplete = () => {
    if (customCompleteTaskItemId) {
      handleOptionSelect(customCompleteTaskItemId);
    }
  };

  const handleTaskMove = () => {
    if (customMoveTaskItemId) {
      handleOptionSelect(customMoveTaskItemId);
    }
  };

  registerHotkeys({
    completeTaskEarly: handleTaskComplete,
    moveTask: handleTaskMove,
  });

  return (
    <Show when={getItems()}>
      {getItems => (
        <>
          <Heading>{currentTask().label}</Heading>
          <SelectField
            items={getItems()}
            onChange={handleOptionSelect}
            placeholder={t('taskCompletePlaceholder')}
          />
        </>
      )}
    </Show>
  );
};

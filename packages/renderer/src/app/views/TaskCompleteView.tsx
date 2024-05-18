import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useCurrentTask } from '@/app/hooks/useCurrentTask';
import { useInvalidateTasksCache } from '@/app/hooks/useInvalidateTasksCache';
import { useRemoveTaskFromCache } from '@/app/hooks/useRemoveTaskFromCache';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Heading } from '@/ui/components/Heading';
import { SelectField } from '@/ui/components/SelectField';
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

  let customMoveTaskItemId: string | null = null;

  const [getItems, setItems] = createSignal<SelectItem[]>();

  onMount(() => {
    const result = getService().getTaskCompleteItems?.({
      invalidateTasksCache,
      taskId: currentTask().item.id,
    });

    let customItems: SelectItem[] | undefined;

    if (result) {
      const { items, moveTaskItemId, shouldRemoveTaskFromCache } = result;

      if (shouldRemoveTaskFromCache) {
        removeTaskFromCache(currentTask().item.id);
      }

      customItems = items;

      if (items && moveTaskItemId) {
        customItems = produce(items, draft => {
          let moveTaskOption: SelectItem | undefined;

          const itemsToSearch = [...draft];

          while (!moveTaskOption && itemsToSearch.length) {
            const item = itemsToSearch.shift()!;

            if (item.type === 'group' || item.type === 'customGroup') {
              itemsToSearch.unshift(...item.items);
            } else if (item.id === moveTaskItemId) {
              moveTaskOption = item;
            }
          }

          if (moveTaskOption) {
            customMoveTaskItemId = moveTaskItemId;
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

    if (response?.shouldRemoveTaskFromCache) {
      removeTaskFromCache(currentTask().item.id);
    }

    taskCompleteHandled();
  };

  registerHotkeys({
    moveTask: () => {
      if (customMoveTaskItemId) {
        handleOptionSelect(customMoveTaskItemId);
      }
    },
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

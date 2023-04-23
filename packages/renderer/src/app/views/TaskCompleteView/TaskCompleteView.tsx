import useCurrentTask from '@/app/hooks/useCurrentTask';
import useHotkeys from '@/app/hooks/useHotkeys';
import useInvalidateTasksCache from '@/app/hooks/useInvalidateTasksCache';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useRemoveTaskFromCache from '@/app/hooks/useRemoveTaskFromCache/useRemoveTaskFromCache';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import produce from 'immer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

const TaskCompleteView: FC = () => {
  const { t } = useTranslation();

  const { getTaskCompleteItems, onTaskCompletePromptHandled } = useService();
  const { taskCompleteHandled } = usePomelloActions();
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const invalidateTasksCache = useInvalidateTasksCache();
  const removeTaskFromCache = useRemoveTaskFromCache();

  const { currentTask, currentTaskLabel } = useCurrentTask();

  const moveTaskItemId = useRef<string>();
  const [taskCompleteItems, setTaskCompleteItems] = useState<SelectItem[]>();

  useEffect(() => {
    const result = getTaskCompleteItems?.({
      invalidateTasksCache,
      taskId: currentTask.id,
    });

    let items: SelectItem[] | undefined;

    if (Array.isArray(result)) {
      items = result;
    } else if (result) {
      if (result.shouldRemoveTaskFromCache) {
        removeTaskFromCache(currentTask.id);
      }

      items = result.items;

      if (result.items && result.moveTaskItemId) {
        items = produce(result.items, draft => {
          let moveTaskOption: SelectItem | undefined;

          const itemsToSearch = [...draft];

          while (!moveTaskOption && itemsToSearch.length) {
            const item = itemsToSearch.shift()!;

            if (item.type === 'group' || item.type === 'customGroup') {
              itemsToSearch.unshift(...item.items);
            } else if (item.id === result.moveTaskItemId) {
              moveTaskOption = item;
            }
          }

          if (moveTaskOption) {
            moveTaskItemId.current = result.moveTaskItemId;
            moveTaskOption.hint = getHotkeyLabel('moveTask');
          }
        });
      }
    }

    if (!items || !items.length) {
      taskCompleteHandled();
    } else {
      setTaskCompleteItems(items);
    }
  }, [
    currentTask.id,
    getHotkeyLabel,
    getTaskCompleteItems,
    invalidateTasksCache,
    removeTaskFromCache,
    taskCompleteHandled,
  ]);

  const handleOptionSelect = useCallback(
    (optionId: string) => {
      const response = onTaskCompletePromptHandled?.({
        taskId: currentTask.id,
        optionId,
        invalidateTasksCache,
      });

      if (response?.shouldRemoveTaskFromCache) {
        removeTaskFromCache(currentTask.id);
      }

      taskCompleteHandled();
    },
    [
      currentTask.id,
      invalidateTasksCache,
      onTaskCompletePromptHandled,
      removeTaskFromCache,
      taskCompleteHandled,
    ]
  );

  useEffect(() => {
    return registerHotkeys({
      moveTask: () => {
        if (moveTaskItemId.current) {
          handleOptionSelect(moveTaskItemId.current);
        }
      },
    });
  }, [handleOptionSelect, registerHotkeys]);

  if (!taskCompleteItems) {
    return null;
  }

  return (
    <>
      <Heading>{currentTaskLabel}</Heading>
      <SelectField
        items={taskCompleteItems}
        onChange={handleOptionSelect}
        placeholder={t('taskCompletePlaceholder')}
      />
    </>
  );
};

export default TaskCompleteView;

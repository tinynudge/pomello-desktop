import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Heading } from '@/ui/app/Heading';
import { SelectField } from '@/ui/app/SelectField';
import { SelectItem } from '@pomello-desktop/domain';
import { produce } from 'immer';
import { Component } from 'solid-js';
import { useHotkeys } from '../context/HotkeysContext';
import { usePomelloActions } from '../context/PomelloContext';
import { useCurrentTask } from '../hooks/useCurrentTask';
import { useInvalidateTasksCache } from '../hooks/useInvalidateTasksCache';
import { useRemoveTaskFromCache } from '../hooks/useRemoveTaskFromCache';
import { useShowAddNoteView } from '../hooks/useShowAddNoteView';

export const TaskTimerEndView: Component = () => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { taskTimerEndPromptHandled } = usePomelloActions();
  const currentTask = useCurrentTask();
  const getService = useService();
  const invalidateTasksCache = useInvalidateTasksCache();
  const removeTaskFromCache = useRemoveTaskFromCache();
  const showAddNoteView = useShowAddNoteView();
  const t = useTranslate();

  let customCompleteTaskItemId: string | null = null;
  let customMoveTaskItemId: string | null = null;

  const getItems = () => {
    let customItems: SelectItem[] = [];

    const taskTimerEndItems = getService().getTaskTimerEndItems?.(currentTask().item.id);

    if (taskTimerEndItems) {
      const { completeTaskItemId, items, moveTaskItemId } = taskTimerEndItems;
      customItems = items;

      if (completeTaskItemId || moveTaskItemId) {
        customItems = produce(items, draft => {
          let completeTaskOption: SelectItem | undefined;
          let moveTaskOption: SelectItem | undefined;

          let isDone = false;
          const itemsToSearch = [...draft];

          while (!isDone && itemsToSearch.length) {
            const item = itemsToSearch.shift()!;

            if (item.type === 'group' || item.type === 'customGroup') {
              itemsToSearch.unshift(...item.items);
            } else if (completeTaskItemId && item.id === completeTaskItemId) {
              completeTaskOption = item;
            } else if (moveTaskItemId && item.id === moveTaskItemId) {
              moveTaskOption = item;
            }

            isDone =
              (!completeTaskItemId || !!completeTaskOption) && // Either no completeTaskItemId or we found it
              (!moveTaskItemId || !!moveTaskOption); // Either no moveTaskItemId or we found it
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

    return [
      {
        hint: getHotkeyLabel('continueTask'),
        id: 'continueTask',
        label: t('taskTimerEndContinue'),
      },
      {
        hint: !customMoveTaskItemId ? getHotkeyLabel('moveTask') : undefined,
        id: 'switchTask',
        label: t('taskTimerEndSwitch'),
      },
      {
        hint: getHotkeyLabel('voidTask'),
        id: 'voidTask',
        label: t('taskTimerEndVoid'),
      },
      {
        hint: getHotkeyLabel('addNote'),
        id: 'addNote',
        label: t('taskTimerEndAddNote'),
      },
      ...customItems,
    ];
  };

  const handleOptionSelect = (id: string) => {
    if (id === 'continueTask' || id === 'switchTask' || id === 'voidTask') {
      taskTimerEndPromptHandled(id);
    } else if (id === 'addNote') {
      showAddNoteView('generalNote');
    } else {
      const response = getService().onTaskTimerEndPromptHandled?.({
        invalidateTasksCache,
        optionId: id,
        taskId: currentTask().item.id,
      });

      if (response?.action) {
        taskTimerEndPromptHandled(response.action);
      }

      if (response?.removeTask) {
        removeTaskFromCache(response.removeTask, currentTask().item.id);
      }
    }
  };

  const handleTaskComplete = () => {
    if (customCompleteTaskItemId) {
      handleOptionSelect(customCompleteTaskItemId);
    }
  };

  const handleTaskMove = () => {
    if (customMoveTaskItemId) {
      handleOptionSelect(customMoveTaskItemId);
    } else {
      taskTimerEndPromptHandled('switchTask');
    }
  };

  registerHotkeys({
    addNote: () => showAddNoteView('generalNote'),
    completeTaskEarly: handleTaskComplete,
    continueTask: () => taskTimerEndPromptHandled('continueTask'),
    moveTask: handleTaskMove,
    voidTask: () => taskTimerEndPromptHandled('voidTask'),
  });

  return (
    <>
      <Heading>{currentTask().label}</Heading>
      <SelectField
        items={getItems()}
        onChange={handleOptionSelect}
        placeholder={t('taskTimerEndPlaceholder')}
      />
    </>
  );
};

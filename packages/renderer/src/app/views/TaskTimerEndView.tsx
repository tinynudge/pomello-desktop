import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Heading } from '@/ui/components/Heading';
import { SelectField } from '@/ui/components/SelectField';
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

  let customMoveTaskItemId: string | null = null;

  const getItems = () => {
    let customItems: SelectItem[] = [];

    const taskTimerEndItems = getService().getTaskTimerEndItems?.(currentTask().item.id);

    if (taskTimerEndItems) {
      const { items, moveTaskItemId } = taskTimerEndItems;
      customItems = items;

      if (moveTaskItemId) {
        customItems = produce(items, draft => {
          let moveTaskOption: SelectItem | undefined;

          const itemsToSearch = [...draft];

          while (!moveTaskOption && itemsToSearch.length) {
            const item = itemsToSearch.shift()!;

            if (item.type === 'group' || item.type === 'customGroup') {
              itemsToSearch.unshift(...item.items);
            } else if (item.id === taskTimerEndItems.moveTaskItemId) {
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

      if (response?.shouldRemoveTaskFromCache) {
        removeTaskFromCache(currentTask().item.id);
      }
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

import useCurrentTask from '@/app/hooks/useCurrentTask';
import useHotkeys from '@/app/hooks/useHotkeys';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import produce from 'immer';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';

const TaskCompleteView: FC = () => {
  const { t } = useTranslation();

  const { getTaskCompleteItems, onTaskCompletePromptHandled } = useService();
  const { taskCompleteHandled } = usePomelloActions();
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();

  const { currentTask, currentTaskLabel } = useCurrentTask();

  const moveTaskItemId = useRef<string>();

  const items = useMemo(() => {
    const taskCompleteItems = getTaskCompleteItems?.(currentTask.id);

    if (!taskCompleteItems || Array.isArray(taskCompleteItems)) {
      return taskCompleteItems;
    }

    return produce(taskCompleteItems.items, draft => {
      if (!taskCompleteItems.moveTaskItemId) {
        return;
      }

      let moveTaskOption: SelectItem | undefined;

      const itemsToSearch = [...draft];

      while (!moveTaskOption && itemsToSearch.length) {
        const item = itemsToSearch.shift()!;

        if (item.type === 'group' || item.type === 'customGroup') {
          itemsToSearch.unshift(...item.items);
        } else if (item.id === taskCompleteItems.moveTaskItemId) {
          moveTaskOption = item;
        }
      }

      if (moveTaskOption) {
        moveTaskItemId.current = taskCompleteItems.moveTaskItemId;
        moveTaskOption.hint = getHotkeyLabel('moveTask');
      }
    });
  }, [currentTask.id, getHotkeyLabel, getTaskCompleteItems]);

  useEffect(() => {
    if (!getTaskCompleteItems || !items) {
      taskCompleteHandled();
    }
  }, [getTaskCompleteItems, items, taskCompleteHandled]);

  const handleOptionSelect = useCallback(
    (optionId: string) => {
      onTaskCompletePromptHandled?.(currentTask.id, optionId);

      taskCompleteHandled();
    },
    [currentTask.id, onTaskCompletePromptHandled, taskCompleteHandled]
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

  if (!items) {
    return null;
  }

  return (
    <>
      <Heading>{currentTaskLabel}</Heading>
      <SelectField
        items={items}
        onChange={handleOptionSelect}
        placeholder={t('taskCompletePlaceholder')}
      />
    </>
  );
};

export default TaskCompleteView;

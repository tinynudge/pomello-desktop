import { SelectItem } from '@pomello-desktop/domain';

export const removeTask = (tasks: SelectItem[], taskId: string) => {
  let didFindTask = false;

  tasks.forEach((task, index) => {
    if (task.type === 'group' || task.type === 'customGroup') {
      const result = removeTask(task.items, taskId);

      if (result.didFindTask) {
        didFindTask = true;

        if (!result.tasks.length) {
          tasks.splice(index, 1);
        } else {
          task.items = result.tasks;
        }

        return;
      }
    }

    if (task.id === taskId) {
      didFindTask = true;
      tasks.splice(index, 1);

      return;
    }
  });

  return { didFindTask, tasks };
};

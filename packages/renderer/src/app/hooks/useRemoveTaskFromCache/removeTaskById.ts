import { TaskSelectItem } from '@pomello-desktop/domain';

export const removeTaskById = (tasks: TaskSelectItem[], taskId: string) => {
  let didFindTask = false;

  tasks.forEach((task, index) => {
    if (task.id === taskId) {
      didFindTask = true;
      tasks.splice(index, 1);

      return;
    }

    if (task.children) {
      const result = removeTaskById(task.children, taskId);

      if (result.didFindTask) {
        didFindTask = true;

        if (!result.tasks.length) {
          delete task.children;
        } else {
          task.children = result.tasks;
        }

        return;
      }
    }

    if (task.type === 'group' || task.type === 'customGroup') {
      const result = removeTaskById(task.items, taskId);

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
  });

  return { didFindTask, tasks };
};

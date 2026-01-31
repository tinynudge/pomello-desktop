import { TaskSelectItem } from '@pomello-desktop/domain';
import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App - Complete Task', () => {
  it('should go to the select task view if there is no custom options', async () => {
    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          getTaskCompleteItems: undefined,
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Complete task' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should go to the select task view if getting custom options returns nothing', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          getTaskCompleteItems: () => {},
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should prompt the user for an action if there are custom options', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'task', label: 'My task' }]),
          getTaskCompleteItems: () => ({
            items: [{ id: 'option', label: 'Option' }],
          }),
        },
      },
    });

    await simulate.selectTask('task');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My task' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: "Nice! What's next?" })).toBeInTheDocument();
    });
  });

  it('should call the custom option handler when an option is selected', async () => {
    const handleTaskComplete = vi.fn();

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskCompleteItems: () => ({
            items: [
              { id: 'foo', label: 'Foo' },
              { id: 'bar', label: 'Bar' },
            ],
          }),
          onTaskCompletePromptHandled: handleTaskComplete,
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('bar');

    await waitFor(() => {
      expect(handleTaskComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          optionId: 'bar',
          taskId: 'hello',
        })
      );
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should handle the complete task hotkey for a customized item', async () => {
    const handleTaskComplete = vi.fn();

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskCompleteItems: () => ({
            items: [
              { id: 'foo', label: 'Foo' },
              { id: 'bar', label: 'Bar' },
            ],
            completeTaskItemId: 'foo',
          }),
          onTaskCompletePromptHandled: handleTaskComplete,
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(handleTaskComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          optionId: 'foo',
          taskId: 'hello',
        })
      );
    });
  });

  it('should handle the move task hotkey for a customized item', async () => {
    const handleTaskComplete = vi.fn();

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskCompleteItems: () => ({
            items: [
              { id: 'foo', label: 'Foo' },
              { id: 'bar', label: 'Bar' },
            ],
            moveTaskItemId: 'bar',
          }),
          onTaskCompletePromptHandled: handleTaskComplete,
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.hotkey('moveTask');

    await waitFor(() => {
      expect(handleTaskComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          optionId: 'bar',
          taskId: 'hello',
        })
      );
    });
  });

  it('should show the complete task hotkey hint in the options', async () => {
    const { appApi, simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskCompleteItems: () => ({
            items: [{ id: 'foo', label: 'Foo' }],
            completeTaskItemId: 'foo',
          }),
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          {
            hint: '⌘ ⇧ B',
            id: 'foo',
            label: 'Foo',
          },
        ]),
      })
    );
  });

  it('should show the move task hotkey hint in the options', async () => {
    const { appApi, simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskCompleteItems: () => ({
            items: [{ id: 'bar', label: 'Bar' }],
            moveTaskItemId: 'bar',
          }),
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          {
            hint: '⌘ ⇧ G',
            id: 'bar',
            label: 'Bar',
          },
        ]),
      })
    );
  });

  it('should show both custom complete and move task hotkey hints in the options', async () => {
    const { appApi, simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskCompleteItems: () => ({
            items: [
              { id: 'foo', label: 'Foo' },
              { id: 'bar', label: 'Bar' },
            ],
            completeTaskItemId: 'foo',
            moveTaskItemId: 'bar',
          }),
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          {
            hint: '⌘ ⇧ B',
            id: 'foo',
            label: 'Foo',
          },
          {
            hint: '⌘ ⇧ G',
            id: 'bar',
            label: 'Bar',
          },
        ]),
      })
    );
  });

  it('should delay fetching the task if there is a mutation to update tasks', async () => {
    const fetchTasks = vi.fn(() => Promise.resolve([{ id: 'hello', label: 'World' }]));

    let resolveRemoveTask = () => {};

    const removeTask = () =>
      new Promise<void>(resolve => {
        resolveRemoveTask = resolve;
      });

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks,
          getTaskCompleteItems: () => ({
            items: [{ id: 'bar', label: 'Bar' }],
          }),
          onTaskCompletePromptHandled: () => ({
            removeTask,
          }),
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('bar');
    await simulate.waitForSelectTaskView();

    expect(fetchTasks).toHaveBeenCalledOnce();

    resolveRemoveTask();

    await waitFor(() => {
      expect(fetchTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('should optimistically remove the completed task from the cache', async () => {
    const { appApi, simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'mama-task',
                label: 'Mama Task',
                children: [
                  {
                    id: 'task-1',
                    label: 'Task 1',
                  },
                ],
              },
              {
                id: 'task-2',
                label: 'Task 2',
              },
            ]),
          getTaskCompleteItems: () => ({
            // Don't resolve to simulate pending state, we just want to test the optimistic update
            removeTask: () => new Promise(() => {}),
          }),
        },
      },
    });

    await simulate.selectTask('mama-task');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [{ id: 'task-2', label: 'Task 2' }],
      })
    );
  });

  it('should optimistically remove completed child tasks from the cache', async () => {
    const { appApi, simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'mama-task',
                label: 'Mama Task',
                children: [
                  { id: 'task-1', label: 'Task 1' },
                  { id: 'task-2', label: 'Task 2' },
                ],
              },
            ]),
          getTaskCompleteItems: () => ({
            // Don't resolve to simulate pending state, we just want to test the optimistic update
            removeTask: () => new Promise(() => {}),
          }),
        },
      },
    });

    await simulate.selectTask('task-1');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          { id: 'mama-task', label: 'Mama Task' },
          { id: 'task-2', label: 'Task 2' },
        ],
      })
    );
  });

  it('should optimistically remove completed tasks from groups in the cache', async () => {
    const { appApi, simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'group-1',
                label: 'Group 1',
                type: 'group',
                items: [
                  { id: 'task-1', label: 'Task 1' },
                  { id: 'task-2', label: 'Task 2' },
                ],
              },
            ] satisfies TaskSelectItem[]),
          getTaskCompleteItems: () => ({
            // Don't resolve to simulate pending state, we just want to test the optimistic update
            removeTask: () => new Promise(() => {}),
          }),
        },
      },
    });

    await simulate.selectTask('task-1');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          {
            id: 'group-1',
            label: 'Group 1',
            type: 'group',
            items: [{ id: 'task-2', label: 'Task 2' }],
          },
        ],
      })
    );
  });
});

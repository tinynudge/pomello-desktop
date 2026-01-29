import { TaskTimerEndPromptHandledResponse } from '@pomello-desktop/domain';
import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App - Task Timer End', () => {
  it('should show the view when the task timer ends', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
        },
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(screen.getByRole('heading', { name: 'Foo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Time's up! How'd you do?" })).toBeInTheDocument();
  });

  it('should show the correct options', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          { hint: '⌘ ⇧ C', id: 'continueTask', label: 'Continue after break' },
          { hint: '⌘ ⇧ G', id: 'switchTask', label: 'Switch tasks after break' },
          { hint: '⌘ ⇧ Q', id: 'voidTask', label: 'Void this pomodoro' },
          { hint: '⌘ ⇧ A', id: 'addNote', label: 'Add a note first' },
        ],
      })
    );
  });

  it('should show custom options', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foobar' }],
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([{ id: 'foo', label: 'Foobar' }]),
      })
    );
  });

  it('should enable overriding the move task hotkey action', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foobar' }],
            moveTaskItemId: 'foo',
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          { hint: '⌘ ⇧ C', id: 'continueTask', label: 'Continue after break' },
          { id: 'switchTask', label: 'Switch tasks after break' },
          { hint: '⌘ ⇧ Q', id: 'voidTask', label: 'Void this pomodoro' },
          { hint: '⌘ ⇧ A', id: 'addNote', label: 'Add a note first' },
          { hint: '⌘ ⇧ G', id: 'foo', label: 'Foobar' },
        ],
      })
    );
  });

  it('should enable overriding the move task hotkey action on nested items', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [
              {
                id: 'foo-group',
                items: [{ id: 'foo', label: 'Foo' }],
                label: 'Foobar',
                type: 'group',
              },
            ],
            moveTaskItemId: 'foo',
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: [
          { hint: '⌘ ⇧ C', id: 'continueTask', label: 'Continue after break' },
          { id: 'switchTask', label: 'Switch tasks after break' },
          { hint: '⌘ ⇧ Q', id: 'voidTask', label: 'Void this pomodoro' },
          { hint: '⌘ ⇧ A', id: 'addNote', label: 'Add a note first' },
          {
            id: 'foo-group',
            items: [{ hint: '⌘ ⇧ G', id: 'foo', label: 'Foo' }],
            label: 'Foobar',
            type: 'group',
          },
        ],
      })
    );
  });

  it('should handle the continue task option', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
        },
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('continueTask');

    expect(screen.getByRole('heading', { name: 'Next: Foo' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the continue task hotkey', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'foo', label: 'Foo' }]),
        },
      },
    });

    await simulate.selectTask('foo');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('continueTask');

    expect(screen.getByRole('heading', { name: 'Next: Foo' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the switch task option', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('switchTask');

    expect(screen.getByRole('heading', { name: 'Next: New task' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the move task hotkey', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('moveTask');

    expect(screen.getByRole('heading', { name: 'Next: New task' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the move task hotkey for a customized item', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn<() => TaskTimerEndPromptHandledResponse>(() => ({
      action: 'continueTask',
    }));

    const { simulate } = renderApp({
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'pick-me', label: 'Pick me!' }],
            moveTaskItemId: 'pick-me',
          }),
          onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
        },
      },
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('moveTask');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        optionId: 'pick-me',
      })
    );
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle the complete task hotkey for a customized item', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn<() => TaskTimerEndPromptHandledResponse>(() => ({
      action: 'continueTask',
    }));

    const { simulate } = renderApp({
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'pick-me', label: 'Pick me!' }],
            completeTaskItemId: 'pick-me',
          }),
          onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
        },
      },
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('completeTaskEarly');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        optionId: 'pick-me',
      })
    );
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should show the move task hotkey in the options', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foobar' }],
            moveTaskItemId: 'foo',
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          {
            hint: '⌘ ⇧ G',
            id: 'foo',
            label: 'Foobar',
          },
        ]),
      })
    );
  });

  it('should show the complete task hotkey in the options', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foobar' }],
            completeTaskItemId: 'foo',
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          {
            hint: '⌘ ⇧ B',
            id: 'foo',
            label: 'Foobar',
          },
        ]),
      })
    );
  });

  it('should show both custom complete and move task hotkeys in the options', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [
              { id: 'complete-me', label: 'Complete me!' },
              { id: 'move-me', label: 'Move me!' },
            ],
            completeTaskItemId: 'complete-me',
            moveTaskItemId: 'move-me',
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);

    expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          {
            hint: '⌘ ⇧ B',
            id: 'complete-me',
            label: 'Complete me!',
          },
          {
            hint: '⌘ ⇧ G',
            id: 'move-me',
            label: 'Move me!',
          },
        ]),
      })
    );
  });

  it('should handle the add note option', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('addNote');

    expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
  });

  it('should handle the add note hotkey', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('addNote');

    expect(screen.getByRole('heading', { name: 'Add note' })).toBeInTheDocument();
  });

  it('should handle the void task option', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('voidTask');

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should handle the void task hotkey', async () => {
    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.hotkey('voidTask');

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should handle a custom option without an action', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn();

    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foo' }],
          }),
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        optionId: 'foo',
        taskId: 'hello',
      })
    );
  });

  it('should handle a custom continue task option', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn<() => TaskTimerEndPromptHandledResponse>(() => ({
      action: 'continueTask',
    }));

    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foo' }],
          }),
          onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Next: World' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle a custom switch task option', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn<() => TaskTimerEndPromptHandledResponse>(() => ({
      action: 'switchTask',
    }));

    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foo' }],
          }),
          onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Next: New task' })).toBeInTheDocument();
    expect(screen.getByText('Take a short break')).toBeInTheDocument();
  });

  it('should handle a custom void task option', async () => {
    const mockTaskTimerEndPromptHandler = vi.fn<() => TaskTimerEndPromptHandledResponse>(() => ({
      action: 'voidTask',
    }));

    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foo' }],
          }),
          onTaskTimerEndPromptHandled: mockTaskTimerEndPromptHandler,
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('foo');

    expect(mockTaskTimerEndPromptHandler).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should delay fetching the task if there is a mutation to update tasks', async () => {
    const fetchTasks = vi.fn(() => Promise.resolve([{ id: 'hello', label: 'World' }]));

    let resolveRemoveTask = () => {};

    const removeTask = () =>
      new Promise<void>(resolve => {
        resolveRemoveTask = resolve;
      });

    const { simulate } = renderApp({
      settings: {
        taskTime: 3,
      },
      mockService: {
        service: {
          fetchTasks,
          getTaskTimerEndItems: () => ({
            items: [{ id: 'foo', label: 'Foo' }],
          }),
          onTaskTimerEndPromptHandled: () => ({
            action: 'switchTask',
            removeTask,
          }),
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('foo');
    await simulate.hotkey('skipBreak');
    await simulate.waitForSelectTaskView();

    expect(fetchTasks).toHaveBeenCalledOnce();

    resolveRemoveTask();

    await waitFor(() => {
      expect(fetchTasks).toHaveBeenCalledTimes(2);
    });
  });
});

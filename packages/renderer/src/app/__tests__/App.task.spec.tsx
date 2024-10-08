import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App - Task', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should be able to select nested tasks', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              {
                id: 'group',
                items: [
                  { id: 'group-one', label: 'Group One' },
                  {
                    id: 'nested-group',
                    items: [{ id: 'nested-group-one', label: 'Nested Group One' }],
                    label: 'My nested group',
                    type: 'group',
                  },
                ],
                label: 'My group',
                type: 'group',
              },
            ]),
        },
      },
    });

    await simulate.selectTask('nested-group-one');

    expect(screen.getByText('Nested Group One')).toBeInTheDocument();
  });

  it('should show the dial', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();

    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });

  it('should show a heading if provided', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          getTaskHeading: () => 'Foobar',
        },
      },
    });

    await simulate.selectTask();

    expect(screen.getByRole('heading', { name: 'Foobar' })).toBeInTheDocument();
  });

  it('should show a custom task label if provided', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'custom', label: 'Task' }]),
          getTaskLabel: id => `Custom ${id}`,
        },
      },
    });

    await simulate.selectTask('custom');

    expect(screen.getByText('Custom custom')).toBeInTheDocument();
  });

  it('should show the correct dial actions', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();

    const pauseButton = screen.getByRole('button', { name: 'Pause timer' });
    const addNoteButton = screen.getByRole('button', { name: 'Add note' });
    const switchTaskButton = screen.getByRole('button', { name: 'Switch task' });
    const voidTaskButton = screen.getByRole('button', { name: 'Void task' });
    const completeTaskButton = screen.getByRole('button', { name: 'Complete task' });

    expect(pauseButton).toBeInTheDocument();
    expect(pauseButton).toHaveAttribute('title', 'Pause timer (⌘ ⇧ I)');

    expect(addNoteButton).toBeInTheDocument();
    expect(addNoteButton).toHaveAttribute('title', 'Add note (⌘ ⇧ A)');

    expect(switchTaskButton).toBeInTheDocument();
    expect(switchTaskButton).toHaveAttribute('title', 'Switch task (⌘ ⇧ O)');

    expect(voidTaskButton).toBeInTheDocument();
    expect(voidTaskButton).toHaveAttribute('title', 'Void task (⌘ ⇧ Q)');

    expect(completeTaskButton).toBeInTheDocument();
    expect(completeTaskButton).toHaveAttribute('title', 'Complete task (⌘ ⇧ B)');
  });

  it('should pause the timer', async () => {
    const { simulate, userEvent } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Pause timer' }));

    expect(screen.getByRole('button', { name: 'Resume timer' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Resume timer' }));

    expect(screen.queryByRole('button', { name: 'Resume timer' })).not.toBeInTheDocument();
  });

  it('should pause the timer via hotkeys', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();
    await simulate.hotkey('startTimer');
    await simulate.hotkey('pauseTimer');

    waitFor(() => {
      expect(screen.getByRole('button', { name: 'Resume timer' })).toBeInTheDocument();
    });

    await simulate.hotkey('startTimer');

    expect(screen.queryByRole('button', { name: 'Resume timer' })).not.toBeInTheDocument();
  });

  it('should switch tasks', async () => {
    const { simulate, userEvent } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Switch task' }));

    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should switch tasks via hotkeys', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('switchTask');

    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should complete tasks', async () => {
    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          getTaskCompleteItems: () => ({
            items: [{ id: 'option', label: 'Option' }],
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Complete task' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: "Nice! What's next?" })).toBeInTheDocument();
    });
  });

  it('should complete tasks via hotkeys', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          getTaskCompleteItems: () => ({
            items: [{ id: 'option', label: 'Option' }],
          }),
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    expect(screen.getByRole('button', { name: "Nice! What's next?" })).toBeInTheDocument();
  });

  it('should void tasks', async () => {
    const { simulate, userEvent } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Void task' }));

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should void tasks via hotkeys', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('voidTask');

    expect(screen.getByRole('heading', { name: 'External distraction' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
  });

  it('should show an error message when unable to find the current task', async () => {
    const mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([]),
        },
      },
    });

    await simulate.selectTask('foo');

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    mockedConsole.mockRestore();
  });

  it('should be able to optimistically remove a task after the timer ends', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        pomodoroSet: ['task', 'shortBreak'],
        shortBreakTime: 3,
        taskTime: 5,
      },
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              { id: 'TASK_ONE', label: 'Task one' },
              {
                id: 'GROUP_A',
                label: 'Group A',
                type: 'group',
                items: [
                  {
                    id: 'GROUP_B',
                    label: 'Group B',
                    type: 'group',
                    items: [
                      {
                        id: 'GROUP_C',
                        label: 'Group C',
                        type: 'group',
                        items: [{ id: 'TASK_TWO', label: 'Task two' }],
                      },
                    ],
                  },
                ],
              },
              { id: 'TASK_THREE', label: 'Task three' },
            ]),
          getTaskTimerEndItems: () => ({
            items: [{ id: 'NEXT', label: 'Next task' }],
          }),
          onTaskTimerEndPromptHandled: () => ({
            action: 'switchTask',
            removeTask: true,
          }),
        },
      },
    });

    await simulate.selectTask('TASK_TWO');
    await simulate.startTimer();
    await simulate.advanceTimer(5);
    await simulate.selectOption('NEXT');
    await simulate.advanceTimer(3);

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            { id: 'TASK_ONE', label: 'Task one' },
            { id: 'TASK_THREE', label: 'Task three' },
          ],
        })
      );
    });
  });

  it('should be able to optimistically remove a task after being completed early', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 5,
      },
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              { id: 'TASK_ONE', label: 'Task one' },
              {
                id: 'GROUP_A',
                label: 'Group A',
                type: 'group',
                items: [
                  {
                    id: 'GROUP_B',
                    label: 'Group B',
                    type: 'group',
                    items: [
                      {
                        id: 'GROUP_C',
                        label: 'Group C',
                        type: 'group',
                        items: [{ id: 'TASK_TWO', label: 'Task two' }],
                      },
                    ],
                  },
                ],
              },
              { id: 'TASK_THREE', label: 'Task three' },
            ]),
          getTaskCompleteItems: () => ({
            items: [{ id: 'NEXT', label: 'Next task' }],
          }),
          onTaskCompletePromptHandled: () => ({
            removeTask: true,
          }),
        },
      },
    });

    await simulate.selectTask('TASK_TWO');
    await simulate.startTimer();
    await simulate.advanceTimer(2);
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('NEXT');

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            { id: 'TASK_ONE', label: 'Task one' },
            { id: 'TASK_THREE', label: 'Task three' },
          ],
        })
      );
    });
  });

  it('should be able to optimistically remove a task after being completed early without handling the prompt', async () => {
    const { appApi, simulate } = renderApp({
      settings: {
        taskTime: 5,
      },
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              { id: 'TASK_ONE', label: 'Task one' },
              {
                id: 'GROUP_A',
                label: 'Group A',
                type: 'group',
                items: [
                  {
                    id: 'GROUP_B',
                    label: 'Group B',
                    type: 'group',
                    items: [
                      {
                        id: 'GROUP_C',
                        label: 'Group C',
                        type: 'group',
                        items: [{ id: 'TASK_TWO', label: 'Task two' }],
                      },
                    ],
                  },
                ],
              },
              { id: 'TASK_THREE', label: 'Task three' },
            ]),
          getTaskCompleteItems: () => ({ removeTask: true }),
        },
      },
    });

    await simulate.selectTask('TASK_TWO');
    await simulate.startTimer();
    await simulate.advanceTimer(2);
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            { id: 'TASK_ONE', label: 'Task one' },
            { id: 'TASK_THREE', label: 'Task three' },
          ],
        })
      );
    });
  });

  it('should be able to invalidate the tasks cache when handling the task timer end prompt', async () => {
    const fetchTasks = vi.fn().mockResolvedValue([{ id: 'TASK_ONE', label: 'Task one' }]);

    const { simulate } = renderApp({
      settings: {
        pomodoroSet: ['task', 'shortBreak'],
        shortBreakTime: 3,
        taskTime: 5,
      },
      mockService: {
        service: {
          fetchTasks,
          getTaskTimerEndItems: () => ({
            items: [{ id: 'NEXT', label: 'Next task' }],
          }),
          onTaskTimerEndPromptHandled: ({ invalidateTasksCache }) => {
            invalidateTasksCache();

            return { action: 'switchTask' };
          },
        },
      },
    });

    await simulate.selectTask('TASK_ONE');
    await simulate.startTimer();
    await simulate.advanceTimer(5);
    await simulate.selectOption('NEXT');
    await simulate.advanceTimer(3);

    expect(fetchTasks).toHaveBeenCalledTimes(2);
  });

  it('should be able to invalidate the tasks cache when handling the task completed prompt', async () => {
    const fetchTasks = vi.fn().mockResolvedValue([{ id: 'TASK_ONE', label: 'Task one' }]);

    const { simulate } = renderApp({
      settings: {
        pomodoroSet: ['task', 'shortBreak'],
        taskTime: 5,
      },
      mockService: {
        service: {
          fetchTasks,
          getTaskCompleteItems: () => ({
            items: [{ id: 'NEXT', label: 'Next task' }],
          }),
          onTaskCompletePromptHandled: ({ invalidateTasksCache }) => {
            invalidateTasksCache();
          },
        },
      },
    });

    await simulate.selectTask('TASK_ONE');
    await simulate.startTimer();
    await simulate.advanceTimer(2);
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('NEXT');

    expect(fetchTasks).toHaveBeenCalledTimes(2);
  });

  it('should be able to invalidate the tasks cache after being completed early without handling the prompt', async () => {
    const fetchTasks = vi.fn().mockResolvedValue([{ id: 'TASK_ONE', label: 'Task one' }]);

    const { simulate } = renderApp({
      settings: {
        pomodoroSet: ['task', 'shortBreak'],
        taskTime: 5,
      },
      mockService: {
        service: {
          fetchTasks,
          getTaskCompleteItems: ({ invalidateTasksCache }) => {
            invalidateTasksCache();
          },
        },
      },
    });

    await simulate.selectTask('TASK_ONE');
    await simulate.startTimer();
    await simulate.advanceTimer(2);
    await simulate.hotkey('completeTaskEarly');
    await simulate.advanceTimer(1);

    expect(fetchTasks).toHaveBeenCalledTimes(2);
  });
});

import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Select task', () => {
  it('should show a heading if provided', async () => {
    mountApp({
      mockService: {
        service: {
          getSelectTaskHeading: () => 'Choose wisely',
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Choose wisely' })).toBeInTheDocument();
    });
  });

  it('should automatically open the select window after switching tasks', async () => {
    const { appApi, simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('switchTask');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
      expect(appApi.showSelect).toHaveBeenCalled();
    });
  });

  it('should automatically open the select window after completing tasks', async () => {
    const { appApi, simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
      expect(appApi.showSelect).toHaveBeenCalled();
    });
  });

  it('should not go to the task view if overridden', async () => {
    const { simulate } = mountApp({
      mockService: {
        service: {
          fetchTasks: () =>
            Promise.resolve([
              { id: 'task', label: 'Real task' },
              { id: 'some-action', label: 'Do something else' },
            ]),
          onTaskSelect: taskId => taskId !== 'some-action',
        },
      },
    });

    await simulate.selectTask('some-action');

    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();

    await simulate.selectTask('task');

    expect(screen.getByRole('button', { name: 'Start timer' })).toBeInTheDocument();
  });
});

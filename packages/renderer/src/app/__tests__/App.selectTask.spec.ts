import MockInitializingView from '@/app/__fixtures__/MockInitalizingView.svelte';
import mountApp, { screen, waitFor } from '@/app/__fixtures__/mountApp';
import { vi } from 'vitest';

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

  it.todo('should automatically open the select window after switching tasks', async () => {
    const { appApi, emitAppApiEvent, simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('switchTask');

    await waitFor(() => {
      emitAppApiEvent('onSelectReady');

      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
      expect(appApi.showSelect).toHaveBeenCalled();
    });
  });

  it.todo('should automatically open the select window after completing tasks', async () => {
    const { appApi, emitAppApiEvent, simulate } = mountApp({
      settings: {
        taskTime: 3,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      emitAppApiEvent('onSelectReady');

      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
      expect(appApi.showSelect).toHaveBeenCalled();
    });
  });

  it('should automatically open the select window on initialization if enabled', async () => {
    const mockShowSelect = vi.fn();

    const { simulate } = mountApp({
      appApi: {
        showSelect: mockShowSelect,
      },
      initialServiceId: 'myMockService',
      mockService: {
        service: {
          InitializingView: {
            component: MockInitializingView,
            additionalProps: {
              openTaskSelect: true,
            },
          },
          id: 'myMockService',
        },
      },
    });

    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(mockShowSelect).toHaveBeenCalledTimes(1);
    });
  });

  it.todo('should not go to the task view if overridden', async () => {
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

import { InitializingView } from '@pomello-desktop/domain';
import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App - Select task', () => {
  it('should show a heading if provided', async () => {
    renderApp({
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
    const { appApi, emitAppApiEvent, simulate } = renderApp({
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

  it('should automatically open the select window after completing tasks', async () => {
    const { appApi, emitAppApiEvent, simulate } = renderApp({
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

    const MockInitializingView: InitializingView = ({ onReady }) => {
      onReady({ openTaskSelect: true });

      return null;
    };

    const { simulate } = renderApp({
      appApi: {
        showSelect: mockShowSelect,
      },
      mockService: {
        service: {
          InitializingView: MockInitializingView,
          id: 'myMockService',
        },
      },
      serviceId: 'myMockService',
    });

    await simulate.waitForSelectTaskView();

    await waitFor(() => {
      expect(mockShowSelect).toHaveBeenCalledTimes(1);
    });
  });

  it('should not go to the task view if overridden', async () => {
    const { simulate } = renderApp({
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

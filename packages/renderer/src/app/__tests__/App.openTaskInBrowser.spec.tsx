import { vi } from 'vitest';
import { renderApp } from '../__fixtures__/renderApp';

describe('App - Open Task', () => {
  it('should show a message if unable to open the task in the browser', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate } = renderApp({
      mockService: {
        service: {
          onTaskOpen: undefined,
        },
      },
    });

    await simulate.selectTask();
    await simulate.hotkey('openInBrowser');

    expect(NotificationMock).toHaveBeenCalledWith('Unable to open task in browser', {
      body: 'Mock service does not support this',
    });
  });

  it('should open a task in the browser', async () => {
    const mockTaskOpen = vi.fn();

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: async () => [{ id: 'TASK_ID', label: 'My task' }],
          onTaskOpen: mockTaskOpen,
        },
      },
    });

    await simulate.selectTask('TASK_ID');
    await simulate.hotkey('openInBrowser');

    expect(mockTaskOpen).toHaveBeenCalledWith({
      openUrl: expect.any(Function),
      taskId: 'TASK_ID',
    });
  });

  it('should not open a task if no task is selected', async () => {
    const mockTaskOpen = vi.fn();

    const { simulate } = renderApp({
      mockService: {
        service: {
          onTaskOpen: mockTaskOpen,
        },
      },
    });

    await simulate.hotkey('openInBrowser');

    expect(mockTaskOpen).not.toHaveBeenCalled();
  });
});

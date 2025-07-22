import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';
import { SelectItem, TranslationsDictionary } from '@pomello-desktop/domain';

describe('App - Create task', () => {
  it('should show a message if there is no active service', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate } = renderApp({
      serviceId: null,
    });

    await simulate.openMenu();
    await simulate.clickMenuButton('createTask');

    expect(NotificationMock).toHaveBeenCalledWith('Unable to create task', {
      body: 'A service has not been selected',
    });
  });

  it('should show a message if the service is still initializing', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate } = renderApp({
      appApi: {
        getTranslations: () => new Promise<TranslationsDictionary>(() => {}),
      },
    });

    await simulate.openMenu();
    await simulate.clickMenuButton('createTask');

    expect(NotificationMock).toHaveBeenCalledWith('Unable to create task', {
      body: 'The service is still loading',
    });
  });

  it('should show a message if task creation is not supported', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate } = renderApp({
      mockService: {
        service: {
          onTaskCreate: undefined,
        },
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.openMenu();
    await simulate.clickMenuButton('createTask');

    expect(NotificationMock).toHaveBeenCalledWith('Unable to create task', {
      body: 'Mock service does not support this',
    });
  });

  it('should show a message if unable to create a task', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          onTaskCreate: () => ({
            notification: ['Ah ah ah', "You didn't say the magic word"],
          }),
        },
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'access main security grid{Enter}');

    expect(NotificationMock).toHaveBeenCalledWith('Ah ah ah', {
      body: "You didn't say the magic word",
    });
  });

  it('should be able to show a message after creating a task', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          onTaskCreate: () => ({
            createTask: () => ({
              notification: ['Ah ah ah', "You didn't say the magic word"],
            }),
          }),
        },
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'PLEASE! GODDAMMIT!{Enter}');

    expect(NotificationMock).toHaveBeenCalledWith('Ah ah ah', {
      body: "You didn't say the magic word",
    });
  });

  it('should show the create task view when the menu button is clicked', async () => {
    const { simulate } = renderApp();

    await simulate.openMenu();
    await simulate.clickMenuButton('createTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the create note view via hotkeys', async () => {
    const { simulate } = renderApp();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should handle when a task is created', async () => {
    const handleTaskCreate = vi.fn(() => ({
      createTask: () => {},
    }));

    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          onTaskCreate: handleTaskCreate,
        },
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'Foo{Enter}');

    expect(handleTaskCreate).toHaveBeenCalledWith('Foo');
    expect(screen.queryByRole('heading', { name: 'Create task' })).not.toBeInTheDocument();
  });

  it('should not do anything if the input is blank', async () => {
    const handleTaskCreate = vi.fn();

    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          onTaskCreate: handleTaskCreate,
        },
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), '{Enter}');

    expect(handleTaskCreate).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument();
  });

  it('should hide the create task view when escape pressed', async () => {
    const { simulate, userEvent } = renderApp();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), '{Escape}');

    expect(screen.queryByRole('heading', { name: 'Create task' })).not.toBeInTheDocument();
  });

  it('should trigger the help page when /? is entered', async () => {
    const { appApi, simulate, userEvent } = renderApp();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), '/?{Enter}');

    expect(appApi.openUrl).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument();
  });

  it('should be able to re-fetch tasks after creating a task', async () => {
    const fetchTasks = vi.fn<() => Promise<SelectItem[]>>(() => Promise.resolve([]));

    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          onTaskCreate: () => ({
            createTask: () => ({
              shouldInvalidateTasksCache: true,
            }),
          }),
          fetchTasks,
        },
      },
    });

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), 'This is my task{Enter}');

    expect(fetchTasks).toHaveBeenCalledTimes(2);
  });
});

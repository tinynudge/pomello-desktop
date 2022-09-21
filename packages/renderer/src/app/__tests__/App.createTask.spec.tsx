import { vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Create task', () => {
  it('should show a message if there is no active service', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate } = mountApp({
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

    const { simulate } = mountApp({
      appApi: {
        getTranslations: () => new Promise(() => {}),
      },
    });

    await simulate.openMenu();
    await simulate.clickMenuButton('createTask');

    expect(NotificationMock).toHaveBeenCalledWith('Unable to create task', {
      body: 'The service is still loading',
    });
  });

  it('should show a message if unable to create a note', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    const { simulate } = mountApp({
      mockService: {
        service: {
          handleTaskCreate: undefined,
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

  it('should show the create task view when the menu button is clicked', async () => {
    const { simulate } = mountApp();

    await simulate.openMenu();
    await simulate.clickMenuButton('createTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should show the create note view via hotkeys', async () => {
    const { simulate } = mountApp();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter /? for help')).toBeInTheDocument();
    });
  });

  it('should handle when a task is created', async () => {
    const handleTaskCreate = vi.fn();

    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          handleTaskCreate,
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

    const { simulate, userEvent } = mountApp({
      mockService: {
        service: {
          handleTaskCreate,
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
    const { simulate, userEvent } = mountApp();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), '{Escape}');

    expect(screen.queryByRole('heading', { name: 'Create task' })).not.toBeInTheDocument();
  });

  it('should trigger the help page when /? is entered', async () => {
    const { appApi, simulate, userEvent } = mountApp();

    await simulate.waitForSelectTaskView();
    await simulate.hotkey('createTask');
    await userEvent.type(screen.getByRole('textbox'), '/?{Enter}');

    expect(appApi.openUrl).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Create task' })).toBeInTheDocument();
  });
});

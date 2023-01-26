import { SpyInstance, vi } from 'vitest';
import mountApp, { screen, waitFor } from '../__fixtures__/mountApp';

describe('App - Pomello', () => {
  let mockedConsole: SpyInstance;

  beforeAll(() => {
    mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);
  });

  afterAll(() => {
    mockedConsole.mockRestore();
  });

  it('should prompt the user to create an account for the first time', async () => {
    mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: undefined,
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Create Pomello account to track productivity?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sure' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
    });
  });

  it('should not prompt the user to create an account if they already have a token', async () => {
    mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: 'MY_POMELLO_TOKEN',
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should open the auth window if they want to create an account', async () => {
    const { appApi, userEvent } = mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: undefined,
      },
    });

    const confirmButton = await screen.findByRole('button', { name: 'Sure' });
    await userEvent.click(confirmButton);

    expect(appApi.showAuthWindow).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should navigate to the select task view if they decline to register an account', async () => {
    const { appApi, userEvent } = mountApp({
      pomelloConfig: {
        didPromptRegistration: false,
        token: undefined,
      },
      settings: {
        checkPomelloStatus: false,
      },
    });

    const skipButton = await screen.findByRole('button', { name: 'Not now' });
    await userEvent.click(skipButton);

    expect(appApi.showAuthWindow).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
  });

  it('should show a login prompt if they have no token and checkPomelloStatus is enabled', async () => {
    const { appApi } = mountApp({
      pomelloConfig: {
        token: undefined,
      },
      settings: {
        checkPomelloStatus: true,
      },
    });

    await waitFor(() => {
      expect(appApi.showMessageBox).toHaveBeenCalledWith({
        buttons: ['Log in', 'Close', "Don't remind me again"],
        cancelId: 1,
        defaultId: 0,
        detail:
          'You are currently NOT logged into your Pomello account. Log in to start tracking your productivity.',
        message: 'Not logged into Pomello',
        type: 'info',
      });
    });
  });

  it('should show a login prompt if they are logged out and checkPomelloStatus is enabled', async () => {
    const { appApi } = mountApp({
      pomelloApi: {
        fetchUser: (_request, response, context) => response(context.status(401)),
      },
      pomelloConfig: {
        token: undefined,
      },
      settings: {
        checkPomelloStatus: true,
      },
    });

    await waitFor(() => {
      expect(appApi.showMessageBox).toHaveBeenCalledWith({
        buttons: ['Log in', 'Close', "Don't remind me again"],
        cancelId: 1,
        defaultId: 0,
        detail:
          'You are currently NOT logged into your Pomello account. Log in to start tracking your productivity.',
        message: 'Not logged into Pomello',
        type: 'info',
      });
    });
  });

  it('should show a notification if unable to connect to Pomello servers', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    mountApp({
      pomelloApi: {
        fetchUser: (_request, response, context) => response(context.status(500)),
      },
    });

    await waitFor(() => {
      expect(NotificationMock).toHaveBeenCalledWith("Couldn't connect to Pomello servers");
    });
  });
});

import { ServiceFactory } from '@pomello-desktop/domain';
import { HttpResponse, delay } from 'msw';
import { MockInstance, vi } from 'vitest';
import { generatePomelloUser } from '../__fixtures__/generatePomelloUser';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App - Pomello', () => {
  let mockedConsole: MockInstance;

  beforeAll(() => {
    mockedConsole = vi.spyOn(console, 'error');
    mockedConsole.mockImplementation(() => null);
  });

  afterAll(() => {
    mockedConsole.mockRestore();
  });

  it('should prompt the user to create an account for the first time', async () => {
    renderApp({
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
    renderApp({
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
    const { appApi, userEvent } = renderApp({
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
    const { appApi, userEvent } = renderApp({
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
    const { appApi } = renderApp({
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
    const { appApi } = renderApp({
      pomelloApi: {
        fetchUser: function () {
          throw new HttpResponse('', { status: 401 });
        },
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

  it('should set checkPomelloStatus to false if disabled in the dialog', async () => {
    const mockShowMessageBox = vi.fn().mockResolvedValue({ response: 2 });

    const { appApi } = renderApp({
      appApi: {
        showMessageBox: mockShowMessageBox,
      },
      pomelloApi: {
        fetchUser: () => {
          throw new HttpResponse('', { status: 401 });
        },
      },
      pomelloConfig: {
        token: undefined,
      },
      settings: {
        checkPomelloStatus: true,
      },
    });

    await waitFor(() => {
      expect(appApi.updateSetting).toHaveBeenCalledWith('checkPomelloStatus', false);
    });
  });

  it('should show a notification if unable to connect to Pomello servers', async () => {
    const NotificationMock = vi.fn();
    vi.stubGlobal('Notification', NotificationMock);

    renderApp({
      pomelloApi: {
        fetchUser: () => {
          throw new HttpResponse('', { status: 500 });
        },
      },
    });

    await waitFor(() => {
      expect(NotificationMock).toHaveBeenCalledWith("Couldn't connect to Pomello servers");
    });
  });

  it('should refetch the tasks if the user changes to premium account', async () => {
    const fooService: ServiceFactory = ({ user }) => {
      return {
        displayName: fooService.displayName,
        fetchTasks: async () => {
          const isPremium = user?.type === 'premium';

          return isPremium
            ? [{ id: 'premium', label: 'Premium item' }]
            : [{ id: 'boring', label: 'Boring item' }];
        },
        id: fooService.id,
      };
    };
    fooService.displayName = 'Foo';
    fooService.id = 'foo';

    const { appApi } = renderApp({
      createServiceRegistry: () => ({
        [fooService.id]: fooService,
      }),
      pomelloApi: {
        fetchUser: async () => {
          await delay(50);

          return HttpResponse.json(
            generatePomelloUser({
              type: 'premium',
            })
          );
        },
      },
      pomelloConfig: {
        user: {
          name: 'Johnny Appleseed',
          email: 'johnny@apple.com',
          timezone: 'America/Chicago',
          type: 'free',
        },
      },
      serviceId: fooService.id,
      settings: {
        checkPomelloStatus: true,
      },
    });

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledTimes(2);
      expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: [{ id: 'premium', label: 'Premium item' }],
        })
      );
    });
  });

  it('should refetch the tasks if the user changes to free account', async () => {
    const fooService: ServiceFactory = ({ user }) => {
      return {
        displayName: fooService.displayName,
        fetchTasks: async () => {
          const isPremium = user?.type === 'premium';

          return isPremium
            ? [{ id: 'premium', label: 'Premium item' }]
            : [{ id: 'boring', label: 'Boring item' }];
        },
        id: fooService.id,
      };
    };
    fooService.displayName = 'Foo';
    fooService.id = 'foo';

    const { appApi } = renderApp({
      createServiceRegistry: () => ({
        [fooService.id]: fooService,
      }),
      pomelloApi: {
        fetchUser: async () => {
          await delay(50);

          return HttpResponse.json(
            generatePomelloUser({
              type: 'free',
            })
          );
        },
      },
      pomelloConfig: {
        user: {
          name: 'Johnny Appleseed',
          email: 'johnny@apple.com',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
      serviceId: fooService.id,
      settings: {
        checkPomelloStatus: true,
      },
    });

    await waitFor(() => {
      expect(appApi.setSelectItems).toHaveBeenCalledTimes(2);
      expect(appApi.setSelectItems).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: [{ id: 'boring', label: 'Boring item' }],
        })
      );
    });
  });
});

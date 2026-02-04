import { useTranslate } from '@/shared/context/RuntimeContext';
import { ServiceConfigStore, ServiceContainer, ServiceFactory } from '@pomello-desktop/domain';
import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App', () => {
  it('should show the menu when toggled', async () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ width: 100 }) as DOMRect;

    const { simulate } = renderApp();

    await simulate.openMenu();

    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should toggle the menu via hotkey', async () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({ width: 100 }) as DOMRect;

    const { simulate } = renderApp();

    await simulate.hotkey('toggleMenu');

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should not toggle the menu if the hotkey is not set', async () => {
    const { simulate } = renderApp({
      hotkeys: {
        toggleMenu: undefined,
      },
    });

    await simulate.hotkey('toggleMenu');

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('title', 'Open menu');
    expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
  });

  it('should reset to the select task state when the home button is clicked', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();
    await simulate.openMenu();
    await simulate.clickMenuButton('home');

    expect(screen.getByText('Pick a task')).toBeInTheDocument();
    expect(screen.queryByTestId('dial')).not.toBeInTheDocument();
  });

  it('should open the dashboard to the settings page when the settings button is clicked', async () => {
    const { appApi, simulate } = renderApp();

    await simulate.openMenu();
    await simulate.clickMenuButton('settings');

    expect(appApi.showDashboardWindow).toHaveBeenCalledWith('settings');
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('should open the dashboard to the settings page via the route settings hotkey', async () => {
    const { appApi, simulate } = renderApp();

    await simulate.hotkey('routeSettings');

    expect(appApi.showDashboardWindow).toHaveBeenCalledWith('settings');
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('should open the dashboard to the productivity page via the route productivity hotkey', async () => {
    const { appApi, simulate } = renderApp();

    await simulate.hotkey('routeProductivity');

    expect(appApi.showDashboardWindow).toHaveBeenCalledWith('productivity');
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('should prompt the user for confirmation if resetting during an active task (if enabled)', async () => {
    const mockShowMessageBox = vi.fn().mockResolvedValue({ response: 0 });

    const { simulate } = renderApp({
      appApi: {
        showMessageBox: mockShowMessageBox,
      },
      settings: {
        warnBeforeTaskCancel: true,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('routeHome');

    expect(mockShowMessageBox).toHaveBeenCalledWith({
      type: 'warning',
      title: 'Pomello',
      message: 'Are you sure?',
      detail: 'This action will cancel your current task.',
      buttons: ['Yes, cancel task', 'No, resume task'],
      defaultId: 0,
      cancelId: 1,
    });
  });

  it('should not reset the state if the cancel task dialog is cancelled', async () => {
    const mockShowMessageBox = vi.fn().mockResolvedValue({ response: 1 });

    const { simulate } = renderApp({
      appApi: {
        showMessageBox: mockShowMessageBox,
      },
      settings: {
        warnBeforeTaskCancel: true,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('routeHome');

    expect(screen.getByTestId('dial')).toBeInTheDocument();
  });

  it('should not prompt the user for confirmation if resetting during an active task (if disabled)', async () => {
    const mockShowMessageBox = vi.fn().mockResolvedValue({ response: 0 });

    const { simulate } = renderApp({
      appApi: {
        showMessageBox: mockShowMessageBox,
      },
      settings: {
        warnBeforeTaskCancel: false,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.openMenu();
    await simulate.clickMenuButton('home');

    expect(mockShowMessageBox).not.toHaveBeenCalled();
    expect(screen.getByText('Pick a task')).toBeInTheDocument();
    expect(screen.queryByTestId('dial')).not.toBeInTheDocument();
  });

  it('should not prompt the user for confirmation if resetting while a break is active', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const mockShowMessageBox = vi.fn().mockResolvedValue({ response: 0 });

    const { simulate } = renderApp({
      appApi: {
        showMessageBox: mockShowMessageBox,
      },
      settings: {
        taskTime: 3,
        warnBeforeTaskCancel: true,
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.advanceTimer(3);
    await simulate.selectOption('continueTask');
    await simulate.openMenu();
    await simulate.clickMenuButton('home');

    expect(mockShowMessageBox).not.toHaveBeenCalled();
    expect(screen.getByText('Pick a task')).toBeInTheDocument();
    expect(screen.queryByTestId('dial')).not.toBeInTheDocument();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should reset to the select task state via hotkey', async () => {
    const { simulate } = renderApp();

    await simulate.selectTask();
    await simulate.hotkey('routeHome');

    expect(screen.getByText('Pick a task')).toBeInTheDocument();
  });

  it('should prompt the user to select a service if not set', async () => {
    renderApp({ serviceId: null });

    await waitFor(() => {
      expect(screen.getByText(/select a service/i)).toBeInTheDocument();
    });
  });

  it('should initialize the service when selected', async () => {
    const InitializingView = () => <>Loading service</>;

    const { simulate } = renderApp({
      mockService: {
        service: {
          InitializingView,
        },
      },
      serviceId: null,
    });

    await simulate.selectService('mock');

    expect(screen.getByText(/loading service/i)).toBeInTheDocument();
  });

  it('should register the service config if it exists', async () => {
    const { appApi, simulate } = renderApp({
      mockService: {
        config: {
          defaults: {
            foo: 'bar',
          },
          schema: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
            required: ['foo'],
          },
        } as unknown as ServiceConfigStore,
        service: {
          id: 'foo',
        },
      },
      serviceId: null,
    });

    await simulate.selectService('foo');

    expect(appApi.registerServiceConfig).toHaveBeenCalledWith('foo', {
      defaults: {
        foo: 'bar',
      },
      schema: {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
        required: ['foo'],
      },
    });
  });

  it('should load service translations', async () => {
    const getTranslations = vi.fn().mockResolvedValue({
      helloWorld: 'Hello world!',
    });

    const InitializingView = () => {
      const t = useTranslate();

      return <>{t('service:helloWorld')}</>;
    };

    const { simulate } = renderApp({
      appApi: { getTranslations },
      mockService: {
        service: {
          InitializingView,
        },
      },
      serviceId: null,
    });

    await simulate.selectService('mock');

    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });

  it('should be able to translate from the service', async () => {
    const getTranslations = vi.fn().mockResolvedValue({
      fooMessage: 'Goodbye {{object}}!',
    });

    const fooService: ServiceFactory = ({ translate }) => {
      return {
        getTaskHeading: () => translate('fooMessage', { object: 'World' }),
        displayName: fooService.displayName,
        fetchTasks: () => Promise.resolve([{ id: 'one', label: 'My task' }]),
        id: fooService.id,
      };
    };
    fooService.displayName = 'Foo';
    fooService.hasConfigureView = false;
    fooService.id = 'foo';

    const { simulate } = renderApp({
      appApi: {
        getTranslations,
      },
      createServiceRegistry: () => ({
        [fooService.id]: fooService,
      }),
      serviceId: 'foo',
    });

    await simulate.selectTask('one');

    expect(screen.getByRole('heading', { name: 'Goodbye World!' })).toBeInTheDocument();
  });

  it('should load a service container if provided', async () => {
    const Container: ServiceContainer = props => <div data-testid="container">{props.children}</div>;

    renderApp({
      mockService: {
        service: {
          Container,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId('container')).toBeInTheDocument();
    });
  });
});

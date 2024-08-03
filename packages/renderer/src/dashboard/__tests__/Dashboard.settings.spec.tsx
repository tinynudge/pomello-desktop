import { DashboardRoute } from '@pomello-desktop/domain';
import { renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

describe('Dashboard - Settings', () => {
  it('should render the settings', () => {
    renderDashboard({ route: DashboardRoute.Settings });

    expect(screen.getByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument();
  });

  it('should show the last sync date of the settings', () => {
    const date = new Date();

    renderDashboard({
      route: DashboardRoute.Settings,
      pomelloConfig: {
        user: {
          email: 'tommy@tester.com',
          name: 'Tommy',
          timezone: 'America/Chicago',
          type: 'free',
        },
      },
      settings: {
        timestamp: date.getTime(),
      },
    });

    expect(screen.getByText(`Last synced: ${date.toLocaleString()}`)).toBeInTheDocument();
    expect(screen.queryByTestId('settings-sync-disabled')).not.toBeInTheDocument();
  });

  it('should let the user know if syncing is disabled', async () => {
    const date = new Date();

    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      pomelloConfig: {
        user: undefined,
      },
      settings: {
        timestamp: date.getTime(),
      },
    });

    expect(screen.getByText(`Last synced: ${date.toLocaleString()}`)).toBeInTheDocument();
    expect(screen.getByTestId('settings-sync-disabled')).toHaveTextContent(
      'Syncing is disabled. Log in to Pomello to sync your settings.'
    );

    await userEvent.click(
      within(screen.getByTestId('settings-sync-disabled')).getByRole('button', { name: 'Log in' })
    );

    expect(appApi.showAuthWindow).toHaveBeenCalledOnce();
    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      type: 'pomello',
      action: 'authorize',
    });
  });
});

import { DashboardRoute } from '@pomello-desktop/domain';
import { HttpResponse } from 'msw';
import { renderDashboard, screen, waitFor } from '../__fixtures__/renderDashboard';

describe('Dashboard - Profile', () => {
  it('should render the profile view', () => {
    renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'thomas@tester.com',
          name: 'Thomas Tester',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
    });

    expect(screen.getByRole('heading', { name: 'Profile', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Account details', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Display name' })).toHaveValue('Thomas Tester');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('thomas@tester.com');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('readonly');
    expect(screen.getByRole('combobox', { name: 'Timezone' })).toHaveValue('America/Chicago');
  });

  it('should indicate if the user has a premium account', () => {
    renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'test@test.com',
          name: 'Test User',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
    });

    expect(screen.getByTestId('account-type')).toHaveTextContent('Premium');
    expect(screen.getByRole('link', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should open the subscription page when the cancel link is clicked', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'test@test.com',
          name: 'Test User',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
    });

    await userEvent.click(screen.getByRole('link', { name: 'Cancel' }));

    expect(appApi.openUrl).toHaveBeenCalledWith(expect.stringMatching(/dashboard\/user\/subscription$/));
  });

  it('should indicate if the user has a free account', () => {
    renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'test@test.com',
          name: 'Test User',
          timezone: 'America/Chicago',
          type: 'free',
        },
      },
    });

    expect(screen.getByTestId('account-type')).toHaveTextContent('Free');
    expect(screen.queryByRole('link', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('should show the save banner when the name is changed', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Profile,
    });

    const nameInput = screen.getByRole('textbox', { name: 'Display name' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');

    expect(screen.getByRole('status')).toHaveTextContent('Your pending changes have not been saved yet.');
  });

  it('should show the save banner when the timezone is changed', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Profile,
    });

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Timezone' }), 'America/New_York');

    expect(screen.getByRole('status')).toHaveTextContent('Your pending changes have not been saved yet.');
  });

  it('should hide the save banner and restore values when undo is clicked', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'test@test.com',
          name: 'Thomas Tester',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
    });

    const nameInput = screen.getByRole('textbox', { name: 'Display name' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');

    expect(screen.getByRole('status')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(nameInput).toHaveValue('Thomas Tester');
  });

  it('should call updateUser with the full user profile when save is clicked', async () => {
    const { pomelloApi, userEvent } = renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'test@test.com',
          name: 'Thomas Tester',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
    });

    const nameInput = screen.getByRole('textbox', { name: 'Display name' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(pomelloApi.updateUser).toHaveBeenCalledWith({
      name: 'New Name',
      timezone: 'America/Chicago',
    });
  });

  it('should hide the save banner after saving', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'test@test.com',
          name: 'Thomas Tester',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
    });

    const nameInput = screen.getByRole('textbox', { name: 'Display name' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');

    expect(screen.getByRole('status')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('should rollback the profile update when the API call fails', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Profile,
      pomelloConfig: {
        user: {
          email: 'test@test.com',
          name: 'Thomas Tester',
          timezone: 'America/Chicago',
          type: 'premium',
        },
      },
      pomelloApi: {
        updateUser: () => HttpResponse.json(null, { status: 500 }),
      },
    });

    const nameInput = screen.getByRole('textbox', { name: 'Display name' });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'New Name');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(nameInput).toHaveValue('Thomas Tester');
    });
  });
});

import { renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

describe('Dashboard', () => {
  it('should render the menu correctly', () => {
    renderDashboard();

    const mainMenu = screen.getByRole('navigation', { name: 'Main menu' });
    const menuItems = screen.getAllByRole('link');

    expect(mainMenu).toBeInTheDocument();
    expect(menuItems.at(0)).toHaveTextContent('Productivity');
    expect(menuItems.at(1)).toHaveTextContent('Settings');
    expect(menuItems.at(2)).toHaveTextContent('Sounds');
    expect(menuItems.at(3)).toHaveTextContent('Keyboard shortcuts');
    expect(menuItems.at(4)).toHaveTextContent('Services');
  });

  it('should show the correct account details when logged in', () => {
    const { pomelloConfig } = renderDashboard({
      pomelloConfig: {
        user: undefined,
      },
    });

    const account = screen.getByTestId('account-details');

    expect(within(account).queryByText('Tommy Tester')).not.toBeInTheDocument();
    expect(within(account).queryByText('tommy@tester.not.com')).not.toBeInTheDocument();
    expect(within(account).queryByText('Free')).not.toBeInTheDocument();

    pomelloConfig.set('user', {
      email: 'tommy@tester.com',
      name: 'Tommy Tester',
      timezone: 'America/Chicago',
      type: 'free',
    });

    expect(within(account).getByText('Tommy Tester')).toBeInTheDocument();
    expect(within(account).getByText('tommy@tester.com')).toBeInTheDocument();
    expect(within(account).getByText('Free')).toBeInTheDocument();
  });

  it('should show links to log in or sign up when not logged in', () => {
    const { pomelloConfig } = renderDashboard({
      pomelloConfig: {
        user: {
          email: 'tommy@tester.com',
          name: 'Tommy Tester',
          timezone: 'America/Chicago',
          type: 'free',
        },
      },
    });

    const account = screen.getByTestId('account-details');

    expect(account).not.toHaveTextContent('Log in or sign up to track your productivity');
    expect(within(account).queryByRole('button', { name: 'log in' })).not.toBeInTheDocument();
    expect(within(account).queryByRole('button', { name: 'sign up' })).not.toBeInTheDocument();

    pomelloConfig.set('user', undefined);

    expect(account).toHaveTextContent('Log in or sign up to track your productivity');
    expect(within(account).getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(within(account).getByRole('button', { name: 'sign up' })).toBeInTheDocument();
  });

  it('should open the Pomello login auth window when the login button is clicked', async () => {
    const { appApi, userEvent } = renderDashboard({
      pomelloConfig: {
        user: undefined,
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      type: 'pomello',
      action: 'authorize',
    });
  });

  it('should open the Pomello register auth window when the register button is clicked', async () => {
    const { appApi, userEvent } = renderDashboard({
      pomelloConfig: {
        user: undefined,
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'sign up' }));

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      type: 'pomello',
      action: 'register',
    });
  });
});

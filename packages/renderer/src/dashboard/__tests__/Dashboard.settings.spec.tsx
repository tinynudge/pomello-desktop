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

  it('should render the general settings', () => {
    renderDashboard({
      route: DashboardRoute.Settings,
    });

    const list = screen.getByRole('list', { name: 'General settings' });

    expect(screen.getByRole('heading', { name: 'General', level: 2 })).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(within(list).getAllByRole('listitem')).toHaveLength(8);
  });

  it.each([
    {
      defaultValue: true,
      index: 0,
      label: 'Always on top',
      setting: 'alwaysOnTop',
    },
    {
      defaultValue: false,
      index: 1,
      label: 'Snap to screen edge',
      setting: 'snapEdges',
    },
    {
      defaultValue: true,
      index: 3,
      label: 'Overtime',
      setting: 'overtime',
    },
    {
      defaultValue: true,
      index: 5,
      label: 'Check Pomello account login status',
      setting: 'checkPomelloStatus',
    },
    {
      defaultValue: true,
      index: 6,
      label: 'Warn before canceling task',
      setting: 'warnBeforeTaskCancel',
    },
    {
      defaultValue: true,
      index: 7,
      label: 'Warn before quitting app',
      setting: 'warnBeforeAppQuit',
    },
    {
      defaultValue: true,
      index: 11,
      label: 'Reset pomodoro set',
      setting: 'resetPomodoroSet',
    },
    {
      defaultValue: false,
      index: 12,
      label: 'Auto start tasks',
      setting: 'autoStartTasks',
    },
    {
      defaultValue: false,
      index: 13,
      label: 'Auto start breaks',
      setting: 'autoStartBreaks',
    },
  ])(
    'should update the toggle setting for "$label"',
    async ({ defaultValue, index, label, setting }) => {
      const { appApi, userEvent } = renderDashboard({
        route: DashboardRoute.Settings,
        settings: {
          [setting]: defaultValue,
        },
      });

      const main = screen.getByRole('main');
      const listItems = within(main).getAllByRole('listitem');
      const listItem = within(main).getByRole('listitem', { name: label });

      expect(listItem).toBe(listItems.at(index));
      expect(within(listItem).getByTestId('form-field-description')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('checkbox', { name: label }));

      expect(appApi.updateSetting).toHaveBeenCalledTimes(1);
      expect(appApi.updateSetting).toHaveBeenLastCalledWith(setting, !defaultValue);

      await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
      await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));

      expect(appApi.updateSetting).toHaveBeenLastCalledWith(setting, defaultValue);
    }
  );

  it.each([
    {
      defaultValue: { id: 'focus', label: 'Focus' },
      index: 2,
      label: 'Time expired notification',
      newValue: { id: 'flash', label: 'Flash' },
      setting: 'timeExpiredNotification',
    },
  ])(
    'should update select setting for "$label"',
    async ({ defaultValue, index, label, newValue, setting }) => {
      const { appApi, userEvent } = renderDashboard({
        route: DashboardRoute.Settings,
        settings: {
          [setting]: defaultValue.id,
        },
      });

      const main = screen.getByRole('main');
      const listItems = within(main).getAllByRole('listitem');
      const listItem = within(main).getByRole('listitem', { name: label });

      expect(listItem).toBe(listItems.at(index));
      expect(within(listItem).getByTestId('form-field-description')).toBeInTheDocument();

      await userEvent.selectOptions(screen.getByRole('combobox', { name: label }), newValue.label);

      expect(appApi.updateSetting).toHaveBeenCalledTimes(1);
      expect(appApi.updateSetting).toHaveBeenLastCalledWith(setting, newValue.id);

      await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
      await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));

      expect(appApi.updateSetting).toHaveBeenLastCalledWith(setting, defaultValue.id);
    }
  );

  it.each([
    {
      defaultValue: 60,
      index: 4,
      label: 'Overtime delay',
      newValue: 13 * 60,
      setting: 'overtimeDelay',
    },
    {
      defaultValue: 25 * 60,
      index: 8,
      label: 'Task time',
      newValue: 13 * 60,
      setting: 'taskTime',
    },
    {
      defaultValue: 5 * 60,
      index: 9,
      label: 'Short break time',
      newValue: 2 * 60,
      setting: 'shortBreakTime',
    },
    {
      defaultValue: 15 * 60,
      index: 10,
      label: 'Long break time',
      newValue: 20 * 60,
      setting: 'longBreakTime',
    },
  ])(
    'should update time setting for "$label"',
    async ({ defaultValue, index, label, newValue, setting }) => {
      const { appApi, userEvent } = renderDashboard({
        route: DashboardRoute.Settings,
        settings: {
          [setting]: defaultValue,
        },
      });

      const main = screen.getByRole('main');
      const listItems = within(main).getAllByRole('listitem');
      const listItem = within(main).getByRole('listitem', { name: label });

      expect(listItem).toBe(listItems.at(index));
      expect(within(listItem).getByTestId('form-field-description')).toBeInTheDocument();
      expect(within(listItem).getByText('min')).toBeInTheDocument();

      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: label }),
        `${newValue / 60}`
      );

      expect(appApi.updateSetting).toHaveBeenCalledTimes(1);
      expect(appApi.updateSetting).toHaveBeenLastCalledWith(setting, newValue);

      await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
      await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));

      expect(appApi.updateSetting).toHaveBeenLastCalledWith(setting, defaultValue);
    }
  );
});

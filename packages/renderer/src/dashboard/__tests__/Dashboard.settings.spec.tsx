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

  it('should render the pomodoro settings', () => {
    renderDashboard({
      route: DashboardRoute.Settings,
    });

    const list = screen.getByRole('list', { name: 'Pomodoro settings' });

    expect(screen.getByRole('heading', { name: 'Pomodoro', level: 2 })).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(within(list).getAllByRole('listitem')).toHaveLength(7);
  });

  it('should render the tasks settings', () => {
    renderDashboard({
      route: DashboardRoute.Settings,
    });

    const list = screen.getByRole('list', { name: 'Tasks settings' });

    expect(screen.getByRole('heading', { name: 'Tasks', level: 2 })).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
  });

  it('should undo staged changes', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        alwaysOnTop: true,
        timeExpiredNotification: 'flash',
        taskTime: 60,
        pomodoroSet: ['task', 'shortBreak'],
      },
    });

    await userEvent.click(screen.getByRole('checkbox', { name: 'Always on top' }));
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Time expired notification' }),
      'Focus'
    );
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Task time' }), '5');
    await userEvent.click(screen.getByRole('button', { name: '1. Edit task timer' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Switch to short break timer' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );
    expect(screen.getByRole('checkbox', { name: 'Always on top' })).not.toBeChecked();
    expect(screen.getByRole('combobox', { name: 'Time expired notification' })).toHaveValue(
      'focus'
    );
    expect(screen.getByRole('button', { name: '1. Edit short break timer' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(appApi.updateSettings).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Always on top' })).toBeChecked();
    expect(screen.getByRole('combobox', { name: 'Time expired notification' })).toHaveValue(
      'flash'
    );
    expect(screen.getByRole('button', { name: '1. Edit task timer' })).toBeInTheDocument();
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
      index: 12,
      label: 'Reset pomodoro set',
      setting: 'resetPomodoroSet',
    },
    {
      defaultValue: false,
      index: 13,
      label: 'Auto start tasks',
      setting: 'autoStartTasks',
    },
    {
      defaultValue: false,
      index: 14,
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

      expect(screen.getByRole('status')).toHaveTextContent(
        'Your pending changes have not been saved yet.'
      );

      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(appApi.updateSettings).toHaveBeenCalledTimes(1);
      expect(appApi.updateSettings).toHaveBeenLastCalledWith({ [setting]: !defaultValue });

      await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
      await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));
      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(appApi.updateSettings).toHaveBeenLastCalledWith({ [setting]: defaultValue });
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
    {
      defaultValue: { id: '🍅', label: '🍅' },
      index: 15,
      label: 'Card title Pomodoro marker',
      newValue: { id: '✓', label: '✓' },
      setting: 'titleMarker',
    },
    {
      defaultValue: { id: 'fraction', label: 'Fraction' },
      index: 16,
      label: 'Card title marker format',
      newValue: { id: 'decimal', label: 'Decimal' },
      setting: 'titleFormat',
    },
    {
      defaultValue: { id: 'top', label: 'Top' },
      index: 17,
      label: 'Moved task list position',
      newValue: { id: 'bottom', label: 'Bottom' },
      setting: 'completedTaskPosition',
    },
    {
      defaultValue: { id: 'top', label: 'Top' },
      index: 18,
      label: 'Created task list position',
      newValue: { id: 'bottom', label: 'Bottom' },
      setting: 'createdTaskPosition',
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

      expect(screen.getByRole('status')).toHaveTextContent(
        'Your pending changes have not been saved yet.'
      );

      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(appApi.updateSettings).toHaveBeenCalledTimes(1);
      expect(appApi.updateSettings).toHaveBeenLastCalledWith({ [setting]: newValue.id });

      await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
      await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));
      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(appApi.updateSettings).toHaveBeenLastCalledWith({ [setting]: defaultValue.id });
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

      expect(screen.getByRole('status')).toHaveTextContent(
        'Your pending changes have not been saved yet.'
      );

      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(appApi.updateSettings).toHaveBeenCalledTimes(1);
      expect(appApi.updateSettings).toHaveBeenLastCalledWith({ [setting]: newValue });

      await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
      await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));
      await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

      expect(appApi.updateSettings).toHaveBeenLastCalledWith({ [setting]: defaultValue });
    }
  );

  it('should render a custom time setting', async () => {
    renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        taskTime: 25,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Task time' });

    expect(within(listItem).getByTestId('form-field-description')).toBeInTheDocument();
    expect(within(listItem).getByRole('textbox', { name: 'Task time' })).toBeInTheDocument();
  });

  it('should update a custom time setting', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        overtimeDelay: 66,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Overtime delay' });
    const textbox = within(listItem).getByRole('textbox', { name: 'Overtime delay' });

    await userEvent.clear(textbox);
    await userEvent.type(textbox, '80');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({ overtimeDelay: 80 });
  });

  it('should show a validation error if typing an invalid custom time', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        longBreakTime: 66,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Long break time' });
    const textbox = within(listItem).getByRole('textbox', { name: 'Long break time' });

    await userEvent.type(textbox, 'abc');

    expect(
      screen.queryByText('Your pending changes have not been saved yet.')
    ).not.toBeInTheDocument();
    expect(within(listItem).getByText('A valid number is required')).toBeInTheDocument();

    await userEvent.clear(textbox);
    await userEvent.type(textbox, '80');

    expect(within(listItem).queryByText('A valid number is required')).not.toBeInTheDocument();
  });

  it('should remove the validation error if undoing the pending changes', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        taskTime: 304,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Task time' });
    const textbox = within(listItem).getByRole('textbox', { name: 'Task time' });

    await userEvent.clear(textbox);
    await userEvent.type(textbox, '200');
    await userEvent.type(textbox, 'abc');

    expect(within(listItem).getByText('A valid number is required')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(within(listItem).queryByText('A valid number is required')).not.toBeInTheDocument();
    expect(textbox).toHaveValue('304');
  });

  it('should switch from a simple time input to a custom one', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        shortBreakTime: 300,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Short break time' });

    expect(
      within(listItem).getByRole('combobox', { name: 'Short break time' })
    ).toBeInTheDocument();
    expect(
      within(listItem).queryByRole('textbox', { name: 'Short break time' })
    ).not.toBeInTheDocument();

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to advanced view' })
    );

    expect(
      within(listItem).queryByRole('combobox', { name: 'Short break time' })
    ).not.toBeInTheDocument();
    expect(within(listItem).getByRole('textbox', { name: 'Short break time' })).toBeInTheDocument();
  });

  it('should show a warning when switching to a simple time input if the time does not evenly divide into a whole minute', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        longBreakTime: 310,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Long break time' });

    expect(
      within(listItem).queryByRole('combobox', { name: 'Long break time' })
    ).not.toBeInTheDocument();
    expect(within(listItem).getByRole('textbox', { name: 'Long break time' })).toBeInTheDocument();

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to simple view' })
    );

    const modal = screen.getByRole('dialog', { name: 'Incompatible setting' });

    expect(modal).toBeInTheDocument();
    expect(
      within(modal).getByRole('heading', { name: 'Incompatible setting' })
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(
        'Your current time is either higher than the simple view\'s maximum value or cannot be converted evenly from seconds into minutes. Click "Reset" to use to the default time. Otherwise, click "Cancel" to continue using your current time.'
      )
    ).toBeInTheDocument();
    expect(within(modal).getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(within(modal).getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    await userEvent.click(within(modal).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog', { name: 'Incompatible setting' })).not.toBeInTheDocument();
    expect(
      within(listItem).queryByRole('combobox', { name: 'Long break time' })
    ).not.toBeInTheDocument();
    expect(within(listItem).getByRole('textbox', { name: 'Long break time' })).toBeInTheDocument();
  });

  it('should show a warning when switching to a simple time input if the time is greater the simple select max value', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        taskTime: 3660,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Task time' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to simple view' })
    );

    const modal = screen.getByRole('dialog', { name: 'Incompatible setting' });

    expect(modal).toBeInTheDocument();
    expect(
      within(modal).getByRole('heading', { name: 'Incompatible setting' })
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(
        'Your current time is either higher than the simple view\'s maximum value or cannot be converted evenly from seconds into minutes. Click "Reset" to use to the default time. Otherwise, click "Cancel" to continue using your current time.'
      )
    ).toBeInTheDocument();
    expect(within(modal).getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(within(modal).getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    await userEvent.click(within(modal).getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog', { name: 'Incompatible setting' })).not.toBeInTheDocument();
    expect(within(listItem).queryByRole('combobox', { name: 'Task time' })).not.toBeInTheDocument();
    expect(within(listItem).getByRole('textbox', { name: 'Task time' })).toBeInTheDocument();
  });

  it('should reset to the default value from the warning modal', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        taskTime: 500,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Task time' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to simple view' })
    );

    const modal = screen.getByRole('dialog', { name: 'Incompatible setting' });

    await userEvent.click(within(modal).getByRole('button', { name: 'Reset' }));

    expect(screen.queryByRole('dialog', { name: 'Incompatible setting' })).not.toBeInTheDocument();
    expect(within(listItem).queryByRole('textbox', { name: 'Task time' })).not.toBeInTheDocument();
    expect(within(listItem).getByRole('combobox', { name: 'Task time' })).toHaveValue('1500');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );
  });

  it('should return to the original simple time input when undoing pending changes', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        overtimeDelay: 300,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Overtime delay' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to advanced view' })
    );

    const textbox = within(listItem).getByRole('textbox', { name: 'Overtime delay' });

    await userEvent.clear(textbox);
    await userEvent.type(textbox, '600');
    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(
      within(listItem).queryByRole('textbox', { name: 'Overtime delay' })
    ).not.toBeInTheDocument();
    expect(within(listItem).getByRole('combobox', { name: 'Overtime delay' })).toHaveValue('300');
  });

  it('should return to the original advanced time input when undoing pending changes', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        taskTime: 606,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Task time' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to simple view' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(within(listItem).queryByRole('combobox', { name: 'Task time' })).not.toBeInTheDocument();
    expect(within(listItem).getByRole('textbox', { name: 'Task time' })).toHaveValue('606');
  });

  it('should render a simple pomodoroSet count', async () => {
    renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: 3,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });

    expect(within(listItem).getByTestId('form-field-description')).toBeInTheDocument();
    expect(within(listItem).getByRole('combobox', { name: 'Pomodoro set' })).toBeInTheDocument();
  });

  it('should update a simple pomodoroSet count', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: 3,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });

    await userEvent.selectOptions(
      within(listItem).getByRole('combobox', { name: 'Pomodoro set' }),
      '6'
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({ pomodoroSet: 6 });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({ pomodoroSet: 4 });
  });

  it('should render a custom pomodoroSet', async () => {
    renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: ['task', 'longBreak', 'shortBreak'],
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });
    const timerButtons = within(listItem).getAllByRole('button', { name: /Edit .+ timer$/ });

    expect(within(listItem).getByTestId('form-field-description')).toBeInTheDocument();
    expect(within(listItem).getByRole('button', { name: 'Add timer' })).toBeInTheDocument();
    expect(timerButtons).toHaveLength(3);
    expect(timerButtons.at(0)).toHaveAccessibleName('1. Edit task timer');
    expect(timerButtons.at(1)).toHaveAccessibleName('2. Edit long break timer');
    expect(timerButtons.at(2)).toHaveAccessibleName('3. Edit short break timer');
  });

  it('should update a custom pomodoroSet', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: ['task', 'longBreak', 'shortBreak'],
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });

    await userEvent.click(within(listItem).getByRole('button', { name: '1. Edit task timer' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to short break timer' })
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({
      pomodoroSet: ['shortBreak', 'longBreak', 'shortBreak'],
    });

    await userEvent.click(
      within(listItem).getByRole('button', { name: '2. Edit long break timer' })
    );
    await userEvent.click(within(listItem).getByRole('menuitem', { name: 'Switch to task timer' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({
      pomodoroSet: ['shortBreak', 'task', 'shortBreak'],
    });

    await userEvent.click(
      within(listItem).getByRole('button', { name: '3. Edit short break timer' })
    );
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to long break timer' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({
      pomodoroSet: ['shortBreak', 'task', 'longBreak'],
    });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Add timer' }));
    await userEvent.click(within(listItem).getByRole('menuitem', { name: 'Add task timer' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({
      pomodoroSet: ['shortBreak', 'task', 'longBreak', 'task'],
    });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Add timer' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Add short break timer' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({
      pomodoroSet: ['shortBreak', 'task', 'longBreak', 'task', 'shortBreak'],
    });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Add timer' }));
    await userEvent.click(within(listItem).getByRole('menuitem', { name: 'Add long break timer' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({
      pomodoroSet: ['shortBreak', 'task', 'longBreak', 'task', 'shortBreak', 'longBreak'],
    });

    await userEvent.click(
      within(listItem).getByRole('button', { name: '5. Edit short break timer' })
    );
    await userEvent.click(within(listItem).getByRole('menuitem', { name: 'Remove timer' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({
      pomodoroSet: ['shortBreak', 'task', 'longBreak', 'task', 'longBreak'],
    });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(within(listItem).getByRole('menuitem', { name: /Restore default:/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenLastCalledWith({ pomodoroSet: 4 });
  });

  it('should switch from a simple set pomodoroSet count to a custom one', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: 3,
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to advanced view' })
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({
      pomodoroSet: ['task', 'shortBreak', 'task', 'shortBreak', 'task', 'longBreak'],
    });
    expect(within(listItem).getAllByRole('button', { name: /Edit .+ timer$/ })).toHaveLength(6);
  });

  it('should switch from a custom pomodoroSet to a simple count', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: ['task', 'shortBreak', 'task', 'longBreak'],
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to simple view' })
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({ pomodoroSet: 2 });
    expect(within(listItem).getByRole('combobox', { name: 'Pomodoro set' })).toBeInTheDocument();
  });

  it('should show a warning if unable to switch from a custom pomodoroSet to a simple count', async () => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: ['task', 'shortBreak', 'task'],
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to simple view' })
    );

    const modal = screen.getByRole('dialog', { name: 'Incompatible setting' });

    expect(modal).toBeInTheDocument();
    expect(
      within(modal).getByRole('heading', { name: 'Incompatible setting' })
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(
        'Your custom pomodoro set cannot be converted to a basic task count. Click "Reset" to use the default task count. Otherwise, click "Cancel" to continue using your custom pomodoro set.'
      )
    ).toBeInTheDocument();
    expect(within(modal).getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(within(modal).getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should restore the default pomodoroSet from the warning modal', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Settings,
      settings: {
        pomodoroSet: ['task', 'shortBreak', 'task'],
      },
    });

    const listItem = screen.getByRole('listitem', { name: 'Pomodoro set' });

    await userEvent.click(within(listItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(
      within(listItem).getByRole('menuitem', { name: 'Switch to simple view' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.queryByRole('dialog', { name: 'Incompatible setting' })).not.toBeInTheDocument();
    expect(appApi.updateSettings).toHaveBeenCalledWith({ pomodoroSet: 4 });
  });
});

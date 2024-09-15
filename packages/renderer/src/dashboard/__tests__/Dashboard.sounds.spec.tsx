import { DashboardRoute } from '@pomello-desktop/domain';
import { fireEvent, renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

describe('Dashboard - Sounds', () => {
  it('should render the sounds', () => {
    renderDashboard({ route: DashboardRoute.Sounds });

    expect(screen.getByRole('heading', { name: 'Sounds', level: 1 })).toBeInTheDocument();

    const taskTimerList = screen.getByRole('list', { name: 'Task timer sounds' });

    expect(taskTimerList).toBeInTheDocument();
    expect(
      within(taskTimerList).getByRole('listitem', { name: 'Start sound' })
    ).toBeInTheDocument();
    expect(within(taskTimerList).getByRole('listitem', { name: 'Tick sound' })).toBeInTheDocument();
    expect(within(taskTimerList).getByRole('listitem', { name: 'End sound' })).toBeInTheDocument();

    const shortBreakTimerList = screen.getByRole('list', { name: 'Short break timer sounds' });

    expect(shortBreakTimerList).toBeInTheDocument();
    expect(
      within(shortBreakTimerList).getByRole('listitem', { name: 'Start sound' })
    ).toBeInTheDocument();
    expect(
      within(shortBreakTimerList).getByRole('listitem', { name: 'Tick sound' })
    ).toBeInTheDocument();
    expect(
      within(shortBreakTimerList).getByRole('listitem', { name: 'End sound' })
    ).toBeInTheDocument();

    const longBreakTimerList = screen.getByRole('list', { name: 'Long break timer sounds' });

    expect(longBreakTimerList).toBeInTheDocument();
    expect(
      within(longBreakTimerList).getByRole('listitem', { name: 'Start sound' })
    ).toBeInTheDocument();
    expect(
      within(longBreakTimerList).getByRole('listitem', { name: 'Tick sound' })
    ).toBeInTheDocument();
    expect(
      within(longBreakTimerList).getByRole('listitem', { name: 'End sound' })
    ).toBeInTheDocument();
  });

  it.each([
    'Task timer start',
    'Task timer tick',
    'Task timer end',
    'Short break timer start',
    'Short break timer tick',
    'Short break timer end',
    'Long break timer start',
    'Long break timer tick',
    'Long break timer end',
  ])('should show contain the sound options and the volume slider for "%s"', async name => {
    const { userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        sounds: {
          gong1234: {
            name: 'Gong',
            path: 'path/to/gong.mp3',
          },
        },
      },
    });

    const select = screen.getByRole('combobox', { name: `${name} sound` });

    await userEvent.click(select);

    const options = within(select).getAllByRole('option');

    expect(options).toHaveLength(4);
    expect(options.at(0)).toHaveTextContent('Wind up');
    expect(options.at(1)).toHaveTextContent('Egg timer');
    expect(options.at(2)).toHaveTextContent('Ding');
    expect(options.at(3)).toHaveTextContent('Gong');

    expect(within(select).getByRole('group', { name: 'Custom sounds' })).toBeInTheDocument();

    expect(screen.getByRole('slider', { name: `${name} volume` }));
  });

  it('should be able to update a sound', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        taskTimerTickSound: 'egg-timer',
      },
    });

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Task timer tick sound' }),
      'Ding'
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(screen.getByRole('combobox', { name: 'Task timer tick sound' })).toHaveDisplayValue(
      'Egg timer'
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Task timer tick sound' }),
      'Wind up'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({ taskTimerTickSound: 'wind-up' });
  });

  it('should be able to update the volume', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        shortBreakTimerEndVol: 0.8,
      },
    });

    fireEvent.input(screen.getByRole('slider', { name: 'Short break timer end volume' }), {
      target: {
        value: '0.2',
      },
    });

    expect(screen.getByRole('slider', { name: 'Short break timer end volume' })).toHaveValue('0.2');

    expect(screen.getByRole('status')).toHaveTextContent(
      'Your pending changes have not been saved yet.'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo changes' }));

    expect(screen.getByRole('slider', { name: 'Short break timer end volume' })).toHaveValue('0.8');

    fireEvent.input(screen.getByRole('slider', { name: 'Short break timer end volume' }), {
      target: {
        value: '.2',
      },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({ shortBreakTimerEndVol: 0.2 });
  });

  it('should be able to restore the default sound', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Sounds,
      settings: {
        longBreakTimerTickSound: 'ding',
        longBreakTimerTickVol: 0.5,
      },
    });

    const longBreakList = screen.getByRole('list', { name: 'Long break timer sounds' });
    const tickItem = within(longBreakList).getByRole('listitem', { name: 'Tick sound' });

    await userEvent.click(within(tickItem).getByRole('button', { name: 'Show more options' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Restore default: Egg timer' }));

    expect(
      screen.getByRole('combobox', { name: 'Long break timer tick sound' })
    ).toHaveDisplayValue('Egg timer');
    expect(screen.getByRole('slider', { name: 'Long break timer tick volume' })).toHaveValue('1');

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(appApi.updateSettings).toHaveBeenCalledWith({
      longBreakTimerTickSound: 'egg-timer',
      longBreakTimerTickVol: 1,
    });
  });
});

import { DashboardRoute } from '@pomello-desktop/domain';
import { renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

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
    'task timer start sound',
    'task timer tick sound',
    'task timer end sound',
    'short break timer start sound',
    'short break timer tick sound',
    'short break timer end sound',
    'long break timer start sound',
    'long break timer tick sound',
    'long break timer end sound',
  ])('should show contain the default sound options for the %s', async name => {
    const { userEvent } = renderDashboard({ route: DashboardRoute.Sounds });

    await userEvent.click(screen.getByRole('combobox', { name: new RegExp(name, 'i') }));

    const options = screen.getAllByRole('option');

    expect(options.at(0)).toHaveTextContent('Wind up');
    expect(options.at(1)).toHaveTextContent('Egg timer');
    expect(options.at(2)).toHaveTextContent('Ding');
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
});

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
});

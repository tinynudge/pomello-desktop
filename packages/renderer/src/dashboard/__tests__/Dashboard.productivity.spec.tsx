import { DashboardRoute } from '@pomello-desktop/domain';
import { renderDashboard, screen, within } from '../__fixtures__/renderDashboard';

describe('Dashboard - Productivity', () => {
  it('should render the productivity view', () => {
    renderDashboard({ route: DashboardRoute.Productivity });

    expect(screen.getByRole('heading', { name: 'Productivity', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export data' })).toBeInTheDocument();

    const todayRegion = screen.getByRole('region', { name: 'Today' });
    expect(within(todayRegion).getByRole('heading', { name: 'Today' })).toBeInTheDocument();

    const thisWeekRegion = screen.getByRole('region', { name: /This Week:/ });
    expect(within(thisWeekRegion).getByRole('heading', { name: /This Week:/ })).toBeInTheDocument();

    const historyRegion = screen.getByRole('region', { name: 'Productivity History' });
    expect(
      within(historyRegion).getByRole('heading', { name: 'Productivity History' })
    ).toBeInTheDocument();
  });

  it('should show the correct week start date in "This Week" panel', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-28T12:00:00Z')); // Wednesday, January 28, 2026

    renderDashboard({ route: DashboardRoute.Productivity });

    const thisWeekRegion = screen.getByRole('region', { name: 'This Week: January 25' });
    expect(
      within(thisWeekRegion).getByRole('heading', { name: 'This Week: January 25' })
    ).toBeInTheDocument();

    vi.useRealTimers();
  });
});

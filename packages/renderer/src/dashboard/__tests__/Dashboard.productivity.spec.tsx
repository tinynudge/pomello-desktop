import {
  generateBreakTrackingEvent,
  generateNoteTrackingEvent,
  generateOverBreakTrackingEvent,
  generateOverTaskTrackingEvent,
  generatePauseTrackingEvent,
  generateTaskTrackingEvent,
  generateTrackingEvents,
  generateVoidTrackingEvent,
} from '@/app/__fixtures__/generateTrackingEvents';
import { DashboardRoute } from '@pomello-desktop/domain';
import { HttpResponse } from 'msw';
import { renderDashboard, screen, waitForElementToBeRemoved, within } from '../__fixtures__/renderDashboard';

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
    expect(within(historyRegion).getByRole('heading', { name: 'Productivity History' })).toBeInTheDocument();
  });

  it('should show the correct week start date in "This Week" panel', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-28T12:00:00Z')); // Wednesday, January 28, 2026

    renderDashboard({ route: DashboardRoute.Productivity });

    const thisWeekRegion = screen.getByRole('region', { name: 'This Week: January 25' });
    expect(within(thisWeekRegion).getByRole('heading', { name: 'This Week: January 25' })).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should show a login view when not logged in', () => {
    renderDashboard({
      route: DashboardRoute.Productivity,
      pomelloConfig: {
        user: undefined,
      },
    });

    const loginView = screen.getByTestId('login-view');

    expect(screen.queryByRole('heading', { name: 'Productivity' })).not.toBeInTheDocument();
    expect(within(loginView).getByText('You must be logged in to Pomello to view this.')).toBeInTheDocument();
    expect(within(loginView).getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(
      within(loginView).getByText((_content, element) => element?.textContent === 'No account? Sign up for free.')
    ).toBeInTheDocument();
  });

  it('should open the login page when clicking the log in button', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Productivity,
      pomelloConfig: {
        user: undefined,
      },
    });

    const loginView = screen.getByTestId('login-view');

    await userEvent.click(within(loginView).getByRole('button', { name: 'Log in' }));

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      type: 'pomello',
      action: 'authorize',
    });
  });

  it('should open the sign up page when clicking the sign up button', async () => {
    const { appApi, userEvent } = renderDashboard({
      route: DashboardRoute.Productivity,
      pomelloConfig: {
        user: undefined,
      },
    });

    const loginView = screen.getByTestId('login-view');

    await userEvent.click(within(loginView).getByRole('button', { name: 'Sign up' }));

    expect(appApi.showAuthWindow).toHaveBeenCalledWith({
      type: 'pomello',
      action: 'register',
    });
  });

  it('should show the productivity view when logging in', async () => {
    const { pomelloConfig } = renderDashboard({
      route: DashboardRoute.Productivity,
      pomelloConfig: {
        user: undefined,
      },
    });

    expect(screen.queryByRole('heading', { name: 'Productivity' })).not.toBeInTheDocument();

    pomelloConfig.set('user', {
      email: 'thomas@tester.com',
      name: 'Thomas Tester',
      timezone: 'America/New_York',
      type: 'premium',
    });

    expect(screen.getByRole('heading', { name: 'Productivity', level: 1 })).toBeInTheDocument();
  });

  describe('Today Panel', () => {
    it("should show loading state while fetching today's events", async () => {
      const fetchEventsPromise = Promise.withResolvers<void>();

      renderDashboard({
        pomelloApi: {
          fetchEvents: async () => {
            await fetchEventsPromise.promise;

            return HttpResponse.json({ data: [] });
          },
        },
        route: DashboardRoute.Productivity,
      });

      const todayRegion = screen.getByRole('region', { name: 'Today' });

      expect(within(todayRegion).getByRole('status', { name: 'Loading' })).toBeInTheDocument();

      fetchEventsPromise.resolve();

      await waitForElementToBeRemoved(() => within(todayRegion).queryByRole('status', { name: 'Loading' }));
    });

    it('should show stats when there are no events', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      const todayRegion = screen.getByRole('region', { name: 'Today' });

      await waitForElementToBeRemoved(() => within(todayRegion).queryByRole('status', { name: 'Loading' }));

      expect(within(todayRegion).getByRole('definition', { name: 'Pomodoros' })).toHaveTextContent('0');
      expect(within(todayRegion).getByRole('definition', { name: 'Task Time' })).toHaveTextContent('0:00');
      expect(within(todayRegion).getByRole('definition', { name: 'Break Time' })).toHaveTextContent('0:00');
      expect(within(todayRegion).getByRole('definition', { name: 'Voided Pomodoros' })).toHaveTextContent('0');
    });

    it('should handle errors when fetching events', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: () => HttpResponse.error(),
        },
        route: DashboardRoute.Productivity,
      });

      const todayRegion = screen.getByRole('region', { name: 'Today' });

      await waitForElementToBeRemoved(() => within(todayRegion).queryByRole('status', { name: 'Loading' }));

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
    });

    it('should show a summary of productivity stats', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              meta: {
                duration: 1500,
                pomodoros: 1,
              },
              children: [
                generateOverTaskTrackingEvent({ meta: { duration: 180 } }),
                generatePauseTrackingEvent({ meta: { duration: 120 } }),
              ],
            }),
            generateNoteTrackingEvent(),
            generateTaskTrackingEvent({
              meta: {
                duration: 1500,
                pomodoros: 0.8,
              },
            }),
            generateBreakTrackingEvent({
              meta: {
                duration: 300,
              },
            }),
            generateBreakTrackingEvent({
              meta: {
                duration: 900,
              },
              children: [generateOverBreakTrackingEvent({ meta: { duration: 120 } })],
            }),
            generateVoidTrackingEvent({
              meta: {
                voidedPomodoros: 1,
              },
            }),
            generateVoidTrackingEvent({
              meta: {
                voidedPomodoros: 1,
              },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      const todayRegion = screen.getByRole('region', { name: 'Today' });

      await waitForElementToBeRemoved(() => within(todayRegion).queryByRole('status', { name: 'Loading' }));

      expect(within(todayRegion).getByRole('definition', { name: 'Pomodoros' })).toHaveTextContent('1.80');
      expect(within(todayRegion).getByRole('definition', { name: 'Task Time' })).toHaveTextContent('0:50');
      expect(within(todayRegion).getByRole('definition', { name: 'Break Time' })).toHaveTextContent('0:20');
      expect(within(todayRegion).getByRole('definition', { name: 'Voided Pomodoros' })).toHaveTextContent('2');
    });
  });
});

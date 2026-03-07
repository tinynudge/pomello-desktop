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

    const thisWeekRegion = screen.getByRole('region', { name: /Week of/ });
    expect(within(thisWeekRegion).getByRole('heading', { name: /Week of/ })).toBeInTheDocument();

    const historyRegion = screen.getByRole('region', { name: 'Productivity History' });
    expect(within(historyRegion).getByRole('heading', { name: 'Productivity History' })).toBeInTheDocument();
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

      expect(within(todayRegion).getByRole('definition', { name: 'Pomodoros' })).toHaveTextContent('1.8');
      expect(within(todayRegion).getByRole('definition', { name: 'Task Time' })).toHaveTextContent('0:50');
      expect(within(todayRegion).getByRole('definition', { name: 'Break Time' })).toHaveTextContent('0:20');
      expect(within(todayRegion).getByRole('definition', { name: 'Voided Pomodoros' })).toHaveTextContent('2');
    });
  });

  describe('Week of Panel', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026
    });

    it('should show the correct week start date in "This Week" panel', () => {
      renderDashboard({ route: DashboardRoute.Productivity });

      const thisWeekRegion = screen.getByRole('region', { name: 'Week of January 25' });
      expect(within(thisWeekRegion).getByRole('heading', { name: 'Week of January 25' })).toBeInTheDocument();
    });

    it('should show loading state while fetching weekly events', async () => {
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

      const weekRegion = screen.getByRole('region', { name: /Week of/ });

      expect(within(weekRegion).getByRole('status', { name: 'Loading' })).toBeInTheDocument();

      fetchEventsPromise.resolve();

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));
    });

    it('should show stats when there are no events', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      const weekRegion = screen.getByRole('region', { name: /Week of/ });

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));

      expect(within(weekRegion).getByRole('definition', { name: 'Total Pomodoros' })).toHaveTextContent('0');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Pomodoros' })).toHaveTextContent('0');
      expect(within(weekRegion).getByRole('definition', { name: 'Total Task Time' })).toHaveTextContent('0:00');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Task Time' })).toHaveTextContent('0:00');
    });

    it('should handle errors when fetching weekly events', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: ({ request }) => {
            const url = new URL(request.url);

            const startDate = url.searchParams.get('startDate');
            const endDate = url.searchParams.get('endDate');

            if (startDate === endDate) {
              // Don't return an error when fetching events for the Today panel
              return HttpResponse.json(generateTrackingEvents());
            }

            return HttpResponse.error();
          },
        },
        route: DashboardRoute.Productivity,
      });

      const weekRegion = screen.getByRole('region', { name: /Week of/ });

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
    });

    it('should show a summary of weekly productivity stats', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            // Day 1 events (Monday)
            generateTaskTrackingEvent({
              startTime: '2026-01-26T10:00:00',
              meta: {
                duration: 1500,
                pomodoros: 1,
              },
            }),
            generateTaskTrackingEvent({
              startTime: '2026-01-26T11:00:00',
              meta: {
                duration: 1500,
                pomodoros: 1,
              },
            }),
            // Day 2 events (Tuesday)
            generateTaskTrackingEvent({
              startTime: '2026-01-27T10:00:00',
              meta: {
                duration: 3000,
                pomodoros: 2,
              },
            }),
            // Day 3 events (Wednesday)
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: {
                duration: 1500,
                pomodoros: 1,
              },
            }),
            // Non-task events should be ignored
            generateBreakTrackingEvent({
              startTime: '2026-01-28T10:30:00',
              meta: { duration: 300 },
            }),
            generateNoteTrackingEvent({
              startTime: '2026-01-28T11:00:00',
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      const weekRegion = screen.getByRole('region', { name: /Week of/ });

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));

      // Total: 1 + 1 + 2 + 1 = 5 pomodoros
      expect(within(weekRegion).getByRole('definition', { name: 'Total Pomodoros' })).toHaveTextContent('5');
      // Average: 5 pomodoros / 3 active days = 1.67 (rounded)
      expect(within(weekRegion).getByRole('definition', { name: 'Average Pomodoros' })).toHaveTextContent('1.67');
      // Total time: 1500 + 1500 + 3000 + 1500 = 7500 seconds = 125 minutes = 2:05
      expect(within(weekRegion).getByRole('definition', { name: 'Total Task Time' })).toHaveTextContent('2:05');
      // Average time: 7500 / 3 = 2500 seconds = 41.67 minutes = 0:41
      expect(within(weekRegion).getByRole('definition', { name: 'Average Task Time' })).toHaveTextContent('0:41');
    });

    it('should show stats with single active day', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: {
                duration: 3000,
                pomodoros: 2,
              },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      const weekRegion = screen.getByRole('region', { name: /Week of/ });

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));

      // With single day, total equals average
      expect(within(weekRegion).getByRole('definition', { name: 'Total Pomodoros' })).toHaveTextContent('2');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Pomodoros' })).toHaveTextContent('2');
      expect(within(weekRegion).getByRole('definition', { name: 'Total Task Time' })).toHaveTextContent('0:50');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Task Time' })).toHaveTextContent('0:50');
    });

    it('should navigate to previous week when clicking Previous week button', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      expect(screen.getByRole('region', { name: 'Week of January 25' })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

      expect(screen.getByRole('region', { name: 'Week of January 18' })).toBeInTheDocument();
    });

    it('should navigate to next week when clicking Next week button', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

      expect(screen.getByRole('region', { name: 'Week of January 18' })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Next week' }));

      expect(screen.getByRole('region', { name: 'Week of January 25' })).toBeInTheDocument();
    });

    it('should return to current week when clicking This week button', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));
      await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

      expect(screen.getByRole('region', { name: 'Week of January 11' })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'This week' }));

      expect(screen.getByRole('region', { name: 'Week of January 25' })).toBeInTheDocument();
    });

    it('should disable This week and Next week buttons when viewing current week', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      expect(screen.getByRole('button', { name: 'Previous week' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'This week' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Next week' })).toBeDisabled();
    });

    it('should enable This week and Next week buttons when viewing past week', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

      expect(screen.getByRole('button', { name: 'Previous week' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'This week' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Next week' })).toBeEnabled();
    });

    it('should handle fractional pomodoros correctly', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: {
                duration: 750,
                pomodoros: 0.5,
              },
            }),
            generateTaskTrackingEvent({
              startTime: '2026-01-28T11:00:00',
              meta: {
                duration: 375,
                pomodoros: 0.25,
              },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      const weekRegion = screen.getByRole('region', { name: 'Week of January 25' });

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));

      expect(within(weekRegion).getByRole('definition', { name: 'Total Pomodoros' })).toHaveTextContent('0.75');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Pomodoros' })).toHaveTextContent('0.75');
    });

    it('should round pomodoro numbers to at most 2 decimal places', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-26T10:00:00',
              meta: { duration: 500, pomodoros: 0.99 / 3 },
            }),
            generateTaskTrackingEvent({
              startTime: '2026-01-27T10:00:00',
              meta: { duration: 500, pomodoros: 1 / 3 },
            }),
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 500, pomodoros: 1 / 3 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      const weekRegion = screen.getByRole('region', { name: 'Week of January 25' });

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));

      expect(within(weekRegion).getByRole('definition', { name: 'Total Pomodoros' })).toHaveTextContent('1');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Pomodoros' })).toHaveTextContent('0.33');
    });

    it('should calculate averages across multiple active days correctly', async () => {
      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            // Multiple events on same day should count as one active day
            generateTaskTrackingEvent({
              startTime: '2026-01-26T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            }),
            generateTaskTrackingEvent({
              startTime: '2026-01-26T11:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            }),
            generateTaskTrackingEvent({
              startTime: '2026-01-26T14:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            }),
            // Second active day
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      const weekRegion = screen.getByRole('region', { name: 'Week of January 25' });

      await waitForElementToBeRemoved(() => within(weekRegion).queryByRole('status', { name: 'Loading' }));

      // Total: 4 pomodoros, Average: 4/2 = 2 pomodoros per active day
      expect(within(weekRegion).getByRole('definition', { name: 'Total Pomodoros' })).toHaveTextContent('4');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Pomodoros' })).toHaveTextContent('2');
      // Total time: 6000 seconds = 100 minutes = 1:40, Average: 3000 seconds = 50 minutes = 0:50
      expect(within(weekRegion).getByRole('definition', { name: 'Total Task Time' })).toHaveTextContent('1:40');
      expect(within(weekRegion).getByRole('definition', { name: 'Average Task Time' })).toHaveTextContent('0:50');
    });
  });

  describe('History Panel', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should show the correct tooltips to change the date range', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.hover(within(historyRegion).getByRole('button', { name: 'Previous week' }));

      expect(screen.getByRole('tooltip', { name: 'Previous week' })).toBeInTheDocument();

      await userEvent.unhover(within(historyRegion).getByRole('button', { name: 'Previous week' }));

      expect(screen.queryByRole('tooltip', { name: 'Previous week' })).not.toBeInTheDocument();

      await userEvent.hover(within(historyRegion).getByRole('button', { name: 'This week' }));

      expect(screen.getByRole('tooltip', { name: 'This week' })).toBeInTheDocument();

      await userEvent.unhover(within(historyRegion).getByRole('button', { name: 'This week' }));

      expect(screen.queryByRole('tooltip', { name: 'This week' })).not.toBeInTheDocument();

      await userEvent.hover(within(historyRegion).getByRole('button', { name: 'Next week' }));

      expect(screen.getByRole('tooltip', { name: 'Next week' })).toBeInTheDocument();

      await userEvent.unhover(within(historyRegion).getByRole('button', { name: 'Next week' }));

      expect(screen.queryByRole('tooltip', { name: 'Next week' })).not.toBeInTheDocument();
    });

    it('should show and hide the Filters tooltip', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.hover(within(historyRegion).getByRole('button', { name: 'Filters' }));

      expect(screen.getByRole('tooltip', { name: 'Filters' })).toBeInTheDocument();

      await userEvent.unhover(within(historyRegion).getByRole('button', { name: 'Filters' }));

      expect(screen.queryByRole('tooltip', { name: 'Filters' })).not.toBeInTheDocument();
    });

    it('should display a date range within same month', () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent('January 25\u201331, 2026');
    });

    it('should display a date range spanning different months', () => {
      vi.setSystemTime(new Date('2025-12-02T12:00:00'));

      renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent(
        'November 30\u2013December 6, 2025'
      );
    });

    it('should display a date range spanning different years', () => {
      vi.setSystemTime(new Date('2026-01-03T12:00:00'));

      renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent(
        'December 28, 2025\u2013January 3, 2026'
      );
    });

    it('should update the heading when navigating to previous week', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent('January 25\u201331, 2026');

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Previous week' }));

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent('January 18\u201324, 2026');
    });

    it('should update the heading when navigating to next week', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Previous week' }));

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent('January 18\u201324, 2026');

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Next week' }));

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent('January 25\u201331, 2026');
    });

    it('should update the heading when clicking This week', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Previous week' }));
      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Previous week' }));

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent('January 11\u201317, 2026');

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'This week' }));

      expect(within(historyRegion).getByRole('heading', { level: 3 })).toHaveTextContent('January 25\u201331, 2026');
    });

    it('should open filters modal', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Filters' }));

      const dialog = screen.getByRole('dialog', { name: 'Chart filters' });

      expect(dialog).toBeInTheDocument();

      const dayButtons = within(dialog).getAllByRole('button', { pressed: true });

      expect(dayButtons).toHaveLength(7);
      expect(dayButtons[0]).toHaveAccessibleName('Sunday');
      expect(dayButtons[1]).toHaveAccessibleName('Monday');
      expect(dayButtons[2]).toHaveAccessibleName('Tuesday');
      expect(dayButtons[3]).toHaveAccessibleName('Wednesday');
      expect(dayButtons[4]).toHaveAccessibleName('Thursday');
      expect(dayButtons[5]).toHaveAccessibleName('Friday');
      expect(dayButtons[6]).toHaveAccessibleName('Saturday');

      expect(
        within(dialog).getByText(
          'Disabled days are hidden from the chart by default. However, if a disabled date has recorded events, it will become visible.'
        )
      ).toBeInTheDocument();
    });

    it('should be able to update the chart days', async () => {
      const { appApi, userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        settings: {
          productivityChartDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        },
      });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Filters' }));

      const dialog = screen.getByRole('dialog', { name: 'Chart filters' });
      const mondayButton = within(dialog).getByRole('button', { name: 'Monday' });

      expect(mondayButton).toHaveAttribute('aria-pressed', 'true');

      await userEvent.click(mondayButton);

      expect(mondayButton).toHaveAttribute('aria-pressed', 'false');

      await userEvent.click(within(dialog).getByRole('button', { name: 'Done' }));

      expect(appApi.updateSetting).toHaveBeenCalledWith(
        'productivityChartDays',
        expect.arrayContaining(['Su', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
      );
      expect(appApi.updateSetting).toHaveBeenCalledWith('productivityChartDays', expect.not.arrayContaining(['Mo']));
    });

    it('should not update the settings if the chart days remain unchanged', async () => {
      const { appApi, userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        settings: {
          productivityChartDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        },
      });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Filters' }));

      const dialog = screen.getByRole('dialog', { name: 'Chart filters' });
      const mondayButton = within(dialog).getByRole('button', { name: 'Monday' });

      await userEvent.click(mondayButton);
      await userEvent.click(mondayButton);

      await userEvent.click(within(dialog).getByRole('button', { name: 'Done' }));

      expect(appApi.updateSetting).not.toHaveBeenCalled();
    });

    it('should persist chart days when reopening the filters modal', async () => {
      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        settings: {
          productivityChartDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        },
      });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Filters' }));

      const dialog = screen.getByRole('dialog', { name: 'Chart filters' });
      const sundayButton = within(dialog).getByRole('button', { name: 'Sunday' });

      await userEvent.click(sundayButton);
      expect(sundayButton).toHaveAttribute('aria-pressed', 'false');

      await userEvent.click(within(dialog).getByRole('button', { name: 'Done' }));

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Filters' }));

      const reopenedDialog = screen.getByRole('dialog', { name: 'Chart filters' });
      const updatedSundayButton = within(reopenedDialog).getByRole('button', { name: 'Sunday' });

      expect(updatedSundayButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should render the chart days with the correct initial settings', async () => {
      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        settings: {
          productivityChartDays: ['Mo', 'We', 'Fr'],
        },
      });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(within(historyRegion).getByRole('button', { name: 'Filters' }));

      const dialog = screen.getByRole('dialog', { name: 'Chart filters' });

      expect(within(dialog).getByRole('button', { name: 'Sunday' })).toHaveAttribute('aria-pressed', 'false');
      expect(within(dialog).getByRole('button', { name: 'Monday' })).toHaveAttribute('aria-pressed', 'true');
      expect(within(dialog).getByRole('button', { name: 'Tuesday' })).toHaveAttribute('aria-pressed', 'false');
      expect(within(dialog).getByRole('button', { name: 'Wednesday' })).toHaveAttribute('aria-pressed', 'true');
      expect(within(dialog).getByRole('button', { name: 'Thursday' })).toHaveAttribute('aria-pressed', 'false');
      expect(within(dialog).getByRole('button', { name: 'Friday' })).toHaveAttribute('aria-pressed', 'true');
      expect(within(dialog).getByRole('button', { name: 'Saturday' })).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Export data', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));
    });

    it('should open the export modal when clicking the Export data button', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByLabelText('Start date')).toBeInTheDocument();
      expect(within(dialog).getByLabelText('End date')).toBeInTheDocument();
      expect(within(dialog).getByLabelText('Format')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Export' })).toBeEnabled();
      expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should close the modal when clicking Cancel', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('dialog', { name: 'Export data' })).not.toBeInTheDocument();
    });

    it('should show a validation error when start date is empty', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.clear(within(dialog).getByLabelText('Start date'));

      expect(within(dialog).getByText('A valid date is required')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Export' })).toBeDisabled();
    });

    it('should show a validation error when end date is empty', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.clear(within(dialog).getByLabelText('End date'));

      expect(within(dialog).getByText('A valid date is required')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Export' })).toBeDisabled();
    });

    it('should show a validation error when start date is after end date', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.clear(within(dialog).getByLabelText('Start date'));
      await userEvent.type(within(dialog).getByLabelText('Start date'), '2026-01-29');

      expect(within(dialog).getByText('Start date must be before end date')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Export' })).toBeDisabled();
    });

    it('should show a validation error when end date is in the future', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.clear(within(dialog).getByLabelText('End date'));
      await userEvent.type(within(dialog).getByLabelText('End date'), '2026-02-01');

      expect(within(dialog).getByText('End date cannot be in the future')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Export' })).toBeDisabled();
    });

    it('should show loading state while exporting', async () => {
      const fetchEventsPromise = Promise.withResolvers<void>();

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: async () => {
            await fetchEventsPromise.promise;

            return HttpResponse.json(generateTrackingEvents(generateTaskTrackingEvent()));
          },
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));

      expect(within(dialog).getByRole('button', { name: 'Exporting...' })).toBeDisabled();

      fetchEventsPromise.resolve();
    });

    it('should show success state after exporting data', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));

      expect(within(dialog).getByText('Your exported data is ready.')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('should show no-data state when there are no events for the date range', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));

      expect(within(dialog).getByText('No events found for the selected date range.')).toBeInTheDocument();
      expect(within(dialog).getByText('Please adjust the dates and try again.')).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });

    it('should show error state when export fails', async () => {
      let requestCount = 0;

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: () => {
            requestCount += 1;

            // First requests are for Today/Week panels; fail on the export request
            if (requestCount <= 2) {
              return HttpResponse.json(generateTrackingEvents());
            }

            return HttpResponse.error();
          },
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));

      expect(within(dialog).getByText('Something went wrong. Unable to export data.')).toBeInTheDocument();
      expect(within(dialog).queryByRole('button', { name: 'Export' })).not.toBeInTheDocument();
      expect(within(dialog).queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    });

    it('should save the JSON file when clicking Save after a successful export', async () => {
      const { appApi, userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.selectOptions(within(dialog).getByLabelText('Format'), 'json');

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));
      await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

      expect(appApi.showSaveDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultPath: expect.stringMatching(/^pomello-export-2026-01-21-2026-01-28\.json$/),
          filters: [{ name: 'JSON', extensions: ['json'] }],
        })
      );
      expect(appApi.writeFile).toHaveBeenCalledWith(expect.objectContaining({ filePath: '/mock/path/to/export.csv' }));
    });

    it('should save the CSV file when clicking Save after a successful export', async () => {
      const { appApi, userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.selectOptions(within(dialog).getByLabelText('Format'), 'csv');

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));
      await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

      expect(appApi.showSaveDialog).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultPath: expect.stringMatching(/^pomello-export-2026-01-21-2026-01-28\.csv$/),
          filters: [{ name: 'CSV', extensions: ['csv'] }],
        })
      );
      expect(appApi.writeFile).toHaveBeenCalledWith(expect.objectContaining({ filePath: '/mock/path/to/export.csv' }));
    });

    it('should write the correct JSON content when saving', async () => {
      const startTime = '2026-01-25T14:30:00.000Z';
      const serviceId = 'task-abc-123';

      const { appApi, userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent({ serviceId, startTime })),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.selectOptions(within(dialog).getByLabelText('Format'), 'json');

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));
      await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

      const date = new Date(startTime);

      const expectedContent = JSON.stringify(
        [
          {
            taskName: serviceId,
            parentTaskName: null,
            service: 'trello',
            serviceId,
            parentServiceId: null,
            type: 'Task',
            time: '0:25',
            duration: 1500,
            allottedTime: 1500,
            pomodoros: 1,
            date: date.toLocaleDateString(),
            startTime: date.toLocaleTimeString(),
          },
        ],
        null,
        2
      );

      expect(appApi.writeFile).toHaveBeenCalledWith(expect.objectContaining({ content: expectedContent }));
    });

    it('should write the correct CSV content when saving', async () => {
      const startTime = '2026-01-25T14:30:00.000Z';
      const serviceId = 'task-abc-123';

      const { appApi, userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent({ serviceId, startTime })),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.selectOptions(within(dialog).getByLabelText('Format'), 'csv');

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));
      await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

      const date = new Date(startTime);

      const expectedContent = [
        'Task Name,Parent Task Name,Service,Service ID,Parent Service ID,Type,Time,Duration,Allotted Time,Pomodoros,Date,Start Time',
        `${serviceId},,trello,${serviceId},,Task,0:25,1500,1500,1,${date.toLocaleDateString()},${date.toLocaleTimeString()}`,
      ].join('\n');

      expect(appApi.writeFile).toHaveBeenCalledWith(expect.objectContaining({ content: expectedContent }));
    });

    it('should not write the file if the save dialog is cancelled', async () => {
      const { appApi, userEvent } = renderDashboard({
        appApi: {
          showSaveDialog: () => Promise.resolve(null),
        },
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));
      await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));

      expect(appApi.writeFile).not.toHaveBeenCalled();
    });

    it('should return to the form when clicking Back from the no-data state', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));
      await userEvent.click(within(dialog).getByRole('button', { name: 'Back' }));

      expect(within(dialog).getByLabelText('Start date')).toBeInTheDocument();
      expect(within(dialog).getByLabelText('End date')).toBeInTheDocument();
      expect(within(dialog).queryByText('No events found for the selected date range.')).not.toBeInTheDocument();
    });

    it('should reset to the form when the modal is closed and reopened', async () => {
      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const dialog = screen.getByRole('dialog', { name: 'Export data' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Export' }));
      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
      await userEvent.click(screen.getByRole('button', { name: 'Export data' }));

      const reopenedDialog = screen.getByRole('dialog', { name: 'Export data' });

      expect(within(reopenedDialog).getByLabelText('Start date')).toBeInTheDocument();
      expect(within(reopenedDialog).queryByText('Your exported data is ready.')).not.toBeInTheDocument();
    });
  });
});

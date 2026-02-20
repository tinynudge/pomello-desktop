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
import { setStoredView } from '../views/ProductivityView/storedView';

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

      expect(within(todayRegion).getByRole('definition', { name: 'Pomodoros' })).toHaveTextContent('1.80');
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

    it('should toggle between overview and timeline views', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const overviewButton = screen.getByRole('button', { name: 'Overview' });
      const timelineButton = screen.getByRole('button', { name: 'Timeline' });

      await userEvent.click(timelineButton);

      expect(overviewButton).toHaveAttribute('aria-pressed', 'false');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'true');

      await userEvent.click(overviewButton);

      expect(overviewButton).toHaveAttribute('aria-pressed', 'true');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should restore timeline view from localStorage on mount', () => {
      setStoredView('timeline');

      renderDashboard({ route: DashboardRoute.Productivity });

      const overviewButton = screen.getByRole('button', { name: 'Overview' });
      const timelineButton = screen.getByRole('button', { name: 'Timeline' });

      expect(overviewButton).toHaveAttribute('aria-pressed', 'false');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should restore overview view from localStorage on mount', () => {
      setStoredView('overview');

      renderDashboard({ route: DashboardRoute.Productivity });

      const overviewButton = screen.getByRole('button', { name: 'Overview' });
      const timelineButton = screen.getByRole('button', { name: 'Timeline' });

      expect(overviewButton).toHaveAttribute('aria-pressed', 'true');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should default to overview view when localStorage contains invalid value', () => {
      setStoredView('invalid-value' as 'overview');

      renderDashboard({ route: DashboardRoute.Productivity });

      const overviewButton = screen.getByRole('button', { name: 'Overview' });
      const timelineButton = screen.getByRole('button', { name: 'Timeline' });

      expect(overviewButton).toHaveAttribute('aria-pressed', 'true');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should show task and void legend items in overview view', () => {
      renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      expect(within(historyRegion).getByText('Task')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Void')).toBeInTheDocument();

      expect(within(historyRegion).queryByText('Task (Over)')).not.toBeInTheDocument();
      expect(within(historyRegion).queryByText('Pause')).not.toBeInTheDocument();
      expect(within(historyRegion).queryByText('Short break')).not.toBeInTheDocument();
      expect(within(historyRegion).queryByText('Short break (Over)')).not.toBeInTheDocument();
      expect(within(historyRegion).queryByText('Long break')).not.toBeInTheDocument();
      expect(within(historyRegion).queryByText('Long break (Over)')).not.toBeInTheDocument();
    });

    it('should show all legend items in timeline view', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));

      expect(within(historyRegion).getByText('Task')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Task (Over)')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Void')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Pause')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Short break')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Short break (Over)')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Long break')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Long break (Over)')).toBeInTheDocument();
    });

    it('should show x-axis dates based on productivityChartDays setting', () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      renderDashboard({
        route: DashboardRoute.Productivity,
        settings: {
          productivityChartDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        },
      });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      // Week of Jan 25-31 should show all 7 days
      expect(within(historyRegion).getByText('Jan 25')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Jan 26')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Jan 27')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Jan 28')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Jan 29')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Jan 30')).toBeInTheDocument();
      expect(within(historyRegion).getByText('Jan 31')).toBeInTheDocument();
    });

    it('should only show enabled days in x-axis', () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      renderDashboard({
        route: DashboardRoute.Productivity,
        settings: {
          productivityChartDays: ['Mo', 'We', 'Fr'],
        },
      });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      // Only Monday, Wednesday, Friday should show
      expect(within(historyRegion).getByText('Jan 26')).toBeInTheDocument(); // Monday
      expect(within(historyRegion).getByText('Jan 28')).toBeInTheDocument(); // Wednesday
      expect(within(historyRegion).getByText('Jan 30')).toBeInTheDocument(); // Friday

      // Other days should not show
      expect(within(historyRegion).queryByText('Jan 25')).not.toBeInTheDocument(); // Sunday
      expect(within(historyRegion).queryByText('Jan 27')).not.toBeInTheDocument(); // Tuesday
      expect(within(historyRegion).queryByText('Jan 29')).not.toBeInTheDocument(); // Thursday
      expect(within(historyRegion).queryByText('Jan 31')).not.toBeInTheDocument(); // Saturday
    });

    it('should show disabled day in x-axis if it has events', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            // Event on Tuesday (which is disabled)
            generateTaskTrackingEvent({
              startTime: '2026-01-27T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
        settings: {
          productivityChartDays: ['Mo', 'We', 'Fr'], // Tuesday is disabled
        },
      });

      const historyRegion = screen.getByRole('region', { name: 'Productivity History' });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      // Tuesday should show because it has events
      expect(within(historyRegion).getByText('Jan 27')).toBeInTheDocument(); // Tuesday

      // Other enabled days should also show
      expect(within(historyRegion).getByText('Jan 26')).toBeInTheDocument(); // Monday
      expect(within(historyRegion).getByText('Jan 28')).toBeInTheDocument(); // Wednesday
      expect(within(historyRegion).getByText('Jan 30')).toBeInTheDocument(); // Friday
    });

    it('should show the default 10 ticks on the y-axis in overview view', () => {
      renderDashboard({ route: DashboardRoute.Productivity });

      const yAxis = screen.getByTestId('productivity-chart-y-axis');

      expect(within(yAxis).getByText('0')).toBeInTheDocument();
      expect(within(yAxis).getByText('1')).toBeInTheDocument();
      expect(within(yAxis).getByText('2')).toBeInTheDocument();
      expect(within(yAxis).getByText('3')).toBeInTheDocument();
      expect(within(yAxis).getByText('4')).toBeInTheDocument();
      expect(within(yAxis).getByText('5')).toBeInTheDocument();
      expect(within(yAxis).getByText('6')).toBeInTheDocument();
      expect(within(yAxis).getByText('7')).toBeInTheDocument();
      expect(within(yAxis).getByText('8')).toBeInTheDocument();
      expect(within(yAxis).getByText('9')).toBeInTheDocument();
      expect(within(yAxis).queryByText('10')).toBeInTheDocument();
    });

    it('should adjust y-axis ticks based on the maximum value in overview view', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { pomodoros: 12 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      const yAxis = screen.getByTestId('productivity-chart-y-axis');

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      // Should show ticks up to 12
      expect(within(yAxis).getByText('0')).toBeInTheDocument();
      expect(within(yAxis).getByText('2')).toBeInTheDocument();
      expect(within(yAxis).getByText('4')).toBeInTheDocument();
      expect(within(yAxis).getByText('6')).toBeInTheDocument();
      expect(within(yAxis).getByText('8')).toBeInTheDocument();
      expect(within(yAxis).getByText('10')).toBeInTheDocument();
      expect(within(yAxis).getByText('12')).toBeInTheDocument();
      expect(within(yAxis).getByText('13')).toBeInTheDocument();
      expect(within(yAxis).queryByText('14')).not.toBeInTheDocument();
    });

    it('should show 24 hours on the y-axis in timeline view', async () => {
      const { userEvent } = renderDashboard({ route: DashboardRoute.Productivity });

      await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));

      const yAxis = screen.getByTestId('productivity-chart-y-axis');

      expect(within(yAxis).getAllByText('12 AM')).toHaveLength(2);
      expect(within(yAxis).getByText('1 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('2 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('3 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('4 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('5 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('6 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('7 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('8 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('9 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('10 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('11 AM')).toBeInTheDocument();
      expect(within(yAxis).getByText('12 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('1 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('2 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('3 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('4 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('5 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('6 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('7 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('8 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('9 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('10 PM')).toBeInTheDocument();
      expect(within(yAxis).getByText('11 PM')).toBeInTheDocument();
    });

    it('should show tooltip with day summary when hovering over chart date column', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1800, pomodoros: 1.2 },
              children: [generateOverTaskTrackingEvent({ meta: { duration: 300 } })],
            }),
            generateBreakTrackingEvent({
              startTime: '2026-01-28T10:30:00',
              meta: { duration: 600 },
              children: [generateOverBreakTrackingEvent({ meta: { duration: 120 } })],
            }),
            generateVoidTrackingEvent({
              startTime: '2026-01-28T11:00:00',
              meta: { duration: 450, voidedPomodoros: 0.5 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      // Wednesday is the 4th column (index 3) - Jan 28
      const wednesdayColumn = dateColumns[3];

      await userEvent.hover(wednesdayColumn);

      const tooltip = await screen.findByRole('tooltip');

      expect(tooltip).toBeInTheDocument();
      expect(within(tooltip).getByRole('heading', { name: 'Wednesday, January 28, 2026' })).toBeInTheDocument();

      expect(within(tooltip).getByRole('definition', { name: 'Pomodoros' })).toHaveTextContent('1.2');
      expect(within(tooltip).getByRole('definition', { name: 'Task time' })).toHaveTextContent('30m');
      expect(within(tooltip).getByRole('definition', { name: 'Task over time' })).toHaveTextContent('5m');
      expect(within(tooltip).getByRole('definition', { name: 'Break time' })).toHaveTextContent('10m');
      expect(within(tooltip).getByRole('definition', { name: 'Break over time' })).toHaveTextContent('2m');
      expect(within(tooltip).getByRole('definition', { name: 'Voided pomodoros' })).toHaveTextContent('0.5');
      expect(within(tooltip).getByRole('definition', { name: 'Voided time' })).toHaveTextContent('8m');
    });

    it('should show tooltip with task stats when hovering over task bar segment', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              serviceId: 'test-service',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 2700, pomodoros: 1.8 },
              children: [generateOverTaskTrackingEvent({ meta: { duration: 180 } })],
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const taskBar = screen.getByTestId('bar-segment-test-service-task');

      await userEvent.hover(taskBar);

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip).toBeInTheDocument();
      expect(within(tooltip).getByRole('heading', { name: 'test-service' })).toBeInTheDocument();

      expect(within(tooltip).getByRole('definition', { name: 'Pomodoros' })).toHaveTextContent('1.8');
      expect(within(tooltip).getByRole('definition', { name: 'Task time' })).toHaveTextContent('45m');
      expect(within(tooltip).getByRole('definition', { name: 'Task over time' })).toHaveTextContent('3m');
    });

    it('should show tooltip with void stats when hovering over void bar segment', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateVoidTrackingEvent({
              serviceId: 'void-service',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 900, voidedPomodoros: 2 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const voidBar = screen.getByTestId('bar-segment-void-service-void');

      await userEvent.hover(voidBar);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading', { name: 'void-service' })).toBeInTheDocument();

      expect(within(tooltip).getByRole('definition', { name: 'Voided pomodoros' })).toHaveTextContent('2');
      expect(within(tooltip).getByRole('definition', { name: 'Voided time' })).toHaveTextContent('15m');
    });

    it('should hide tooltip when mouse leaves the chart element', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              serviceId: 'test-service',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const taskBar = screen.getByTestId('bar-segment-test-service-task');

      await userEvent.hover(taskBar);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await userEvent.unhover(taskBar);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should show tooltip with task stats when hovering over timeline task segment', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026
      setStoredView('timeline');

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'task-id',
              meta: { duration: 1800, pomodoros: 1.2 }, // 30 minutes
              serviceId: 'task-service-id',
              startTime: '2026-01-28T10:00:00', // 10:00 AM
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const timelineSegment = screen.getByTestId('timeline-segment-task-id');

      await userEvent.hover(timelineSegment);

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip).toBeInTheDocument();
      expect(within(tooltip).getByRole('heading', { name: 'task-service-id' })).toBeInTheDocument();
      expect(within(tooltip).getByRole('definition', { name: 'Type' })).toHaveTextContent('Task');
      expect(within(tooltip).getByRole('definition', { name: 'Pomodoros' })).toHaveTextContent('1.2');
      expect(within(tooltip).getByRole('definition', { name: 'Start time' })).toHaveTextContent('10:00 am');
      expect(within(tooltip).getByRole('definition', { name: 'End time' })).toHaveTextContent('10:30 am');
      expect(within(tooltip).getByRole('definition', { name: 'Duration' })).toHaveTextContent('30m');
    });

    it('should show tooltip with void stats when hovering over timeline void segment', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026
      setStoredView('timeline');

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateVoidTrackingEvent({
              id: 'void-id',
              meta: { duration: 900, voidedPomodoros: 1.5 },
              serviceId: 'void-service-id',
              startTime: '2026-01-28T11:00:00',
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const voidSegment = screen.getByTestId('timeline-segment-void-id');

      await userEvent.hover(voidSegment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading', { name: 'void-service-id' })).toBeInTheDocument();
      expect(within(tooltip).getByRole('definition', { name: 'Type' })).toHaveTextContent('Void');
      expect(within(tooltip).getByRole('definition', { name: 'Voided pomodoros' })).toHaveTextContent('1.5');
      expect(within(tooltip).getByRole('definition', { name: 'Start time' })).toHaveTextContent('11:00 am');
      expect(within(tooltip).getByRole('definition', { name: 'End time' })).toHaveTextContent('11:15 am');
      expect(within(tooltip).getByRole('definition', { name: 'Duration' })).toHaveTextContent('15m');
    });

    it('should show tooltip with break stats when hovering over timeline break segment', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026
      setStoredView('timeline');

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateBreakTrackingEvent({
              id: 'break-id',
              meta: { duration: 300, type: 'short' }, // 5 minutes
              serviceId: 'break-service-id',
              startTime: '2026-01-28T14:00:00', // 2:00 PM
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const breakSegment = screen.getByTestId('timeline-segment-break-id');

      await userEvent.hover(breakSegment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading', { name: 'break-service-id' })).toBeInTheDocument();
      expect(within(tooltip).getByRole('definition', { name: 'Type' })).toHaveTextContent('Short break');
      expect(within(tooltip).queryByRole('definition', { name: 'Pomodoros' })).not.toBeInTheDocument();
      expect(within(tooltip).getByRole('definition', { name: 'Start time' })).toHaveTextContent('2:00 pm');
      expect(within(tooltip).getByRole('definition', { name: 'End time' })).toHaveTextContent('2:05 pm');
      expect(within(tooltip).getByRole('definition', { name: 'Duration' })).toHaveTextContent('5m');
    });

    it('should show tooltip for overtask timeline segments', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026
      setStoredView('timeline');

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              children: [
                generateOverTaskTrackingEvent({
                  id: 'overtask-id',
                  serviceId: 'overtask-service-id',
                  meta: { duration: 180 },
                }),
              ],
              meta: { duration: 1500, pomodoros: 1 },
              startTime: '2026-01-28T09:00:00',
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const overTaskSegment = screen.getByTestId('timeline-segment-overtask-id');

      await userEvent.hover(overTaskSegment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading', { name: 'overtask-service-id' })).toBeInTheDocument();
      expect(within(tooltip).getByRole('definition', { name: 'Type' })).toBeInTheDocument();
      expect(within(tooltip).queryByRole('definition', { name: 'Pomodoros' })).not.toBeInTheDocument();
      expect(within(tooltip).getByRole('definition', { name: 'Duration' })).toHaveTextContent('3m');
    });

    it('should hide timeline tooltip when mouse leaves the segment', async () => {
      setStoredView('timeline');

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent({ id: 'task-id' })),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const timelineSegment = screen.getByTestId('timeline-segment-task-id');

      await userEvent.hover(timelineSegment);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await userEvent.unhover(timelineSegment);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should render current time indicator in timeline view for current week', async () => {
      vi.setSystemTime(new Date('2026-01-28T14:30:00')); // Wednesday, January 28, 2026 at 2:30 PM
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const currentTime = screen.getByTestId('productivity-chart-current-time');

      expect(currentTime).toHaveTextContent('2:30 PM');
    });

    it('should not render current time indicator for past weeks', async () => {
      setStoredView('timeline');

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      expect(screen.queryByTestId('productivity-chart-current-time')).not.toBeEmptyDOMElement();

      await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

      expect(screen.queryByTestId('productivity-chart-current-time')).toBeEmptyDOMElement();
    });

    it('should hide y-axis tick when current time is within 15 minutes after the hour', async () => {
      vi.setSystemTime(new Date('2026-01-28T14:10:00')); // 2:10 PM
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const yAxis = screen.getByTestId('productivity-chart-y-axis');

      expect(yAxis.querySelector('[data-value="14"]')).toHaveAttribute('data-hidden', 'true');
    });

    it('should hide y-axis tick when current time is within 15 minutes before the hour', async () => {
      vi.setSystemTime(new Date('2026-01-28T14:50:00')); // 2:50 PM
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const yAxis = screen.getByTestId('productivity-chart-y-axis');

      expect(yAxis.querySelector('[data-value="15"]')).toHaveAttribute('data-hidden', 'true');
    });

    it('should not hide y-axis tick when current time is in middle of hour', async () => {
      vi.setSystemTime(new Date('2026-01-28T14:30:00')); // 2:30 PM
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const yAxis = screen.getByTestId('productivity-chart-y-axis');

      expect(yAxis.querySelector('[data-hidden="true"]')).toBeNull();
    });

    it('should render all event types in timeline view', async () => {
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'task-id',
              meta: { duration: 1500, pomodoros: 1 },
              children: [
                generateOverTaskTrackingEvent({
                  id: 'over-task-id',
                  meta: { duration: 180 },
                }),
              ],
            }),
            generateBreakTrackingEvent({
              id: 'short-break-id',
              meta: { duration: 300, type: 'short' },
              children: [
                generateOverBreakTrackingEvent({
                  id: 'over-short-break-id',
                  meta: { duration: 60 },
                }),
              ],
            }),
            generateBreakTrackingEvent({
              id: 'long-break-id',
              meta: { duration: 900, type: 'long' },
              children: [
                generateOverBreakTrackingEvent({
                  id: 'over-long-break-id',
                  meta: { duration: 120 },
                }),
              ],
            }),
            generatePauseTrackingEvent({
              id: 'pause-id',
              meta: { duration: 600 },
            }),
            generateVoidTrackingEvent({
              id: 'void-id',
              meta: { duration: 900, voidedPomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const chartBars = screen.getByTestId('productivity-chart-bars');

      expect(within(chartBars).getByTestId('timeline-segment-task-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-over-task-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-short-break-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-over-short-break-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-long-break-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-over-long-break-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-pause-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-void-id')).toBeInTheDocument();
    });

    it('should exclude note events and zero-duration events from timeline', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateNoteTrackingEvent({
              id: 'note-id',
              startTime: '2026-01-28T10:00:00',
            }),
            generateTaskTrackingEvent({
              id: 'zero-duration-task-id',
              startTime: '2026-01-28T11:00:00',
              meta: { duration: 0, pomodoros: 0 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() =>
        within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
      );

      const chartBars = screen.getByTestId('productivity-chart-bars');

      expect(within(chartBars).queryByTestId('timeline-segment-note-id')).not.toBeInTheDocument();
      expect(within(chartBars).queryByTestId('timeline-segment-zero-duration-task-id')).not.toBeInTheDocument();
    });

    describe('Timeline Scrolling Behavior', () => {
      const scrollIntoViewMock = vi.spyOn(Element.prototype, 'scrollIntoView');

      beforeEach(() => {
        scrollIntoViewMock.mockClear();
      });

      afterAll(() => {
        scrollIntoViewMock.mockRestore();
      });

      it('should scroll to current time when switching to timeline view for current week', async () => {
        setStoredView('timeline');

        renderDashboard({
          pomelloApi: {
            fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
          },
          route: DashboardRoute.Productivity,
        });

        await waitForElementToBeRemoved(() =>
          within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
        );

        expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'center' });
      });

      it('should scroll to timeline start for past weeks', async () => {
        vi.setSystemTime(new Date('2026-01-28T14:30:00')); // Wednesday, January 28, 2026

        const { userEvent } = renderDashboard({
          pomelloApi: {
            fetchEvents: generateTrackingEvents(
              generateTaskTrackingEvent({
                startTime: '2026-01-18T10:00:00', // Previous week
              })
            ),
          },
          route: DashboardRoute.Productivity,
        });

        await waitForElementToBeRemoved(() =>
          within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
        );

        await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));
        await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));

        expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'start' });
      });

      it('should not scroll when changing date range while already in timeline view', async () => {
        vi.setSystemTime(new Date('2026-01-28T14:30:00')); // Wednesday, January 28, 2026
        setStoredView('timeline');

        const { userEvent } = renderDashboard({
          pomelloApi: {
            fetchEvents: generateTrackingEvents(
              generateTaskTrackingEvent({
                startTime: '2026-01-28T10:00:00',
              }),
              generateTaskTrackingEvent({
                startTime: '2026-01-18T10:00:00', // Previous week
              })
            ),
          },
          route: DashboardRoute.Productivity,
        });

        await waitForElementToBeRemoved(() =>
          within(screen.getByRole('region', { name: /Week of/ })).queryByRole('status', { name: 'Loading' })
        );

        expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

        scrollIntoViewMock.mockClear();

        await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

        expect(scrollIntoViewMock).not.toHaveBeenCalled();
      });
    });
  });
});

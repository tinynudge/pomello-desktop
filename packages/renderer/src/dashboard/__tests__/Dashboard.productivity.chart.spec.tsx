import { createMockServiceFactory } from '@/__fixtures__/createMockService';
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
import { DashboardRoute, ServiceId, TaskNamesById } from '@pomello-desktop/domain';
import { renderDashboard, screen, waitFor, waitForElementToBeRemoved, within } from '../__fixtures__/renderDashboard';
import { setStoredView } from '../views/ProductivityView/storedView';

describe('Dashboard - Productivity Chart', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('View Switching', () => {
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
  });

  describe('Legend', () => {
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
  });

  describe('Axes', () => {
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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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
  });

  describe('Overview Tooltips', () => {
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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const taskBar = screen.getByTestId('bar-segment-test-service-task');

      await userEvent.hover(taskBar);

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip).toBeInTheDocument();
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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const voidBar = screen.getByTestId('bar-segment-void-service-void');

      await userEvent.hover(voidBar);

      const tooltip = screen.getByRole('tooltip');

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const taskBar = screen.getByTestId('bar-segment-test-service-task');

      await userEvent.hover(taskBar);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await userEvent.unhover(taskBar);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should fetch and display task names in tooltips', async () => {
      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Task name for ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('bar-segment-task-123-task');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading')).toHaveTextContent('Task name for task-123');
    });

    it('should display loading state while fetching task name', async () => {
      const { promise, resolve } = Promise.withResolvers<void>();

      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          await promise;

          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Task name for ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('bar-segment-task-123-task');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByText('Loading task...')).toBeInTheDocument();

      resolve();

      await waitFor(() => {
        expect(within(tooltip).getByRole('heading')).toHaveTextContent('Task name for task-123');
      });
    });

    it('should display error message when unable to fetch task name', async () => {
      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async () => {
          throw new Error('Network error');
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('bar-segment-task-123-task');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByText('Unable to get task name')).toBeInTheDocument();
    });

    it('should display error message when the task name fetch returns an error', async () => {
      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = new Error('Task not found');
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('bar-segment-task-123-task');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByText('Unable to get task name')).toBeInTheDocument();
    });

    it('should handle a mix of success and error results', async () => {
      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = id.startsWith('error') ? new Error('Failed to fetch this task') : `Task ${id}`;
          });
          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-1',
            }),
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'error-2',
            }),
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-3',
            })
          ),
        },
      });

      const firstSegment = await screen.findByTestId('bar-segment-task-1-task');

      await userEvent.hover(firstSegment);

      const firstTooltip = screen.getByRole('tooltip');

      expect(within(firstTooltip).getByRole('heading')).toHaveTextContent('Task task-1');

      await userEvent.unhover(firstSegment);

      const secondSegment = screen.getByTestId('bar-segment-error-2-task');

      await userEvent.hover(secondSegment);

      const secondTooltip = screen.getByRole('tooltip');

      expect(within(secondTooltip).getByText('Unable to get task name')).toBeInTheDocument();

      await userEvent.unhover(secondSegment);

      const thirdSegment = screen.getByTestId('bar-segment-task-3-task');

      await userEvent.hover(thirdSegment);

      const thirdTooltip = screen.getByRole('tooltip');

      expect(within(thirdTooltip).getByRole('heading')).toHaveTextContent('Task task-3');
    });

    it('should fetch task names for multiple different tasks from same service', async () => {
      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Mock 1 ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mockOne' },
      });

      const mockServiceTwo = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Mock 2 ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mockTwo' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne, mockServiceTwo],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mockOne',
              serviceId: 'task-1',
            }),
            generateVoidTrackingEvent({
              service: 'mockTwo',
              serviceId: 'task-2',
            })
          ),
        },
      });

      const taskSegment = await screen.findByTestId('bar-segment-task-1-task');

      await userEvent.hover(taskSegment);

      const taskTooltip = screen.getByRole('tooltip');

      expect(within(taskTooltip).getByRole('heading')).toHaveTextContent('Mock 1 task-1');

      await userEvent.unhover(taskSegment);

      const voidSegment = screen.getByTestId('bar-segment-task-2-void');

      await userEvent.hover(voidSegment);

      const voidTooltip = screen.getByRole('tooltip');

      expect(within(voidTooltip).getByRole('heading')).toHaveTextContent('Mock 2 task-2');
    });

    it('should cache task name results between tooltip displays', async () => {
      const fetchTaskNames = vi.fn(async (ids: ServiceId[]) => {
        const taskNames: TaskNamesById = {};

        ids.forEach(([id]) => {
          taskNames[id] = `Task ${id}`;
        });

        return taskNames;
      });

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => fetchTaskNames,
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('bar-segment-task-123-task');

      await userEvent.hover(segment);

      expect(fetchTaskNames).toHaveBeenCalledTimes(1);

      await userEvent.unhover(segment);
      await userEvent.hover(segment);

      expect(fetchTaskNames).toHaveBeenCalledTimes(1);
    });

    it('should gracefully handle services without createFetchTaskNames implementation', async () => {
      const mockServiceNoFetch = createMockServiceFactory({
        service: { id: 'mockNoFetch' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceNoFetch],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mockNoFetch',
              serviceId: 'task-1',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('bar-segment-task-1-task');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading')).toHaveTextContent('task-1');
    });
  });

  describe('Timeline Tooltips', () => {
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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const timelineSegment = screen.getByTestId('timeline-segment-task-id');

      await userEvent.hover(timelineSegment);

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip).toBeInTheDocument();
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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const voidSegment = screen.getByTestId('timeline-segment-void-id');

      await userEvent.hover(voidSegment);

      const tooltip = screen.getByRole('tooltip');

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const breakSegment = screen.getByTestId('timeline-segment-break-id');

      await userEvent.hover(breakSegment);

      const tooltip = screen.getByRole('tooltip');

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const overTaskSegment = screen.getByTestId('timeline-segment-overtask-id');

      await userEvent.hover(overTaskSegment);

      const tooltip = screen.getByRole('tooltip');

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const timelineSegment = screen.getByTestId('timeline-segment-task-id');

      await userEvent.hover(timelineSegment);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await userEvent.unhover(timelineSegment);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should fetch and display task names in tooltips', async () => {
      setStoredView('timeline');

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Task name for ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading')).toHaveTextContent('Task name for task-123');
    });

    it('should display loading state while fetching task name', async () => {
      setStoredView('timeline');

      const { promise, resolve } = Promise.withResolvers<void>();

      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          await promise;

          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Task name for ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByText('Loading task...')).toBeInTheDocument();

      resolve();

      await waitFor(() => {
        expect(within(tooltip).getByRole('heading')).toHaveTextContent('Task name for task-123');
      });
    });

    it('should display error message when unable to fetch task name', async () => {
      setStoredView('timeline');

      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async () => {
          throw new Error('Network error');
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByText('Unable to get task name')).toBeInTheDocument();
    });

    it('should display error message when the task name fetch returns an error', async () => {
      setStoredView('timeline');

      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = new Error('Task not found');
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByText('Unable to get task name')).toBeInTheDocument();
    });

    it('should handle a mix of success and error results', async () => {
      setStoredView('timeline');

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = id.startsWith('error') ? new Error('Failed to fetch this task') : `Task ${id}`;
          });
          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mock',
              serviceId: 'task-1',
            }),
            generateTaskTrackingEvent({
              id: 'event-2',
              service: 'mock',
              serviceId: 'error-2',
            }),
            generateTaskTrackingEvent({
              id: 'event-3',
              service: 'mock',
              serviceId: 'task-3',
            })
          ),
        },
      });

      const firstSegment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(firstSegment);

      const firstTooltip = screen.getByRole('tooltip');

      expect(within(firstTooltip).getByRole('heading')).toHaveTextContent('Task task-1');

      await userEvent.unhover(firstSegment);

      const secondSegment = screen.getByTestId('timeline-segment-event-2');

      await userEvent.hover(secondSegment);

      const secondTooltip = screen.getByRole('tooltip');

      expect(within(secondTooltip).getByText('Unable to get task name')).toBeInTheDocument();

      await userEvent.unhover(secondSegment);

      const thirdSegment = screen.getByTestId('timeline-segment-event-3');

      await userEvent.hover(thirdSegment);

      const thirdTooltip = screen.getByRole('tooltip');

      expect(within(thirdTooltip).getByRole('heading')).toHaveTextContent('Task task-3');
    });

    it('should fetch task names for multiple different tasks from same service', async () => {
      setStoredView('timeline');

      const mockServiceOne = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Mock 1 ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mockOne' },
      });

      const mockServiceTwo = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Mock 2 ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mockTwo' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceOne, mockServiceTwo],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mockOne',
              serviceId: 'task-1',
            }),
            generateVoidTrackingEvent({
              id: 'event-2',
              service: 'mockTwo',
              serviceId: 'task-2',
            })
          ),
        },
      });

      const taskSegment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(taskSegment);

      const taskTooltip = screen.getByRole('tooltip');

      expect(within(taskTooltip).getByRole('heading')).toHaveTextContent('Mock 1 task-1');

      await userEvent.unhover(taskSegment);

      const voidSegment = screen.getByTestId('timeline-segment-event-2');

      await userEvent.hover(voidSegment);

      const voidTooltip = screen.getByRole('tooltip');

      expect(within(voidTooltip).getByRole('heading')).toHaveTextContent('Mock 2 task-2');
    });

    it('should cache task name results between tooltip displays', async () => {
      setStoredView('timeline');

      const fetchTaskNames = vi.fn(async (ids: ServiceId[]) => {
        const taskNames: TaskNamesById = {};

        ids.forEach(([id]) => {
          taskNames[id] = `Task ${id}`;
        });

        return taskNames;
      });

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => fetchTaskNames,
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mock',
              serviceId: 'task-123',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(segment);

      expect(fetchTaskNames).toHaveBeenCalledTimes(1);

      await userEvent.unhover(segment);
      await userEvent.hover(segment);

      expect(fetchTaskNames).toHaveBeenCalledTimes(1);
    });

    it('should gracefully handle services without createFetchTaskNames implementation', async () => {
      setStoredView('timeline');

      const mockServiceNoFetch = createMockServiceFactory({
        service: { id: 'mockNoFetch' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockServiceNoFetch],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'event-1',
              service: 'mockNoFetch',
              serviceId: 'task-1',
            })
          ),
        },
      });

      const segment = await screen.findByTestId('timeline-segment-event-1');

      await userEvent.hover(segment);

      const tooltip = screen.getByRole('tooltip');

      expect(within(tooltip).getByRole('heading')).toHaveTextContent('task-1');
    });
  });

  describe('Current Time Indicator', () => {
    it('should render current time indicator in timeline view for current week', async () => {
      vi.setSystemTime(new Date('2026-01-28T14:30:00')); // Wednesday, January 28, 2026 at 2:30 PM
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent()),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const yAxis = screen.getByTestId('productivity-chart-y-axis');

      expect(yAxis.querySelector('[data-hidden="true"]')).toBeNull();
    });
  });

  describe('Event Rendering', () => {
    it('should render all event types in timeline view', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'task-id',
              startTime: '2026-01-28T08:00:00',
              meta: { duration: 1500, pomodoros: 1 },
              children: [
                generatePauseTrackingEvent({
                  id: 'pause-id',
                  startTime: '2026-01-28T08:05:00',
                  meta: { duration: 600 },
                }),
                generateOverTaskTrackingEvent({
                  id: 'over-task-id',
                  startTime: '2026-01-28T08:25:00',
                  meta: { duration: 180 },
                }),
              ],
            }),
            generateBreakTrackingEvent({
              id: 'short-break-id',
              startTime: '2026-01-28T08:28:00',
              meta: { duration: 300, type: 'short' },
              children: [
                generateOverBreakTrackingEvent({
                  id: 'over-short-break-id',
                  startTime: '2026-01-28T08:33:00',
                  meta: { duration: 60 },
                }),
              ],
            }),
            generateBreakTrackingEvent({
              id: 'long-break-id',
              startTime: '2026-01-28T08:34:00',
              meta: { duration: 900, type: 'long' },
              children: [
                generateOverBreakTrackingEvent({
                  id: 'over-long-break-id',
                  startTime: '2026-01-28T08:49:00',
                  meta: { duration: 120 },
                }),
              ],
            }),
            generateVoidTrackingEvent({
              id: 'void-id',
              startTime: '2026-01-28T08:51:00',
              meta: { duration: 900, voidedPomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const chartBars = screen.getByTestId('productivity-chart-bars');

      expect(within(chartBars).queryByTestId('timeline-segment-note-id')).not.toBeInTheDocument();
      expect(within(chartBars).queryByTestId('timeline-segment-zero-duration-task-id')).not.toBeInTheDocument();
    });

    it('should render two task segments and a pause segment when a task has one pause', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'task-id',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
              children: [
                generatePauseTrackingEvent({
                  id: 'pause-id',
                  startTime: '2026-01-28T10:10:00',
                  meta: { duration: 300 },
                }),
              ],
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const chartBars = screen.getByTestId('productivity-chart-bars');

      expect(within(chartBars).getByTestId('timeline-segment-task-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-task-id-1')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-pause-id')).toBeInTheDocument();
    });

    it('should render three task segments when a task has two pauses', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'task-id',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
              children: [
                generatePauseTrackingEvent({
                  id: 'pause-1-id',
                  startTime: '2026-01-28T10:05:00',
                  meta: { duration: 120 },
                }),
                generatePauseTrackingEvent({
                  id: 'pause-2-id',
                  startTime: '2026-01-28T10:15:00',
                  meta: { duration: 180 },
                }),
              ],
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const chartBars = screen.getByTestId('productivity-chart-bars');

      expect(within(chartBars).getByTestId('timeline-segment-task-id')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-task-id-1')).toBeInTheDocument();
      expect(within(chartBars).getByTestId('timeline-segment-task-id-2')).toBeInTheDocument();
    });

    it('should render a single task segment when a task has no pauses', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));
      setStoredView('timeline');

      renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              id: 'task-id',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const chartBars = screen.getByTestId('productivity-chart-bars');

      expect(within(chartBars).getByTestId('timeline-segment-task-id')).toBeInTheDocument();
      expect(within(chartBars).queryByTestId('timeline-segment-task-id-1')).not.toBeInTheDocument();
    });
  });

  describe('Scrolling Behavior', () => {
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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

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

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

      scrollIntoViewMock.mockClear();

      await userEvent.click(screen.getByRole('button', { name: 'Previous week' }));

      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
  });

  describe('Premium Gating', () => {
    it('should show a premium modal when free user clicks Timeline button', async () => {
      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        pomelloConfig: {
          user: {
            email: 'free@user.com',
            name: 'Free User',
            timezone: 'America/New_York',
            type: 'free',
          },
        },
      });

      await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));

      const dialog = screen.getByRole('dialog', { name: 'Premium feature' });

      expect(dialog).toBeInTheDocument();
      expect(
        within(dialog).getByText(
          'The timeline view is a premium feature and is not available on free accounts. Click "Upgrade" to update your account and gain access to this feature.'
        )
      ).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('should show a premium modal for free users when accessing a stored view', async () => {
      setStoredView('timeline');

      renderDashboard({
        route: DashboardRoute.Productivity,
        pomelloConfig: {
          user: {
            email: 'free@user.com',
            name: 'Free User',
            timezone: 'America/New_York',
            type: 'free',
          },
        },
      });

      const dialog = await screen.findByRole('dialog', { name: 'Premium feature' });

      expect(dialog).toBeInTheDocument();
      expect(
        within(dialog).getByText(
          'The timeline view is a premium feature and is not available on free accounts. Click "Upgrade" to update your account and gain access to this feature.'
        )
      ).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('should revert to overview view when free user closes the premium modal', async () => {
      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        pomelloConfig: {
          user: {
            email: 'free@user.com',
            name: 'Free User',
            timezone: 'America/New_York',
            type: 'free',
          },
        },
      });

      const overviewButton = screen.getByRole('button', { name: 'Overview' });
      const timelineButton = screen.getByRole('button', { name: 'Timeline' });

      expect(overviewButton).toHaveAttribute('aria-pressed', 'true');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'false');

      await userEvent.click(timelineButton);

      const dialog = screen.getByRole('dialog', { name: 'Premium feature' });

      expect(dialog).toBeInTheDocument();

      await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));

      expect(screen.queryByRole('dialog', { name: 'Premium feature' })).not.toBeInTheDocument();
      expect(overviewButton).toHaveAttribute('aria-pressed', 'true');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should open subscription page when clicking Upgrade button', async () => {
      const { appApi, userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        pomelloConfig: {
          user: {
            email: 'free@user.com',
            name: 'Free User',
            timezone: 'America/New_York',
            type: 'free',
          },
        },
      });

      await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));

      const dialog = screen.getByRole('dialog', { name: 'Premium feature' });

      await userEvent.click(within(dialog).getByRole('button', { name: 'Upgrade' }));

      expect(appApi.openUrl).toHaveBeenCalledWith(expect.stringMatching(/dashboard\/user\/subscription$/));
    });

    it('should not show a premium modal when premium user clicks Timeline button', async () => {
      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        pomelloConfig: {
          user: {
            email: 'premium@user.com',
            name: 'Premium User',
            timezone: 'America/New_York',
            type: 'premium',
          },
        },
      });

      const timelineButton = screen.getByRole('button', { name: 'Timeline' });

      await userEvent.click(timelineButton);

      expect(screen.queryByRole('dialog', { name: 'Premium feature' })).not.toBeInTheDocument();
      expect(timelineButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should allow a premium user to freely switch between views', async () => {
      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        pomelloConfig: {
          user: {
            email: 'premium@user.com',
            name: 'Premium User',
            timezone: 'America/New_York',
            type: 'premium',
          },
        },
      });

      const overviewButton = screen.getByRole('button', { name: 'Overview' });
      const timelineButton = screen.getByRole('button', { name: 'Timeline' });

      await userEvent.click(timelineButton);

      expect(timelineButton).toHaveAttribute('aria-pressed', 'true');
      expect(overviewButton).toHaveAttribute('aria-pressed', 'false');
      expect(screen.queryByRole('dialog', { name: 'Premium feature' })).not.toBeInTheDocument();

      await userEvent.click(overviewButton);

      expect(overviewButton).toHaveAttribute('aria-pressed', 'true');
      expect(timelineButton).toHaveAttribute('aria-pressed', 'false');
      expect(screen.queryByRole('dialog', { name: 'Premium feature' })).not.toBeInTheDocument();

      await userEvent.click(timelineButton);

      expect(timelineButton).toHaveAttribute('aria-pressed', 'true');
      expect(overviewButton).toHaveAttribute('aria-pressed', 'false');
      expect(screen.queryByRole('dialog', { name: 'Premium feature' })).not.toBeInTheDocument();
    });
  });

  describe('Events Modal', () => {
    it('should open events modal with correct heading when clicking a date column in overview', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00')); // Wednesday, January 28, 2026

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent({ startTime: '2026-01-28T10:00:00' })),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      // Wednesday is the 4th column (index 3) - Jan 28
      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByRole('heading', { name: 'Wednesday, January 28, 2026' })).toBeInTheDocument();
    });

    it('should open events modal when clicking a bar segment in overview', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({ serviceId: 'my-task', startTime: '2026-01-28T10:00:00' })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      await userEvent.click(screen.getByTestId('bar-segment-my-task-task'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open events modal when clicking a timeline segment', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));
      setStoredView('timeline');

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({ id: 'event-1', startTime: '2026-01-28T10:00:00' })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      await userEvent.click(screen.getByTestId('timeline-segment-event-1'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close the events modal when clicking the close button', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent({ startTime: '2026-01-28T10:00:00' })),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should show correct time range and duration label for a task event', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 }, // 25 minutes
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByText('10:00\u201310:25 am')).toBeInTheDocument();
      expect(within(dialog).getByText('Task for 25m')).toBeInTheDocument();
    });

    it('should show different meridiem for both times when they cross am/pm boundary', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T11:45:00',
              meta: { duration: 1200, pomodoros: 1 }, // 20 minutes — crosses noon
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByText('11:45 am\u201312:05 pm')).toBeInTheDocument();
    });

    it('should show task name heading only once for consecutive events with the same serviceId', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({ serviceId: 'shared-task', startTime: '2026-01-28T10:00:00' }),
            generateTaskTrackingEvent({ serviceId: 'shared-task', startTime: '2026-01-28T11:00:00' })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      // The serviceId is shown as the task name (no fetch configured), and should appear only once
      expect(within(dialog).getAllByText('shared-task')).toHaveLength(1);
    });

    it('should display fetched task name in events modal', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Task name for ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
              startTime: '2026-01-28T10:00:00',
            })
          ),
        },
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByText('Task name for task-123')).toBeInTheDocument();
    });

    it('should show loading state while fetching task names in events modal', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { promise, resolve } = Promise.withResolvers<void>();

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async ids => {
          await promise;

          const taskNames: TaskNamesById = {};

          ids.forEach(([id]) => {
            taskNames[id] = `Task name for ${id}`;
          });

          return taskNames;
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
              startTime: '2026-01-28T10:00:00',
            })
          ),
        },
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByText('Loading task...')).toBeInTheDocument();

      resolve();

      await waitFor(() => {
        expect(within(dialog).getByText('Task name for task-123')).toBeInTheDocument();
      });
    });

    it('should fall back to serviceId when task name fetch throws', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async () => {
          throw new Error('Network error');
        },
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
              startTime: '2026-01-28T10:00:00',
            })
          ),
        },
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      await waitFor(() => {
        expect(within(dialog).getByText('task-123')).toBeInTheDocument();
      });
    });

    it('should fall back to serviceId when task name is not in fetch result', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async () => ({}),
        service: { id: 'mock' },
      });

      const { userEvent } = renderDashboard({
        route: DashboardRoute.Productivity,
        services: [mockService],
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              service: 'mock',
              serviceId: 'task-123',
              startTime: '2026-01-28T10:00:00',
            })
          ),
        },
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      await waitFor(() => {
        expect(within(dialog).getByText('task-123')).toBeInTheDocument();
      });
    });

    it('should render child events under their parent task', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
              children: [
                generateOverTaskTrackingEvent({
                  startTime: '2026-01-28T10:25:00',
                  meta: { duration: 120 },
                }),
              ],
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByText('Task for 25m')).toBeInTheDocument();
      expect(within(dialog).getByText('Task (Over) for 2m')).toBeInTheDocument();
    });

    it('should include pause child durations in the task time range', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 }, // 25 min task
              children: [
                generatePauseTrackingEvent({ meta: { duration: 60 } }), // +1 min pause
              ],
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      // End time is 10:26 am (25 min task + 1 min pause), not 10:25 am
      expect(within(dialog).getByText('10:00\u201310:26 am')).toBeInTheDocument();
    });

    it('should render over_break child events with the correct break type label', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateBreakTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 300, type: 'short' },
              children: [
                generateOverBreakTrackingEvent({
                  startTime: '2026-01-28T10:05:00',
                  meta: { duration: 90 },
                }),
              ],
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByText('Short break for 5m')).toBeInTheDocument();
      expect(within(dialog).getByText('Short break (Over) for 1m 30s')).toBeInTheDocument();
    });
  });

  describe('Edit events', () => {
    it('should show "Edit event" tooltip when hovering an event in view mode', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(generateTaskTrackingEvent({ startTime: '2026-01-28T10:00:00' })),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');
      const eventButton = within(dialog).getByRole('button', { name: /Task for/ });

      await userEvent.hover(eventButton);

      expect(screen.getByRole('tooltip', { name: 'Edit event' })).toBeInTheDocument();

      await userEvent.unhover(eventButton);

      expect(screen.queryByRole('tooltip', { name: 'Edit event' })).not.toBeInTheDocument();
    });

    it('should enter edit mode when clicking an event', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              serviceId: 'task-a',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            }),
            generateBreakTrackingEvent({
              serviceId: 'task-a',
              startTime: '2026-01-28T10:25:00',
              meta: { duration: 300, type: 'short' },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByRole('button', { name: /Task for 25m/ })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: /Short break for 5m/ })).toBeInTheDocument();

      await userEvent.click(within(dialog).getByRole('button', { name: /Task for 25m/ }));

      expect(within(dialog).queryByRole('button', { name: /Task for 25m/ })).not.toBeInTheDocument();
      expect(within(dialog).queryByRole('button', { name: /Short break for 5m/ })).not.toBeInTheDocument();
    });

    it('should show a cancel button on the active event', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();

      await userEvent.click(within(dialog).getByRole('button', { name: /Task for 25m/ }));

      expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should return to view mode when clicking cancel', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              serviceId: 'task-a',
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            }),
            generateBreakTrackingEvent({
              serviceId: 'task-a',
              startTime: '2026-01-28T10:25:00',
              meta: { duration: 300, type: 'short' },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      await userEvent.click(within(dialog).getByRole('button', { name: /Task for 25m/ }));

      expect(within(dialog).queryByRole('button', { name: /Task for 25m/ })).not.toBeInTheDocument();
      expect(within(dialog).queryByRole('button', { name: /Short break for 5m/ })).not.toBeInTheDocument();

      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

      expect(within(dialog).getByRole('button', { name: /Task for 25m/ })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: /Short break for 5m/ })).toBeInTheDocument();

      expect(within(dialog).queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });

    it('should render events as buttons in view mode and as generic elements in edit mode', async () => {
      vi.setSystemTime(new Date('2026-01-28T12:00:00'));

      const { userEvent } = renderDashboard({
        pomelloApi: {
          fetchEvents: generateTrackingEvents(
            generateTaskTrackingEvent({
              startTime: '2026-01-28T10:00:00',
              meta: { duration: 1500, pomodoros: 1 },
            })
          ),
        },
        route: DashboardRoute.Productivity,
      });

      await waitForElementToBeRemoved(() => screen.queryByRole('status', { name: 'Loading productivity data' }));

      const dateBackgrounds = screen.getByTestId('productivity-chart-date-backgrounds');
      const dateColumns = dateBackgrounds.querySelectorAll('rect');

      await userEvent.click(dateColumns[3]);

      const dialog = screen.getByRole('dialog');

      expect(within(dialog).getByRole('button', { name: /Task for 25m/ })).toBeInTheDocument();

      await userEvent.click(within(dialog).getByRole('button', { name: /Task for 25m/ }));

      expect(within(dialog).queryByRole('button', { name: /Task for 25m/ })).not.toBeInTheDocument();
      expect(within(dialog).getByText('Task for 25m')).toBeInTheDocument();
    });
  });
});

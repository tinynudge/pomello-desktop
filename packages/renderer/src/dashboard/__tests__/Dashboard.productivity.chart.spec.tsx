import { createMockServiceFactory } from '@/__fixtures__/createMockService';
import {
  generateTaskTrackingEvent,
  generateTrackingEvents,
  generateVoidTrackingEvent,
} from '@/app/__fixtures__/generateTrackingEvents';
import { DashboardRoute, TaskNamesById } from '@pomello-desktop/domain';
import { TrackingEvent } from '@tinynudge/pomello-service';
import { renderDashboard, screen, waitFor, within } from '../__fixtures__/renderDashboard';
import { setStoredView } from '../views/ProductivityView/storedView';

describe('Dashboard - Productivity Chart', () => {
  describe('Overview tooltips', () => {
    it('should fetch and display task names in tooltips', async () => {
      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Task name for ${event.serviceId}`;
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
        createFetchTaskNames: () => async events => {
          await promise;

          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Task name for ${event.serviceId}`;
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
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = new Error('Task not found');
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
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = event.serviceId.startsWith('error')
              ? new Error('Failed to fetch this task')
              : `Task ${event.serviceId}`;
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
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Mock 1 ${event.serviceId}`;
          });

          return taskNames;
        },
        service: { id: 'mockOne' },
      });

      const mockServiceTwo = createMockServiceFactory({
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Mock 2 ${event.serviceId}`;
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
      const fetchTaskNames = vi.fn(async (events: TrackingEvent[]) => {
        const taskNames: TaskNamesById = {};

        events.forEach(event => {
          taskNames[event.serviceId] = `Task ${event.serviceId}`;
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

  describe('Timeline tooltips', () => {
    it('should fetch and display task names in tooltips', async () => {
      setStoredView('timeline');

      const mockService = createMockServiceFactory({
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Task name for ${event.serviceId}`;
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
        createFetchTaskNames: () => async events => {
          await promise;

          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Task name for ${event.serviceId}`;
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
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = new Error('Task not found');
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
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = event.serviceId.startsWith('error')
              ? new Error('Failed to fetch this task')
              : `Task ${event.serviceId}`;
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
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Mock 1 ${event.serviceId}`;
          });

          return taskNames;
        },
        service: { id: 'mockOne' },
      });

      const mockServiceTwo = createMockServiceFactory({
        createFetchTaskNames: () => async events => {
          const taskNames: TaskNamesById = {};

          events.forEach(event => {
            taskNames[event.serviceId] = `Mock 2 ${event.serviceId}`;
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

      const fetchTaskNames = vi.fn(async (events: TrackingEvent[]) => {
        const taskNames: TaskNamesById = {};

        events.forEach(event => {
          taskNames[event.serviceId] = `Task ${event.serviceId}`;
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
});

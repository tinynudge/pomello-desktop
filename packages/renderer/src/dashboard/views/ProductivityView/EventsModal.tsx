import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { TaskNamesById } from '@pomello-desktop/domain';
import { useQuery } from '@tanstack/solid-query';
import {
  BreakTrackingEvent,
  OverBreakTrackingEvent,
  TrackingEvent,
} from '@tinynudge/pomello-service';
import { addSeconds, format, parseISO } from 'date-fns';
import { Component, createMemo, createSignal, For, Show } from 'solid-js';
import { EditEvent } from './EditEvent';
import { EventContainer } from './EventContainer';
import styles from './EventsModal.module.scss';
import { DailyProductivity } from './WeeklyProductivityPanels';

type TrackingEventGroup = {
  serviceId: string;
  events: TrackingEventWithBreakParent[];
};

type TrackingEventWithBreakParent =
  | Exclude<TrackingEvent, OverBreakTrackingEvent>
  | (OverBreakTrackingEvent & { parent: BreakTrackingEvent });

type EventsModalProps = {
  date: string;
  fetchTaskNamesByDate(date: string): Promise<TaskNamesById>;
  onHide(): void;
  productivity: DailyProductivity;
};

export const EventsModal: Component<EventsModalProps> = props => {
  const t = useTranslate();

  const getGroupedEvents = createMemo<TrackingEventGroup[]>(() => {
    const groups: TrackingEventGroup[] = [];
    const remaining = [...props.productivity.events];

    while (remaining.length > 0) {
      const event = remaining.pop()!;
      const pendingEvents: TrackingEventWithBreakParent[] = [event];

      if ('children' in event) {
        if (event.type === 'break') {
          pendingEvents.push(...event.children.map(child => ({ ...child, parent: event })));
        } else {
          pendingEvents.push(...event.children);
        }
      }

      const lastGroup = groups.at(-1);

      if (lastGroup?.serviceId === event.serviceId) {
        lastGroup.events.push(...pendingEvents);
      } else {
        groups.push({
          serviceId: event.serviceId,
          events: pendingEvents,
        });
      }
    }

    return groups;
  });

  const taskNamesById = useQuery(() => ({
    queryKey: ['taskNamesByDate', props.date],
    queryFn: () => props.fetchTaskNamesByDate(props.date),
  }));

  const [getActiveEventId, setActiveEventId] = createSignal<string | null>(null);

  const handleEventEdit = (eventId: string) => {
    setActiveEventId(eventId);
  };

  const handleEditCancel = () => {
    setActiveEventId(null);
  };

  const getTaskName = (serviceId: string): string => {
    const taskName = taskNamesById.data?.[serviceId];

    if (typeof taskName === 'string') {
      return taskName;
    }

    if (taskNamesById.isError || taskName instanceof Error) {
      return t('taskNameError');
    }

    if (taskNamesById.isLoading) {
      return t('loadingTask');
    }

    return serviceId;
  };

  const getEventType = (event: TrackingEventWithBreakParent): string => {
    if (event.type === 'break') {
      return `${event.meta.type}Break`;
    } else if (event.type === 'over_break') {
      return `${event.parent.meta.type}BreakOver`;
    } else if (event.type === 'over_task') {
      return 'taskOver';
    } else {
      return event.type;
    }
  };

  const getTimeRange = (event: TrackingEventWithBreakParent): string => {
    const startDate = new Date(event.startTime);

    if (!('duration' in event.meta)) {
      return format(startDate, 'h:mm aaa');
    }

    const duration =
      event.type === 'task'
        ? event.children.reduce((duration, childEvent) => {
            const childDuration = childEvent.type === 'pause' ? childEvent.meta.duration : 0;

            return duration + childDuration;
          }, event.meta.duration)
        : event.meta.duration;

    const endDate = addSeconds(startDate, duration);
    const sameMeridiem = format(startDate, 'aaa') === format(endDate, 'aaa');
    const startFormatted = format(startDate, sameMeridiem ? 'h:mm' : 'h:mm aaa');
    const endTime = format(endDate, 'h:mm aaa');

    return `${startFormatted}\u2013${endTime}`;
  };

  const getLabel = (event: TrackingEventWithBreakParent): string => {
    const type = getEventType(event);

    if (!('duration' in event.meta)) {
      return t(`event.entry.${type}.noDuration`);
    }

    const durationInSeconds = event.meta.duration;
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    const parts = [];

    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }

    if (seconds > 0) {
      parts.push(`${seconds}s`);
    }

    const duration = parts.join(' ');

    return t(`event.entry.${type}`, { duration });
  };

  const getMode = () => (getActiveEventId() !== null ? 'edit' : 'view');

  return (
    <Modal
      buttons={[{ autofocus: true, children: t('close') }]}
      heading={format(parseISO(props.date), 'EEEE, MMMM d, yyyy')}
      onHide={props.onHide}
      padding="none"
      showOnMount
    >
      <div class={styles.events} data-mode={getMode()}>
        <For each={getGroupedEvents()}>
          {group => (
            <div class={styles.eventGroup}>
              <h4 aria-hidden="true" class={styles.taskName}>
                {getTaskName(group.serviceId)}
              </h4>
              <For each={group.events}>
                {event => {
                  const timeRange = getTimeRange(event);
                  const label = getLabel(event);

                  return (
                    <EventContainer
                      ariaLabel={`${getTaskName(group.serviceId)}: ${timeRange} ${label}`}
                      class={styles.event}
                      isActive={event.id === getActiveEventId()}
                      mode={getMode()}
                      onEventEdit={() => handleEventEdit(event.id)}
                    >
                      <span class={styles.time}>{timeRange}</span>
                      <div class={styles.label}>
                        <svg height="16" width="16" data-type={getEventType(event)}>
                          <circle cx="8" cy="8" r="8" />
                        </svg>
                        <span>{label}</span>
                      </div>
                      <Show when={event.id === getActiveEventId()}>
                        <EditEvent onCancel={handleEditCancel} />
                      </Show>
                    </EventContainer>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </Modal>
  );
};

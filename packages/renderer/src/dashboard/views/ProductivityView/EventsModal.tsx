import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { TaskNamesById } from '@pomello-desktop/domain';
import { useQuery } from '@tanstack/solid-query';
import { PrimaryTrackingEvent, TrackingEvent } from '@tinynudge/pomello-service';
import { format, parseISO } from 'date-fns';
import { Component, createMemo, For, Show } from 'solid-js';
import { EventEntry } from './EventEntry';
import styles from './EventsModal.module.scss';
import { DailyProductivity } from './WeeklyProductivityPanels';

type EventsModalProps = {
  date: string;
  fetchTaskNamesByDate(date: string): Promise<TaskNamesById>;
  onHide(): void;
  productivity: DailyProductivity;
};

export const EventsModal: Component<EventsModalProps> = props => {
  const t = useTranslate();

  const getSortedEvents = createMemo(() => props.productivity.events.toReversed());

  const taskNamesById = useQuery(() => ({
    queryKey: ['taskNamesByDate', props.date],
    queryFn: () => props.fetchTaskNamesByDate(props.date),
  }));

  const getTaskName = (event: TrackingEvent): string => {
    const taskName = taskNamesById.data?.[event.serviceId];

    if (typeof taskName === 'string') {
      return taskName;
    }

    if (taskNamesById.isError || taskName instanceof Error) {
      return t('taskNameError');
    }

    if (taskNamesById.isLoading) {
      return t('loadingTask');
    }

    return event.serviceId;
  };

  const getEventType = (event: TrackingEvent, parentEvent?: PrimaryTrackingEvent): string => {
    if (event.type === 'break') {
      return `${event.meta.type}Break`;
    } else if (event.type === 'over_break' && parentEvent?.type === 'break') {
      return `${parentEvent.meta.type}BreakOver`;
    } else if (event.type === 'over_task') {
      return 'taskOver';
    } else {
      return event.type;
    }
  };

  return (
    <Modal
      buttons={[{ autofocus: true, children: t('close') }]}
      heading={format(parseISO(props.date), 'EEEE, MMMM d, yyyy')}
      onHide={props.onHide}
      padding="none"
      showOnMount
    >
      <div class={styles.events}>
        <For each={getSortedEvents()}>
          {(event, getIndex) => (
            <>
              <Show when={event.serviceId !== getSortedEvents()[getIndex() - 1]?.serviceId}>
                <h4 class={styles.taskName}>{getTaskName(event)}</h4>
              </Show>
              <button class={styles.event}>
                <EventEntry event={event} type={getEventType(event)} />
                <Show when={'children' in event && event.children.length > 0 && event.children}>
                  {getEventChildren => (
                    <For each={getEventChildren()}>
                      {childEvent => (
                        <EventEntry event={childEvent} type={getEventType(childEvent, event)} />
                      )}
                    </For>
                  )}
                </Show>
              </button>
            </>
          )}
        </For>
      </div>
    </Modal>
  );
};

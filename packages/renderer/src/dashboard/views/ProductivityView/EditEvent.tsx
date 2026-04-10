import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { useQueryClient } from '@tanstack/solid-query';
import { PrimaryTrackingEvent, TrackingEvent } from '@tinynudge/pomello-service';
import { isToday, parseISO } from 'date-fns';
import { Component, createSignal, For, Show } from 'solid-js';
import styles from './EditEvent.module.scss';
import { getTimeRange } from './eventHelpers';

type EditEventProps = {
  event: TrackingEvent;
  onCancel(): void;
};

const removeEvent = (
  events: PrimaryTrackingEvent[] | undefined,
  eventId: string
): PrimaryTrackingEvent[] => {
  if (!events) {
    return [];
  }

  const result = structuredClone(events);

  for (let index = 0; index < result.length; index++) {
    const event = result[index];

    if (event.id === eventId) {
      result.splice(index, 1);
      return result;
    }

    if ('children' in event) {
      const childIndex = event.children.findIndex(child => child.id === eventId);

      if (childIndex !== -1) {
        event.children.splice(childIndex, 1);
        return result;
      }
    }
  }

  return result;
};

export const EditEvent: Component<EditEventProps> = props => {
  const pomelloApi = usePomelloApi();
  const queryClient = useQueryClient();
  const t = useTranslate();

  const [getIsConfirmingDelete, setIsConfirmingDelete] = createSignal(false);

  const handleDeleteClick = (): void => {
    setIsConfirmingDelete(true);
  };

  const handleDeleteCancel = (): void => {
    setIsConfirmingDelete(false);
  };

  const handleDeleteConfirm = (): void => {
    const eventId = props.event.id;
    const isTodaysEvent = isToday(parseISO(props.event.startTime));

    props.onCancel();

    queryClient.setQueriesData<PrimaryTrackingEvent[]>({ queryKey: ['weekProductivity'] }, data =>
      removeEvent(data, eventId)
    );

    if (isTodaysEvent) {
      queryClient.setQueriesData<PrimaryTrackingEvent[]>(
        { queryKey: ['todaysProductivity'] },
        data => removeEvent(data, eventId)
      );
    }

    pomelloApi.deleteEvent(eventId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['weekProductivity'] });

      if (isTodaysEvent) {
        queryClient.invalidateQueries({ queryKey: ['todaysProductivity'] });
      }
    });
  };

  const getEventType = (event: TrackingEvent, parentEvent: TrackingEvent): string => {
    if (event.type === 'break') {
      return `${event.meta.type}Break`;
    } else if (event.type === 'over_break' && parentEvent.type === 'break') {
      return `${parentEvent.meta.type}BreakOver`;
    } else if (event.type === 'over_task') {
      return 'taskOver';
    } else {
      return event.type;
    }
  };

  return (
    <div class={styles.editEvent}>
      <div class={styles.content}>
        <Show when={getIsConfirmingDelete()}>
          <p class={styles.warning}>{t('event.deleteWarning')}</p>
          <Show when={'children' in props.event && props.event.children}>
            {getChildEvents => (
              <div class={styles.warning}>
                <p>{t('event.deleteAssociatedWarning')}</p>
                <ul class={styles.childEvents}>
                  <For each={getChildEvents()}>
                    {childEvent => (
                      <li>
                        {getTimeRange(childEvent)}
                        {' \u2022 '}
                        {t(`event.entry.${getEventType(childEvent, props.event)}.noDuration`)}
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </Show>
        </Show>
        <div class={styles.actions}>
          <Show
            when={!getIsConfirmingDelete()}
            fallback={
              <>
                <Button onClick={handleDeleteConfirm} variant="danger">
                  {t('event.deleteEvent')}
                </Button>
                <Button onClick={handleDeleteCancel}>{t('cancel')}</Button>
              </>
            }
          >
            <Button onClick={handleDeleteClick} variant="danger">
              {t('event.deleteEvent')}
            </Button>
            <Button onClick={props.onCancel}>{t('cancel')}</Button>
          </Show>
        </div>
      </div>
    </div>
  );
};

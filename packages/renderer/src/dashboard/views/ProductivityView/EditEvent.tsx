import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { useQueryClient } from '@tanstack/solid-query';
import { PrimaryTrackingEvent, TrackingEvent } from '@tinynudge/pomello-service';
import { isToday, parseISO } from 'date-fns';
import { Component } from 'solid-js';
import styles from './EditEvent.module.scss';

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
  const t = useTranslate();
  const pomelloApi = usePomelloApi();
  const queryClient = useQueryClient();

  const handleDelete = () => {
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

  return (
    <div class={styles.editEvent}>
      <div class={styles.actions}>
        <Button variant="danger" onClick={handleDelete}>
          {t('event.deleteEvent')}
        </Button>
        <Button onClick={props.onCancel}>{t('cancel')}</Button>
      </div>
    </div>
  );
};

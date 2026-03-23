import { useTranslate } from '@/shared/context/RuntimeContext';
import { TrackingEvent } from '@tinynudge/pomello-service';
import { addSeconds } from 'date-fns/addSeconds';
import { format } from 'date-fns/format';
import { Component } from 'solid-js';
import styles from './EventEntry.module.scss';

type EventEntryProps = {
  event: TrackingEvent;
  type: string;
};

export const EventEntry: Component<EventEntryProps> = props => {
  const t = useTranslate();

  const getTimeRange = (): string => {
    const startDate = new Date(props.event.startTime);

    if (!('duration' in props.event.meta)) {
      return format(startDate, 'h:mm aaa');
    }

    const duration =
      props.event.type === 'task'
        ? props.event.children.reduce((duration, childEvent) => {
            const childDuration = childEvent.type === 'pause' ? childEvent.meta.duration : 0;

            return duration + childDuration;
          }, props.event.meta.duration)
        : props.event.meta.duration;

    const endDate = addSeconds(startDate, duration);
    const sameMeridiem = format(startDate, 'aaa') === format(endDate, 'aaa');
    const startFormatted = format(startDate, sameMeridiem ? 'h:mm' : 'h:mm aaa');
    const endTime = format(endDate, 'h:mm aaa');

    return `${startFormatted}\u2013${endTime}`;
  };

  const getLabel = (): string => {
    if (!('duration' in props.event.meta)) {
      return t(`event.entry.${props.type}.noDuration`);
    }

    const durationInSeconds = props.event.meta.duration;
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

    return t(`event.entry.${props.type}`, { duration });
  };

  return (
    <div class={styles.eventEntry}>
      <span class={styles.time}>{getTimeRange()}</span>
      <div class={styles.label}>
        <svg height="16" width="16" data-type={props.type}>
          <circle cx="8" cy="8" r="8" />
        </svg>
        <span>{getLabel()}</span>
      </div>
    </div>
  );
};

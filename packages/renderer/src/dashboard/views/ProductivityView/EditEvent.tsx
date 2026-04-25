import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Input } from '@/ui/dashboard/Input';
import { Select } from '@/ui/dashboard/Select';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { ValidationMessage } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { PrimaryTrackingEvent, TrackingEvent } from '@tinynudge/pomello-service';
import {
  addSeconds,
  differenceInSeconds,
  format,
  isAfter,
  isToday,
  parseISO,
  set,
  subSeconds,
} from 'date-fns';
import { nanoid } from 'nanoid';
import { Component, createMemo, createSignal, For, JSX, Match, Show, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';
import InfoIcon from './assets/info.svg';
import { formatDuration, parseDuration } from './durationHelpers';
import styles from './EditEvent.module.scss';
import { getTimeRange, removeEvent, replaceEvent, resolvePauseDuration } from './eventHelpers';

type EditEventProps = {
  event: TrackingEvent;
  initialEvent: TrackingEvent;
  onCancel(): void;
};

type EditByOption = 'endTime' | 'startTime' | 'timeRange';

type DurationInput = {
  label: string;
  value: number | null;
};

type TimeInput = {
  lastValidValue: Date;
  value: Date | undefined;
};

export const EditEvent: Component<EditEventProps> = props => {
  const pomelloApi = usePomelloApi();
  const queryClient = useQueryClient();
  const t = useTranslate();

  const [getIsConfirmingDelete, setIsConfirmingDelete] = createSignal(false);

  const [getEditBy, setEditBy] = createSignal<EditByOption>('startTime');

  const initialDuration =
    'duration' in props.initialEvent.meta ? props.initialEvent.meta.duration : 0;
  const [duration, setDuration] = createStore<DurationInput>({
    label: formatDuration(initialDuration),
    value: initialDuration,
  });

  const initialStartTime = parseISO(props.initialEvent.startTime);
  const [startTime, setStartTime] = createStore<TimeInput>({
    lastValidValue: initialStartTime,
    value: initialStartTime,
  });

  const initialPauseDuration = resolvePauseDuration(props.initialEvent);
  const initialEndTime = addSeconds(initialStartTime, initialDuration + initialPauseDuration);
  const [endTime, setEndTime] = createStore<TimeInput>({
    lastValidValue: initialEndTime,
    value: initialEndTime,
  });

  const getStartTimeValidation = createMemo<ValidationMessage | undefined>(() => {
    if (!startTime.value) {
      return {
        type: 'error',
        text: t('event.startTimeRequired'),
      };
    }

    if (endTime.value && startTime.value >= endTime.value) {
      return {
        type: 'error',
        text: t('event.startTimeBeforeEndTime'),
      };
    }

    if (duration.value !== null && duration.value < 0) {
      return {
        type: 'error',
        text: t('event.startTimeInsufficientRange'),
      };
    }
  });

  const getEndTimeValidation = createMemo<ValidationMessage | undefined>(() => {
    if (!endTime.value) {
      return {
        type: 'error',
        text: t('event.endTimeRequired'),
      };
    }
  });

  const getDurationValidation = createMemo<ValidationMessage | undefined>(() => {
    if (duration.value === null) {
      return {
        type: 'error',
        text: t('invalidDuration'),
      };
    }

    if (duration.value === 0) {
      return {
        type: 'error',
        text: t('invalidDurationZero'),
      };
    }
  });

  const getPauseDuration = createMemo(() => resolvePauseDuration(props.event));

  const handleStartTimeInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    const time = event.currentTarget.value;

    if (!time) {
      return setStartTime('value', undefined);
    }

    const [hours, minutes, seconds = 0] = time.split(':').map(Number);
    const newStartTime = set(initialStartTime, { hours, minutes, seconds });

    setStartTime({
      lastValidValue: newStartTime,
      value: newStartTime,
    });

    if (getEditBy() === 'startTime' && duration.value) {
      const newEndTime = addSeconds(newStartTime, duration.value + getPauseDuration());

      setEndTime({
        lastValidValue: newEndTime,
        value: newEndTime,
      });
    } else if (getEditBy() === 'timeRange') {
      updateDuration();
    }
  };

  const handleEndTimeInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    const time = event.currentTarget.value;

    if (!time) {
      return setEndTime('value', undefined);
    }

    const [hours, minutes, seconds = 0] = time.split(':').map(Number);
    const newEndTime = set(initialStartTime, { hours, minutes, seconds });

    setEndTime({
      lastValidValue: newEndTime,
      value: newEndTime,
    });

    if (getEditBy() === 'endTime' && duration.value) {
      const newStartTime = subSeconds(newEndTime, duration.value + getPauseDuration());

      setStartTime({
        lastValidValue: newStartTime,
        value: newStartTime,
      });
    } else if (getEditBy() === 'timeRange') {
      updateDuration();
    }
  };

  const handleDurationBlur: JSX.FocusEventHandler<HTMLInputElement, FocusEvent> = event => {
    if (duration.label === event.currentTarget.value) {
      return;
    }

    const parsedDuration = parseDuration(event.currentTarget.value);

    if (parsedDuration === null) {
      return setDuration('value', null);
    }

    if (getEditBy() === 'startTime' && startTime.value) {
      const newEndTime = addSeconds(startTime.value, parsedDuration + getPauseDuration());

      setEndTime({
        lastValidValue: newEndTime,
        value: newEndTime,
      });
    } else if (getEditBy() === 'endTime' && endTime.value) {
      const newStartTime = subSeconds(endTime.value, parsedDuration + getPauseDuration());

      setStartTime({
        lastValidValue: newStartTime,
        value: newStartTime,
      });
    }

    setDuration({
      label: formatDuration(parsedDuration),
      value: parsedDuration,
    });
  };

  const handleEventUpdate: JSX.EventHandler<HTMLFormElement, SubmitEvent> = event => {
    event.preventDefault();

    if (!startTime.value || !duration.value) {
      return;
    }

    const updatedEvent = structuredClone(props.event);
    updatedEvent.startTime = format(startTime.value, 'yyyy-MM-dd HH:mm:ss');

    if ('duration' in updatedEvent.meta) {
      updatedEvent.meta.duration = duration.value;
    }

    if (updatedEvent.type === 'task') {
      updatedEvent.meta.pomodoros = duration.value / updatedEvent.meta.allotedTime;
    } else if (updatedEvent.type === 'void') {
      updatedEvent.meta.voidedPomodoros = duration.value / updatedEvent.meta.allotedTime;
    }

    const eventId = updatedEvent.id;
    const isTodaysEvent = isToday(parseISO(props.event.startTime));

    queryClient.setQueriesData<PrimaryTrackingEvent[]>({ queryKey: ['weekProductivity'] }, data =>
      replaceEvent(data, updatedEvent)
    );

    if (isTodaysEvent) {
      queryClient.setQueriesData<PrimaryTrackingEvent[]>(
        { queryKey: ['todaysProductivity'] },
        data => replaceEvent(data, updatedEvent)
      );
    }

    pomelloApi
      .updateEvent(eventId, {
        id: eventId,
        duration: duration.value,
        start_time: Math.round(startTime.value.getTime() / 1000),
        type: updatedEvent.type,
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['weekProductivity'] });

        if (isTodaysEvent) {
          queryClient.invalidateQueries({ queryKey: ['todaysProductivity'] });
        }
      });

    props.onCancel();
  };

  const handleDeleteClick = (): void => {
    setIsConfirmingDelete(true);
  };

  const handleDeleteCancel = (): void => {
    setIsConfirmingDelete(false);
  };

  const handleDeleteConfirm = (): void => {
    const eventId = props.event.id;
    const isTodaysEvent = isToday(parseISO(props.event.startTime));

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

    props.onCancel();
  };

  const handleEditChange = (value: EditByOption): void => {
    setEditBy(value);
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

  const getIsUpdateDisabled = (): boolean => {
    return Boolean(getStartTimeValidation() || getEndTimeValidation() || getDurationValidation());
  };

  const updateDuration = (): void => {
    if (!startTime.value || !endTime.value || isAfter(startTime.value, endTime.value)) {
      return;
    }

    const seconds = differenceInSeconds(endTime.value, startTime.value) - getPauseDuration();

    setDuration({
      label: formatDuration(seconds),
      value: seconds,
    });
  };

  const id = nanoid();

  return (
    <Switch>
      <Match when={getIsConfirmingDelete()}>
        <div class={styles.editEvent}>
          <div class={styles.warnings}>
            <p class={styles.warning} role="alert">
              {t('event.deleteWarning')}
            </p>
            <Show
              when={
                'children' in props.event && props.event.children.length > 0 && props.event.children
              }
            >
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
          </div>
          <div class={styles.actions}>
            <Button onClick={handleDeleteConfirm} variant="danger">
              {t('event.deleteEvent')}
            </Button>
            <Button onClick={handleDeleteCancel}>{t('cancel')}</Button>
          </div>
        </div>
      </Match>
      <Match when={!getIsConfirmingDelete()}>
        <form class={styles.editEvent} onSubmit={handleEventUpdate}>
          <label class={styles.label} for={`edit-by-${id}`}>
            {t('event.editBy')}
          </label>
          <Select
            id={`edit-by-${id}`}
            onChange={handleEditChange}
            options={[
              { id: 'startTime', label: t('event.editBy.startTime') },
              { id: 'endTime', label: t('event.editBy.endTime') },
              { id: 'timeRange', label: t('event.editBy.timeRange') },
            ]}
            value={getEditBy()}
          />
          <label class={styles.label} for={`start-time-${id}`}>
            {t('event.startTime')}
          </label>
          <Input
            autofocus
            disabled={getEditBy() === 'endTime'}
            id={`start-time-${id}`}
            message={getStartTimeValidation()}
            onInput={handleStartTimeInput}
            step={1}
            type="time"
            value={format(startTime.lastValidValue, 'HH:mm:ss')}
          />
          <label class={styles.label} for={`end-time-${id}`}>
            {t('event.endTime')}
          </label>
          <span class={styles.input}>
            <Input
              disabled={getEditBy() === 'startTime'}
              id={`end-time-${id}`}
              message={getEndTimeValidation()}
              onInput={handleEndTimeInput}
              step={1}
              type="time"
              value={format(endTime.lastValidValue, 'HH:mm:ss')}
            />
            <Show when={getPauseDuration() > 0}>
              <Tooltip text={t('event.endTimeTooltip')}>
                {tooltipRef => (
                  <Button
                    aria-label={t('event.endTimeTooltip')}
                    class={styles.infoButton}
                    iconOnly
                    ref={tooltipRef}
                    size="small"
                  >
                    <InfoIcon aria-hidden="true" height={18} />
                  </Button>
                )}
              </Tooltip>
            </Show>
          </span>
          <label class={styles.label} for={`duration-${id}`}>
            {t('event.duration')}
          </label>
          <Input
            class={styles.durationInput}
            disabled={getEditBy() === 'timeRange'}
            id={`duration-${id}`}
            message={getDurationValidation()}
            onBlur={handleDurationBlur}
            type="text"
            value={duration.label}
          />
          <div class={styles.actions}>
            <Button disabled={getIsUpdateDisabled()} type="submit" variant="primary">
              {t('event.updateEvent')}
            </Button>
            <Button onClick={handleDeleteClick} variant="danger">
              {t('event.deleteEvent')}
            </Button>
            <Button onClick={props.onCancel}>{t('cancel')}</Button>
          </div>
        </form>
      </Match>
    </Switch>
  );
};

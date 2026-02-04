import { PomelloApiResponse } from '@pomello-desktop/domain';
import {
  BreakTrackingEvent,
  NoteTrackingEvent,
  OverBreakTrackingEvent,
  OverTaskTrackingEvent,
  PauseTrackingEvent,
  TaskTrackingEvent,
  TrackingEvent,
  VoidTrackingEvent,
} from '@tinynudge/pomello-service';
import { nanoid } from 'nanoid';

type PartialTrackingEvent<T extends TrackingEvent> = Partial<
  Omit<T, 'type' | 'meta'> & { meta: Partial<T['meta']> }
>;

export const generateTrackingEvents = (
  ...events: TrackingEvent[]
): PomelloApiResponse<TrackingEvent[]> => ({
  data: events ?? [],
});

export const generateBreakTrackingEvent = (
  values: PartialTrackingEvent<BreakTrackingEvent> = {}
): BreakTrackingEvent => ({
  children: values.children ?? [],
  id: values.id ?? nanoid(),
  meta: {
    allotedTime: values.meta?.allotedTime ?? 300,
    duration: values.meta?.duration ?? 300,
    type: values.meta?.type ?? 'short',
  },
  parentServiceId: values.parentServiceId ?? null,
  serviceId: values.serviceId ?? nanoid(),
  startTime: values.startTime ?? new Date().toISOString(),
  type: 'break',
});

export const generateNoteTrackingEvent = (
  values: PartialTrackingEvent<NoteTrackingEvent> = {}
): NoteTrackingEvent => ({
  id: values.id ?? nanoid(),
  meta: {
    note: values.meta?.note ?? 'Test note',
    type: values.meta?.type ?? 'general',
  },
  parentServiceId: values.parentServiceId ?? null,
  serviceId: values.serviceId ?? nanoid(),
  startTime: values.startTime ?? new Date().toISOString(),
  type: 'note',
});

export const generateOverBreakTrackingEvent = (
  values: PartialTrackingEvent<OverBreakTrackingEvent> = {}
): OverBreakTrackingEvent => ({
  id: values.id ?? nanoid(),
  meta: {
    duration: values.meta?.duration ?? 60,
  },
  parentId: values.parentId ?? nanoid(),
  parentServiceId: values.parentServiceId ?? null,
  serviceId: values.serviceId ?? nanoid(),
  startTime: values.startTime ?? new Date().toISOString(),
  type: 'over_break',
});

export const generateOverTaskTrackingEvent = (
  values: PartialTrackingEvent<OverTaskTrackingEvent> = {}
): OverTaskTrackingEvent => ({
  id: values.id ?? nanoid(),
  meta: {
    duration: values.meta?.duration ?? 60,
  },
  parentId: values.parentId ?? nanoid(),
  parentServiceId: values.parentServiceId ?? null,
  serviceId: values.serviceId ?? nanoid(),
  startTime: values.startTime ?? new Date().toISOString(),
  type: 'over_task',
});

export const generatePauseTrackingEvent = (
  values: PartialTrackingEvent<PauseTrackingEvent> = {}
): PauseTrackingEvent => ({
  id: values.id ?? nanoid(),
  meta: {
    duration: values.meta?.duration ?? 60,
  },
  parentId: values.parentId ?? nanoid(),
  parentServiceId: values.parentServiceId ?? null,
  serviceId: values.serviceId ?? nanoid(),
  startTime: values.startTime ?? new Date().toISOString(),
  type: 'pause',
});

export const generateTaskTrackingEvent = (
  values: PartialTrackingEvent<TaskTrackingEvent> = {}
): TaskTrackingEvent => ({
  children: values.children ?? [],
  id: values.id ?? nanoid(),
  meta: {
    allotedTime: values.meta?.allotedTime ?? 1500,
    duration: values.meta?.duration ?? 1500,
    pomodoros: values.meta?.pomodoros ?? 1,
  },
  parentServiceId: values.parentServiceId ?? null,
  serviceId: values.serviceId ?? nanoid(),
  startTime: values.startTime ?? new Date().toISOString(),
  type: 'task',
});

export const generateVoidTrackingEvent = (
  values: PartialTrackingEvent<VoidTrackingEvent> = {}
): VoidTrackingEvent => ({
  id: values.id ?? nanoid(),
  meta: {
    allotedTime: values.meta?.allotedTime ?? 1500,
    duration: values.meta?.duration ?? 300,
    voidedPomodoros: values.meta?.voidedPomodoros ?? 1,
  },
  parentServiceId: values.parentServiceId ?? null,
  serviceId: values.serviceId ?? nanoid(),
  startTime: values.startTime ?? new Date().toISOString(),
  type: 'void',
});

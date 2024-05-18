export type PomelloTrackingEvent =
  | PomelloTaskTrackingEvent
  | PomelloBreakTrackingEvent
  | PomelloNoteTrackingEvent
  | PomelloOvertimeTrackingEvent
  | PomelloVoidTrackingEvent
  | PomelloPauseTrackingEvent;

interface PomelloBaseTrackingEvent {
  start_time: number;
  service_id: string;
  parent_service_id?: string;
}

interface PomelloTaskTrackingEvent extends PomelloBaseTrackingEvent {
  allotted_time: number;
  duration: number;
  type: 'task';
}

interface PomelloBreakTrackingEvent extends PomelloBaseTrackingEvent {
  allotted_time: number;
  duration: number;
  meta: {
    type: 'short' | 'long';
  };
  type: 'break';
}

interface PomelloNoteTrackingEvent extends PomelloBaseTrackingEvent {
  meta: {
    type: 'general' | 'internal' | 'external';
    note: string;
  };
  type: 'note';
}

interface PomelloOvertimeTrackingEvent extends PomelloBaseTrackingEvent {
  duration: number;
  parent_id: string;
  type: 'over_break' | 'over_task';
}

interface PomelloVoidTrackingEvent extends PomelloBaseTrackingEvent {
  allotted_time: number;
  duration: number;
  remove_prev_task: boolean;
  type: 'void';
}

interface PomelloPauseTrackingEvent extends PomelloBaseTrackingEvent {
  duration: number;
  parent_id: string;
  type: 'pause';
}

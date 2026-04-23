import {
  PrimaryTrackingEvent,
  TrackingEvent,
  TrackingEventInput,
} from '@tinynudge/pomello-service';
import { FetchEventsOptions } from './FetchEventsOptions';
import { PomelloUser } from './PomelloUser';
import { UpdateEventInput } from './UpdateEventInput';

export type PomelloApi = {
  deleteEvent(eventId: string): Promise<void>;
  fetchEvents(options: FetchEventsOptions): Promise<PrimaryTrackingEvent[]>;
  fetchUser(): Promise<PomelloUser>;
  hasToken(): boolean;
  logEvent(event: TrackingEventInput): Promise<TrackingEvent>;
  updateEvent(eventId: string, input: UpdateEventInput): Promise<void>;
};

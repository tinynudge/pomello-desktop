import {
  PrimaryTrackingEvent,
  TrackingEvent,
  TrackingEventInput,
} from '@tinynudge/pomello-service';
import { FetchEventsOptions } from './FetchEventsOptions';
import { PomelloUser } from './PomelloUser';
import { Settings } from './Settings';
import { UpdateEventInput } from './UpdateEventInput';
import { UpdateUserInput } from './UpdateUserInput';

export type PomelloApi = {
  deleteEvent(eventId: string): Promise<void>;
  fetchEvents(options: FetchEventsOptions): Promise<PrimaryTrackingEvent[]>;
  fetchSettings(): Promise<Settings | null>;
  fetchUser(): Promise<PomelloUser>;
  hasToken(): boolean;
  logEvent(event: TrackingEventInput): Promise<TrackingEvent>;
  saveSettings(settings: Settings): Promise<void>;
  updateEvent(eventId: string, input: UpdateEventInput): Promise<void>;
  updateUser(input: UpdateUserInput): Promise<PomelloUser>;
};

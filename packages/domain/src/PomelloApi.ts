import {
  PrimaryTrackingEvent,
  TrackingEvent,
  TrackingEventInput,
} from '@tinynudge/pomello-service';
import { FetchEventsOptions } from './FetchEventsOptions';
import { PomelloUser } from './PomelloUser';

export type PomelloApi = {
  fetchEvents(options: FetchEventsOptions): Promise<PrimaryTrackingEvent[]>;
  fetchUser(): Promise<PomelloUser>;
  hasToken(): boolean;
  logEvent(event: TrackingEventInput): Promise<TrackingEvent>;
};

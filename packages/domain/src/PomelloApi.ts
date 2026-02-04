import { TrackingEvent, TrackingEventInput } from '@tinynudge/pomello-service';
import { FetchEventsOptions } from './FetchEventsOptions';
import { PomelloUser } from './PomelloUser';

export type PomelloApi = {
  fetchEvents(options: FetchEventsOptions): Promise<TrackingEvent[]>;
  fetchUser(): Promise<PomelloUser>;
  hasToken(): boolean;
  logEvent(event: TrackingEventInput): Promise<TrackingEvent>;
};

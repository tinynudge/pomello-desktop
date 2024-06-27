import { SavedTrackingEvent, TrackingEvent } from '@tinynudge/pomello-service';
import { PomelloUser } from './PomelloUser';

export type PomelloApi = {
  fetchUser(): Promise<PomelloUser>;
  hasToken(): boolean;
  logEvent(event: TrackingEvent): Promise<SavedTrackingEvent>;
};

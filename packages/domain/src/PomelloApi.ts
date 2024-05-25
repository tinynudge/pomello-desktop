import { CreatedPomelloTrackingEvent } from './CreatedPomelloTrackingEvent';
import { PomelloTrackingEvent } from './PomelloTrackingEvent';
import { PomelloUser } from './PomelloUser';

export type PomelloApi = {
  fetchUser(): Promise<PomelloUser>;
  logEvent(event: PomelloTrackingEvent): Promise<CreatedPomelloTrackingEvent>;
};

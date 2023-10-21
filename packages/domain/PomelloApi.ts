import { CreatedPomelloTrackingEvent } from './CreatedPomelloTrackingEvent';
import { PomelloTrackingEvent } from './PomelloTrackingEvent';
import { PomelloUser } from './PomelloUser';

export interface PomelloApi {
  fetchUser(): Promise<PomelloUser>;
  logEvent(event: PomelloTrackingEvent): Promise<CreatedPomelloTrackingEvent>;
}

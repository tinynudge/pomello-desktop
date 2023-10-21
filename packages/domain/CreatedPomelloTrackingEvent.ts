import { PomelloTrackingEvent } from './PomelloTrackingEvent';

export type CreatedPomelloTrackingEvent = PomelloTrackingEvent & {
  id: string;
};

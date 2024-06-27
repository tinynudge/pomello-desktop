import { TrackingEvent, TrackingEventWithServiceData } from '@tinynudge/pomello-service';

export type GetTrackingEventServiceDataResponse =
  | Omit<TrackingEventWithServiceData, keyof TrackingEvent>
  | false;

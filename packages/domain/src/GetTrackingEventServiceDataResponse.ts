import { TrackingEventInput, TrackingEventInputWithServiceData } from '@tinynudge/pomello-service';

export type GetTrackingEventServiceDataResponse =
  | Omit<TrackingEventInputWithServiceData, keyof TrackingEventInput>
  | false;

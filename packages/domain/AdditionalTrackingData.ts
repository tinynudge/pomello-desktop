import { PomelloTrackingEvent } from './PomelloTrackingEvent';

export type AdditionalTrackingData = Pick<PomelloTrackingEvent, 'parent_service_id'>;

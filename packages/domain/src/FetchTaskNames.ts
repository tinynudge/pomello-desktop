import { TrackingEvent } from '@tinynudge/pomello-service';
import { TaskNamesById } from './TaskNamesById';

export type FetchTaskNames = (events: TrackingEvent[]) => Promise<TaskNamesById>;

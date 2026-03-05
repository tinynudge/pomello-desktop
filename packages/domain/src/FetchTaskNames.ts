import { ServiceId } from './ServiceId';
import { TaskNamesById } from './TaskNamesById';

export type FetchTaskNames = (ids: ServiceId[]) => Promise<TaskNamesById>;

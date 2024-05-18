import { PomelloEvent } from '@tinynudge/pomello-service';
import { PomelloEventType } from './PomelloEventType';

export type PomelloEventListeners = Partial<
  Record<PomelloEventType, (event: PomelloEvent) => void>
>;

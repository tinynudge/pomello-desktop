import {
  CreatedPomelloTrackingEvent,
  PomelloApiResponse,
  PomelloTrackingEvent,
} from '@pomello-desktop/domain';
import { PomelloApiContext } from './createPomelloApi';

export const logEvent = async (
  { client }: PomelloApiContext,
  event: PomelloTrackingEvent
): Promise<CreatedPomelloTrackingEvent> => {
  const { data } = await client
    .post('events', {
      json: {
        ...event,
        start_time: Math.round(event.start_time / 1000),
      },
    })
    .json<PomelloApiResponse<CreatedPomelloTrackingEvent>>();

  return data;
};

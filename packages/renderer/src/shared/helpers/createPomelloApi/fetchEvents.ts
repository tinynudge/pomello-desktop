import { FetchEventsOptions, PomelloApiResponse } from '@pomello-desktop/domain';
import { TrackingEvent } from '@tinynudge/pomello-service';
import { PomelloApiContext } from './createPomelloApi';

export const fetchEvents = async (
  { client }: PomelloApiContext,
  { startDate, endDate }: FetchEventsOptions
) => {
  const { data } = await client
    .get<PomelloApiResponse<TrackingEvent[]>>('events', {
      searchParams: {
        startDate,
        endDate: endDate ?? startDate,
      },
    })
    .json();

  return data;
};

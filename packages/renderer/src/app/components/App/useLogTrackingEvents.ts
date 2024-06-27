import { usePomelloActions } from '@/app/context/PomelloContext';
import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useMaybeService } from '@/shared/context/ServiceContext';
import { createEffect } from 'solid-js';

export const useLogTrackingEvents = () => {
  const { setSaveTrackingEvent } = usePomelloActions();
  const pomelloApi = usePomelloApi();
  const service = useMaybeService();

  createEffect(() => {
    setSaveTrackingEvent(async ({ currentTaskId, event }) => {
      if (!pomelloApi.hasToken()) {
        return false;
      }

      const serviceData = service()?.getTrackingEventServiceData?.(currentTaskId);

      if (!serviceData) {
        return false;
      }

      return pomelloApi.logEvent({
        ...event,
        ...serviceData,
      });
    });
  });
};

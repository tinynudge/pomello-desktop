import { usePomelloService } from '@/app/context/PomelloContext';
import { useMaybeService } from '@/shared/context/ServiceContext';
import { PomelloEventType } from '@pomello-desktop/domain';
import { createEffect, onCleanup } from 'solid-js';

export const useEmitPomelloEvents = () => {
  const pomelloService = usePomelloService();
  const getService = useMaybeService();

  createEffect(() => {
    const pomelloEventListeners = getService()?.pomelloEventListeners;

    if (!pomelloEventListeners) {
      return;
    }

    const removeListeners = Object.entries(pomelloEventListeners).map(([eventType, handler]) => {
      pomelloService.on(eventType as PomelloEventType, handler);

      return () => {
        pomelloService.off(eventType as PomelloEventType, handler);
      };
    });

    onCleanup(() => {
      removeListeners.forEach(removeListener => removeListener());
    });
  });
};

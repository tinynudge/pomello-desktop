import { usePomelloService } from '@/app/context/PomelloContext';
import { useStore, useStoreActions } from '@/app/context/StoreContext';
import { useRuntime } from '@/shared/context/RuntimeContext';
import { createEffect, on, onCleanup, onMount } from 'solid-js';

export const useMonitorPowerChange = () => {
  const { logger } = useRuntime();
  const { setSuspensionState } = useStoreActions();
  const service = usePomelloService();
  const store = useStore();

  createEffect(
    on(
      () => store.isSuspended,
      isSuspended => {
        if (isSuspended) {
          logger.debug('Will suspend Pomello service');

          service.suspendService();
        } else {
          logger.debug('Will resume Pomello service');

          service.resumeService();
        }
      },
      { defer: true }
    )
  );

  onMount(() => {
    const unsubscribe = window.app.onPowerMonitorChange(status => {
      setSuspensionState(status === 'suspend');
    });

    onCleanup(unsubscribe);
  });
};

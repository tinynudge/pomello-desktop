import { useHotkeys } from '@/app/context/HotkeysContext';
import { useStore } from '@/app/context/StoreContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { useMaybeService } from '@/shared/context/ServiceContext';

export const useOpenTask = () => {
  const { registerHotkeys } = useHotkeys();
  const getService = useMaybeService();
  const store = useStore();
  const t = useTranslate();

  registerHotkeys({
    openInBrowser: () => {
      const currentTaskId = store.pomelloState.currentTaskId;
      const service = getService();

      if (!service) {
        return;
      }

      if (!service.onTaskOpen) {
        new Notification(t('openTaskDisabledHeading'), {
          body: t('serviceActionUnavailable', { service: service.displayName }),
        });
      } else if (currentTaskId) {
        service.onTaskOpen({
          openUrl: window.app.openUrl,
          taskId: currentTaskId,
        });
      }
    },
  });
};

import { selectCurrentTaskId } from '@/app/appSlice';
import useHotkeys from '@/app/hooks/useHotkeys';
import useTranslation from '@/shared/hooks/useTranslation';
import { Service } from '@domain';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useOpenTask = (service?: Service) => {
  const { registerHotkeys } = useHotkeys();
  const { t } = useTranslation();

  const currentTaskId = useSelector(selectCurrentTaskId);

  useEffect(() => {
    return registerHotkeys({
      openInBrowser: () => {
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
  }, [currentTaskId, registerHotkeys, service, t]);
};

export default useOpenTask;

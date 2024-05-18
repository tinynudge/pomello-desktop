import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { usePomelloConfig, useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { SerializableHttpError } from '@/shared/helpers/SerializableHttpError';
import { createQuery } from '@tanstack/solid-query';
import { createEffect } from 'solid-js';
import { unwrap } from 'solid-js/store';

export const useCheckPomelloAccount = () => {
  const config = usePomelloConfig();
  const pomelloApi = usePomelloApi();
  const settings = useSettings();
  const t = useTranslate();

  const user = createQuery(() => ({
    queryKey: ['pomelloUser'],
    queryFn: async () => {
      if (!config.store.token) {
        return Promise.reject(new Error('NO_TOKEN'));
      }

      return pomelloApi.fetchUser();
    },
    cacheTime: Infinity,
    refetchInterval: 60 * 1000 * 10,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    suspense: false,
    useErrorBoundary: false,
  }));

  createEffect(() => {
    if (config.store.token) {
      user.refetch();
    }
  });

  createEffect(() => {
    if (user.data) {
      config.actions.userFetched(unwrap(user.data));
    }
  });

  createEffect(() => {
    if (!user.error) {
      return;
    }

    if (user.error instanceof SerializableHttpError && user.error.response.status === 500) {
      new Notification(t('pomelloApiUnresponsiveTitle'));

      return;
    }

    if (
      user.error.message !== 'NO_TOKEN' &&
      user.error instanceof SerializableHttpError &&
      user.error.response.status !== 401
    ) {
      return;
    }

    config.actions.userInvalidated();

    if (settings.checkPomelloStatus) {
      showUnconnectedDialog();
    }
  });

  const showUnconnectedDialog = async () => {
    const { response } = await window.app.showMessageBox({
      type: 'info',
      buttons: [
        t('pomelloAccountUnconnectedDialogConfirm'),
        t('pomelloAccountUnconnectedDialogCancel'),
        t('pomelloAccountUnconnectedDialogDisable'),
      ],
      message: t('pomelloAccountUnconnectedDialogMessage'),
      detail: t('pomelloAccountUnconnectedDialogDescription'),
      defaultId: 0,
      cancelId: 1,
    });

    if (response === 0) {
      return window.app.showAuthWindow({
        type: 'pomello',
        action: 'authorize',
      });
    }

    if (response === 2) {
      window.app.updateSetting('checkPomelloStatus', false);
    }
  };
};

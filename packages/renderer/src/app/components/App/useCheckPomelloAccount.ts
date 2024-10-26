import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { usePomelloConfig, useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { SerializableHttpError } from '@/shared/helpers/SerializableHttpError';
import { PomelloUser } from '@pomello-desktop/domain';
import { useQueryClient } from '@tanstack/solid-query';
import { createEffect, on } from 'solid-js';

const sleep = (timeout: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });

export const useCheckPomelloAccount = () => {
  const queryClient = useQueryClient();
  const config = usePomelloConfig();
  const pomelloApi = usePomelloApi();
  const settings = useSettings();
  const t = useTranslate();

  let timeoutId: number | undefined;

  createEffect(
    on(
      () => config.store.user?.type === 'premium',
      () => {
        queryClient.invalidateQueries({
          refetchType: 'all',
          predicate: ({ queryKey }) => queryKey.at(0) === 'tasks',
        });
      }
    )
  );

  createEffect(
    on(
      () => config.store.token,
      token => {
        if (!token) {
          return;
        }

        if (timeoutId) {
          clearTimeout(timeoutId);

          timeoutId = undefined;
        }

        checkPomelloAccount();
      },
      { defer: true }
    )
  );

  const checkPomelloAccount = async () => {
    await setPomelloUser();

    timeoutId = window.setTimeout(checkPomelloAccount, 1000 * 60 * 10);
  };

  const setPomelloUser = async (): Promise<void> => {
    try {
      const user = await fetchPomelloUser()
        .catch(error => retryFetchPomelloUser(error, 2000))
        .catch(error => retryFetchPomelloUser(error, 8000));

      config.actions.userFetched(user);
    } catch (error) {
      if (!navigator.onLine) {
        return;
      }

      if (error instanceof SerializableHttpError && error.response.status === 500) {
        new Notification(t('pomelloApiUnresponsiveTitle'));

        return;
      }

      if (
        error !== 'NO_TOKEN' &&
        error instanceof SerializableHttpError &&
        error.response.status !== 401
      ) {
        return;
      }

      config.actions.userInvalidated();

      if (settings.checkPomelloStatus) {
        await showUnconnectedDialog();
      }
    }
  };

  const fetchPomelloUser = async (): Promise<PomelloUser> => {
    if (!config.store.token) {
      throw 'NO_TOKEN';
    }

    return pomelloApi.fetchUser();
  };

  const retryFetchPomelloUser = async (error: unknown, timeout: number): Promise<PomelloUser> => {
    if (import.meta.env.MODE === 'test') {
      throw error;
    }

    await sleep(timeout);

    return fetchPomelloUser();
  };

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

  checkPomelloAccount();
};

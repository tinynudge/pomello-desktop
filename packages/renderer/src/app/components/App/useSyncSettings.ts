import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { usePomelloConfig, useRuntime, useSettings } from '@/shared/context/RuntimeContext';
import { createEffect, on } from 'solid-js';

export const useSyncSettings = () => {
  const { logger } = useRuntime();
  const config = usePomelloConfig();
  const pomelloApi = usePomelloApi();
  const settings = useSettings();

  let currentTimestamp = 0;

  createEffect(
    on(
      () => config.store.token,
      token => {
        if (token) {
          reconcileSettings();
        }
      }
    )
  );

  createEffect(
    on(
      () => settings.timestamp,
      timestamp => {
        if (!config.store.token || !timestamp || timestamp <= currentTimestamp) {
          return;
        }

        currentTimestamp = timestamp;

        updateRemoteSettings();
      },
      { defer: true }
    )
  );

  const reconcileSettings = async () => {
    if (!navigator.onLine) {
      return;
    }

    try {
      const [localSettings, remoteSettings] = await Promise.all([
        window.app.getSettings(),
        pomelloApi.fetchSettings(),
      ]);

      const localTimestamp = localSettings.timestamp ?? 0;
      const remoteTimestamp = remoteSettings?.timestamp ?? 0;

      if (remoteSettings && remoteTimestamp > localTimestamp) {
        // Remote is newer — pull it down. The incoming settings object already
        // contains the remote timestamp so handleUpdateSettings preserves it
        // (does not re-stamp). The store-change broadcast updates the reactive
        // store; the push effect above sees ts === currentTimestamp and skips.
        currentTimestamp = remoteTimestamp;

        await window.app.updateSettings(remoteSettings);

        logger.debug('Did pull remote settings');
      } else if (localTimestamp > remoteTimestamp) {
        currentTimestamp = localTimestamp;

        await pomelloApi.saveSettings(localSettings);

        logger.debug('Did push local settings');
      } else if (localTimestamp === remoteTimestamp) {
        currentTimestamp = localTimestamp;

        logger.debug('Did reconcile settings');
      }
    } catch (error) {
      logger.error('Failed to reconcile settings', error);
    }
  };

  const updateRemoteSettings = async () => {
    if (!navigator.onLine) {
      return;
    }

    try {
      const local = await window.app.getSettings();

      await pomelloApi.saveSettings(local);

      logger.debug('Did push local settings');
    } catch (error) {
      logger.error('Failed to push local settings', error);
    }
  };
};

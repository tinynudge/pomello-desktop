import { generateSettings } from '../__fixtures__/generateSettings';
import { renderApp, waitFor } from '../__fixtures__/renderApp';

describe('useSyncSettings', () => {
  it('should pull remote settings when the remote timestamp is newer', async () => {
    const remoteTimestamp = Date.now() + 10_000;

    const { appApi } = renderApp({
      settings: {
        taskTime: 1500,
        timestamp: Date.now() - 10_000,
      },
      pomelloApi: {
        fetchSettings: generateSettings({
          taskTime: 3000,
          timestamp: remoteTimestamp,
        }),
      },
    });

    await waitFor(() => {
      expect(appApi.updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ taskTime: 3000, timestamp: remoteTimestamp })
      );
    });
  });

  it('should push local settings when the local timestamp is newer', async () => {
    const localTimestamp = Date.now() + 10_000;

    const { pomelloApi } = renderApp({
      settings: {
        taskTime: 3000,
        timestamp: localTimestamp,
      },
      pomelloApi: {
        fetchSettings: generateSettings({
          taskTime: 1500,
          timestamp: Date.now() - 10_000,
        }),
      },
    });

    await waitFor(() => {
      expect(pomelloApi.saveSettings).toHaveBeenCalledWith(
        expect.objectContaining({ taskTime: 3000, timestamp: localTimestamp })
      );
    });
  });

  it('should not update anything when local and remote timestamps are equal', async () => {
    const sharedTimestamp = Date.now();

    const { appApi, pomelloApi } = renderApp({
      settings: {
        timestamp: sharedTimestamp,
      },
      pomelloApi: {
        fetchSettings: generateSettings({
          timestamp: sharedTimestamp,
        }),
      },
    });

    expect(pomelloApi.fetchSettings).toHaveBeenCalled();
    expect(appApi.updateSettings).not.toHaveBeenCalled();
    expect(pomelloApi.saveSettings).not.toHaveBeenCalled();
  });

  it('should not attempt to sync when there is no token', async () => {
    const { pomelloApi } = renderApp({
      pomelloConfig: {
        token: undefined,
      },
    });

    // Give the hook a chance to run if it were going to
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(pomelloApi.fetchSettings).not.toHaveBeenCalled();
    expect(pomelloApi.saveSettings).not.toHaveBeenCalled();
  });

  it('should not push settings back after pulling from remote', async () => {
    const remoteTimestamp = Date.now() + 10_000;
    const localTimestamp = Date.now() - 10_000;

    const { pomelloApi } = renderApp({
      settings: {
        timestamp: localTimestamp,
      },
      pomelloApi: {
        fetchSettings: generateSettings({
          timestamp: remoteTimestamp,
        }),
      },
    });

    expect(pomelloApi.fetchSettings).toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(pomelloApi.saveSettings).not.toHaveBeenCalled();
  });

  it('should push to remote when a local setting is changed', async () => {
    const sharedTimestamp = 1_000_000;

    const { appApi, pomelloApi } = renderApp({
      settings: {
        taskTime: 1500,
        timestamp: sharedTimestamp,
      },
      pomelloApi: {
        fetchSettings: generateSettings({
          timestamp: sharedTimestamp,
        }),
      },
    });

    expect(pomelloApi.fetchSettings).toHaveBeenCalled();

    await appApi.updateSetting('taskTime', 3000);

    expect(pomelloApi.saveSettings).toHaveBeenCalledWith(expect.objectContaining({ taskTime: 3000 }));
  });

  it('should reconcile the settings when a token is added after mount', async () => {
    const remoteTimestamp = Date.now() + 5_000;

    const { pomelloApi, pomelloConfig } = renderApp({
      pomelloConfig: {
        token: undefined,
      },
      pomelloApi: {
        fetchSettings: generateSettings({ timestamp: remoteTimestamp }),
      },
    });

    await new Promise(resolve => setTimeout(resolve, 30));

    expect(pomelloApi.fetchSettings).not.toHaveBeenCalled();

    pomelloConfig.set('token', 'MY_POMELLO_TOKEN');

    await waitFor(() => {
      expect(pomelloApi.fetchSettings).toHaveBeenCalled();
    });
  });
});

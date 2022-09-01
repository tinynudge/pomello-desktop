import { AppProtocol } from '@domain';
import { Howl } from 'howler';
import { vi } from 'vitest';
import mountApp from '../__fixtures__/mountApp';

describe('App - Timer sounds', () => {
  it('should load the sounds when the app loads', async () => {
    vi.mock('howler');
    const MockHowl = vi.mocked(Howl);

    const assetPath = '/src/app/hooks/useTimerSounds/assets';

    mountApp();

    expect(MockHowl).toHaveBeenCalledTimes(3);
    expect(MockHowl).toHaveBeenCalledWith({ src: `${assetPath}/ding.mp3` });
    expect(MockHowl).toHaveBeenCalledWith({ src: `${assetPath}/egg-timer.ogg` });
    expect(MockHowl).toHaveBeenCalledWith({ src: `${assetPath}/wind-up.mp3` });
  });

  it('should load custom sounds', async () => {
    vi.mock('howler');

    mountApp({
      settings: {
        taskTimerStartSound: 'custom',
        sounds: {
          custom: {
            name: 'My custom sound',
            path: 'my/custom/path.mp3',
          },
        },
      },
    });

    const MockHowl = vi.mocked(Howl);

    expect(MockHowl).toHaveBeenCalledWith({ src: `${AppProtocol.Audio}my/custom/path.mp3` });
  });
});

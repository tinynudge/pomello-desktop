import { AppProtocol } from '@pomello-desktop/domain';
import { Howl } from 'howler';
import { vi } from 'vitest';
import { renderApp } from '../__fixtures__/renderApp';

describe('App - Timer sounds', () => {
  it('should load the sounds when the app loads', async () => {
    vi.mock('howler');
    const MockHowl = vi.mocked(Howl);

    const { simulate } = renderApp();

    await simulate.waitForSelectTaskView();

    expect(MockHowl).toHaveBeenCalledTimes(3);
    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://sounds/wind-up.mp3' });
    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://sounds/egg-timer.mp3' });
    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://sounds/ding.mp3' });
  });

  it('should load custom sounds', async () => {
    vi.mock('howler');
    const MockHowl = vi.mocked(Howl);

    const { simulate } = renderApp({
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

    await simulate.waitForSelectTaskView();

    expect(MockHowl).toHaveBeenCalledWith({ src: `${AppProtocol.Audio}my/custom/path.mp3` });
  });
});

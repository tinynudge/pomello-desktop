import { AppProtocol } from '@pomello-desktop/domain';
import { Howl } from 'howler';
import { vi } from 'vitest';
import { renderApp } from '../__fixtures__/renderApp';

describe('App - Timer sounds', () => {
  beforeAll(() => {
    vi.mock('howler');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.mocked(Howl).mockRestore();
  });

  it('should load the sounds when the app loads', async () => {
    const MockHowl = vi.mocked(Howl);

    const { simulate } = renderApp();

    await simulate.waitForSelectTaskView();

    expect(MockHowl).toHaveBeenCalledTimes(3);
    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://sounds/wind-up.mp3' });
    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://sounds/egg-timer.mp3' });
    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://sounds/ding.mp3' });
  });

  it('should load custom sounds', async () => {
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

  it('should not load the sound if the volume is 0', async () => {
    const MockHowl = vi.mocked(Howl);

    const { simulate } = renderApp({
      settings: {
        longBreakTimerEndVol: 0,
        longBreakTimerStartVol: 0,
        longBreakTimerTickVol: 0,
        shortBreakTimerEndVol: 0,
        shortBreakTimerStartVol: 0,
        shortBreakTimerTickVol: 0,
        taskTimerEndVol: 0,
        taskTimerStartVol: 0,
        taskTimerTickVol: 0,
      },
    });

    await simulate.waitForSelectTaskView();

    expect(MockHowl).not.toHaveBeenCalled();
  });
});

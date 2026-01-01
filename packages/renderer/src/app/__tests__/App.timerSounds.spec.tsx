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
    vi.restoreAllMocks();
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

    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://my/custom/path.mp3' });
  });

  it('should not load the sound if the volume is 0', async () => {
    const MockHowl = vi.mocked(Howl);

    renderApp({
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

    expect(MockHowl).not.toHaveBeenCalled();
  });

  it('should not load custom sounds for free users', async () => {
    const MockHowl = vi.mocked(Howl);

    const { pomelloConfig } = renderApp({
      pomelloConfig: {
        user: {
          email: 'thomas@tester.com',
          name: 'Thomas Tester',
          timezone: 'America/Chicago',
          type: 'free',
        },
      },
      settings: {
        taskTimerStartSound: 'custom',
        taskTimerStartVol: 1,
        sounds: {
          custom: {
            name: 'My custom sound',
            path: 'my/custom/path.mp3',
          },
        },
      },
    });

    expect(MockHowl).not.toHaveBeenCalledWith({ src: 'audio://my/custom/path.mp3' });

    pomelloConfig.set('user', {
      email: 'pam@premium.com',
      name: 'Premium Pam',
      timezone: 'America/Chicago',
      type: 'premium',
    });

    expect(MockHowl).toHaveBeenCalledWith({ src: 'audio://my/custom/path.mp3' });
  });
});

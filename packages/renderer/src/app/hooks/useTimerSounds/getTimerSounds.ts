import { AppProtocol, Settings, TimerPhase, TimerSounds, TimerType } from '@domain';
import { Howl } from 'howler';
import ding from './assets/ding.mp3';
import eggTimer from './assets/egg-timer.ogg';
import windUp from './assets/wind-up.mp3';
import createSound from './createSound';

type TimerSettingKey =
  | 'taskTimerStart'
  | 'taskTimerTick'
  | 'taskTimerEnd'
  | 'shortBreakTimerStart'
  | 'shortBreakTimerTick'
  | 'shortBreakTimerEnd'
  | 'longBreakTimerStart'
  | 'longBreakTimerTick'
  | 'longBreakTimerEnd';

type AudioCache = Map<string, Howl>;

const timerTypeMap: Record<TimerType, string> = {
  [TimerType.task]: 'task',
  [TimerType.shortBreak]: 'shortBreak',
  [TimerType.longBreak]: 'longBreak',
};

const timerPhaseMap: Record<TimerPhase, string> = {
  start: 'TimerStart',
  tick: 'TimerTick',
  end: 'TimerEnd',
};

const defaultSounds: Record<string, string | undefined> = {
  'egg-timer': eggTimer,
  'wind-up': windUp,
  ding,
};

let audioCache: AudioCache = new Map();

const getSettingKey = (timerType: TimerType, phase: TimerPhase): TimerSettingKey => {
  return `${timerTypeMap[timerType]}${timerPhaseMap[phase]}` as TimerSettingKey;
};

const getTimerSounds = (settings: Settings, previousTimerSounds?: TimerSounds): TimerSounds => {
  const phases: TimerPhase[] = ['start', 'tick', 'end'];

  const timerSounds: TimerSounds = {
    [TimerType.task]: { start: null, tick: null, end: null },
    [TimerType.shortBreak]: { start: null, tick: null, end: null },
    [TimerType.longBreak]: { start: null, tick: null, end: null },
  };

  const newAudioCache: AudioCache = new Map();

  Object.values(TimerType).forEach(type => {
    phases.forEach(phase => {
      const settingKey = getSettingKey(type, phase);

      const soundId = settings[`${settingKey}Sound`];
      const volume = Number(settings[`${settingKey}Vol`]);

      let sound = null;
      let wasPlaying = false;

      const previousSound = previousTimerSounds?.[type][phase];
      if (previousSound?.isPlaying()) {
        wasPlaying = true;
        previousSound.pause();
      }

      if (soundId) {
        let soundSource = defaultSounds[soundId];

        if (!soundSource) {
          const customSource = settings.sounds[soundId]?.path;

          if (customSource) {
            soundSource = `${AppProtocol.Audio}${customSource}`;
          }
        }

        if (soundSource) {
          let audio =
            newAudioCache.get(soundSource) ??
            audioCache.get(soundSource) ??
            new Howl({ src: soundSource });

          newAudioCache.set(soundSource, audio);

          sound = createSound(audio, volume, phase === 'tick');

          if (wasPlaying) {
            sound.play();
          }
        }
      }

      timerSounds[type][phase] = sound;
    });
  });

  audioCache = newAudioCache;

  return timerSounds;
};

export default getTimerSounds;

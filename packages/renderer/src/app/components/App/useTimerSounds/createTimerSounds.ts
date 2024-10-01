import { getTimerSettingKey } from '@/shared/helpers/getTimerSettingKey';
import { isDefaultSoundId } from '@/shared/helpers/isDefaultSoundId';
import { AppProtocol, Settings, Sound, TimerPhase, TimerType } from '@pomello-desktop/domain';
import { Howl } from 'howler';
import { createSound } from './createSound';

export type TimerSounds = Record<TimerType, Record<TimerPhase, Sound | null>>;

type AudioCache = Map<string, Howl>;

let audioCache: AudioCache = new Map();

export const createTimerSounds = (
  settings: Settings,
  previousTimerSounds?: TimerSounds
): TimerSounds => {
  const phases: TimerPhase[] = ['start', 'tick', 'end'];

  const timerSounds: TimerSounds = {
    [TimerType.task]: { start: null, tick: null, end: null },
    [TimerType.shortBreak]: { start: null, tick: null, end: null },
    [TimerType.longBreak]: { start: null, tick: null, end: null },
  };

  const newAudioCache: AudioCache = new Map();

  Object.values(TimerType).forEach(type => {
    phases.forEach(phase => {
      const settingKey = getTimerSettingKey(type, phase);

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
        let soundSource = isDefaultSoundId(soundId)
          ? window.app.getSoundPath(soundId)
          : settings.sounds[soundId]?.path;

        if (soundSource) {
          soundSource = `${AppProtocol.Audio}${soundSource}`;
        }

        if (soundSource) {
          const audio =
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

import { DefaultSoundId } from '@pomello-desktop/domain';

export const isDefaultSoundId = (soundId: string): soundId is DefaultSoundId => {
  return soundId === 'ding' || soundId === 'egg-timer' || soundId === 'wind-up';
};

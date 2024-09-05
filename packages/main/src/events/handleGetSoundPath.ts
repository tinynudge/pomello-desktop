import { getResourcesPath } from '@/helpers/getResourcesPath';
import { DefaultSoundId } from '@pomello-desktop/domain';
import { IpcMainEvent } from 'electron';
import { resolve } from 'path';

const soundsMap: Record<DefaultSoundId, string> = {
  'egg-timer': 'egg-timer.ogg',
  'wind-up': 'wind-up.mp3',
  ding: 'ding.mp3',
};

export const handleGetSoundPath = (event: IpcMainEvent, soundId: DefaultSoundId): void => {
  event.returnValue = resolve(getResourcesPath(), 'sounds', soundsMap[soundId]);
};

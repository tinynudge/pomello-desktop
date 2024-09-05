import { AppEvent, DefaultSoundId } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getSoundPath = (soundId: DefaultSoundId): string =>
  ipcRenderer.sendSync(AppEvent.GetSoundPath, soundId);

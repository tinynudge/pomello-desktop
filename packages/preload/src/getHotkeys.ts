import { AppEvent, LabeledHotkeys } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const getHotkeys = (): Promise<LabeledHotkeys> => ipcRenderer.invoke(AppEvent.GetHotkeys);

export default getHotkeys;

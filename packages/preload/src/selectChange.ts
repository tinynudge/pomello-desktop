import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const selectChange = (optionId: string): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SelectChange, optionId);

export default selectChange;

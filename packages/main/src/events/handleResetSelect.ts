import runtime from '@/runtime';
import { AppEvent } from '@domain';

const handleResetSelect = async (): Promise<void> => {
  const select = runtime.windowManager.findOrFailWindow('select');

  select.webContents.send(AppEvent.ResetSelect);
};

export default handleResetSelect;

import windowManager from '@/helpers/windowManager';
import { AppEvent } from '@domain';

const handleResetSelect = async (): Promise<void> => {
  const select = windowManager.findOrFailWindow('select');

  select.webContents.send(AppEvent.ResetSelect);
};

export default handleResetSelect;

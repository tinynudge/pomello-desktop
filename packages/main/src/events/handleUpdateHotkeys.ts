import { formatHotkeys } from '@/helpers/formatHotkeys';
import { getHotkeys } from '@/helpers/getHotkeys';
import { runtime } from '@/runtime';
import { AppEvent, Hotkeys } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

export const handleUpdateHotkeys = async (
  _event: IpcMainInvokeEvent,
  updatedHotkeys: Partial<Hotkeys>
): Promise<void> => {
  const hotkeys = getHotkeys();

  hotkeys.set(updatedHotkeys);

  const formattedHotkeys = formatHotkeys(hotkeys.all());

  runtime.windowManager.getAllWindows().forEach(browserWindow => {
    browserWindow.webContents.send(AppEvent.HotkeysChange, formattedHotkeys);
  });
};

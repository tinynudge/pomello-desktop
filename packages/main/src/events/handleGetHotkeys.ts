import { appendHotkeyLabels } from '@/helpers/appendHotkeyLabels';
import { getHotkeys } from '@/helpers/getHotkeys';
import { LabeledHotkeys } from '@pomello-desktop/domain';

export const handleGetHotkeys = async (): Promise<LabeledHotkeys> => {
  const hotkeys = getHotkeys();

  return appendHotkeyLabels(hotkeys.all());
};

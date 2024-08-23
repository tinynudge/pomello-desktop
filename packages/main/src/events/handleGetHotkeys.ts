import { formatHotkeys } from '@/helpers/formatHotkeys';
import { getHotkeys } from '@/helpers/getHotkeys';
import { FormattedHotkeys } from '@pomello-desktop/domain';

export const handleGetHotkeys = async (): Promise<FormattedHotkeys> => {
  const hotkeys = getHotkeys();

  return formatHotkeys(hotkeys.all());
};

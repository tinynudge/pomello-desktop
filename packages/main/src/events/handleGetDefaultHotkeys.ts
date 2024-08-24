import { formatHotkeys } from '@/helpers/formatHotkeys';
import { defaultHotkeys } from '@/helpers/getHotkeys';
import { CompleteFormattedHotkeys } from '@pomello-desktop/domain';

export const handleGetDefaultHotkeys = async (): Promise<CompleteFormattedHotkeys> => {
  return formatHotkeys(defaultHotkeys) as CompleteFormattedHotkeys;
};

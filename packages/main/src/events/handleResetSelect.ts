import hideSelectWindow from '@/helpers/hideSelectWindow';

const handleResetSelect = async (): Promise<void> => {
  hideSelectWindow(true);
};

export default handleResetSelect;

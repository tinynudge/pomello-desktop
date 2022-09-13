import { clipboard } from 'electron';

const writeClipboardText = (text: string): void => {
  clipboard.writeText(text);
};

export default writeClipboardText;

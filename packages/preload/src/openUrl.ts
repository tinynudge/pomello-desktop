import { shell } from 'electron';

const openUrl = (url: string) => {
  shell.openExternal(url);
};

export default openUrl;

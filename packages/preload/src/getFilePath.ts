import { webUtils } from 'electron';

export const getFilePath = (file: File): string => webUtils.getPathForFile(file);

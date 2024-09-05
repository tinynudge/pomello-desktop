import { join } from 'path';

const resourcesPath = import.meta.env.DEV ? join(__dirname, '../../..') : process.resourcesPath;

export const getResourcesPath = (): string => resourcesPath;

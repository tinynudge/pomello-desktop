import { LabeledHotkeys } from '@domain';

const getHotkeys = (): Promise<LabeledHotkeys> => window.app.getHotkeys();

export default getHotkeys;

import { Rectangle } from 'electron';

export type SetSelectBoundsOptions = {
  bounds: Partial<Rectangle>;
  orientation?: 'bottom' | 'top';
};

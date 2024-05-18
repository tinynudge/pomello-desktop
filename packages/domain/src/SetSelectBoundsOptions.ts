import { Rectangle } from 'electron';

export interface SetSelectBoundsOptions {
  bounds: Partial<Rectangle>;
  orientation?: 'bottom' | 'top';
}

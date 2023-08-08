import { type Rectangle } from 'electron';

export interface SetSelectBoundsParams {
  bounds: Partial<Rectangle>;
  orientation?: 'bottom' | 'top';
}

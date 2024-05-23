import { Rectangle } from 'electron';

export const sanitizeBounds = (bounds: Partial<Rectangle>): Partial<Rectangle> => {
  return Object.entries(bounds).reduce<Partial<Rectangle>>(
    (newBounds, [key, value]) => ({
      ...newBounds,
      [key]: Math.round(value),
    }),
    {}
  );
};

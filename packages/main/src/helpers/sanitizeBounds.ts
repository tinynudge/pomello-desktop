import { Rectangle } from 'electron';

const sanitizeBounds = (bounds: Partial<Rectangle>): Partial<Rectangle> => {
  return Object.entries(bounds).reduce<Partial<Rectangle>>(
    (newBounds, [key, value]) => ({
      ...newBounds,
      [key]: Math.round(value),
    }),
    {}
  );
};

export default sanitizeBounds;

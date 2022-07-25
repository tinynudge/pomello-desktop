import runtime from '@/runtime';
import { IpcMainInvokeEvent, Rectangle } from 'electron';

const handleSetSelectBounds = (_event: IpcMainInvokeEvent, bounds: Partial<Rectangle>): void => {
  const selectWindow = runtime.windowManager.findOrFailWindow('select');

  const sanitizedBounds = Object.entries(bounds).reduce<Partial<Rectangle>>(
    (newBounds, [key, value]) => ({
      ...newBounds,
      [key]: Math.round(value),
    }),
    {}
  );

  selectWindow.setBounds(sanitizedBounds);
};

export default handleSetSelectBounds;

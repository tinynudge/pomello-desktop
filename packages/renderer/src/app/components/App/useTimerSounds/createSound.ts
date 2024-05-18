import { Sound } from '@pomello-desktop/domain';
import { Howl } from 'howler';

export const createSound = (audio: Howl, volume: number, shouldLoop: boolean): Sound => {
  // Keep track of this internally instead of using audio.isPlaying() because
  // shared audio instances can pollute one another.
  let isPlaying = false;

  return {
    isPlaying: () => isPlaying,
    play: () =>
      new Promise<void>(resolve => {
        audio.seek(0);
        audio.volume(volume);
        audio.loop(shouldLoop);
        audio.once('end', () => {
          if (!shouldLoop) {
            isPlaying = false;
          }

          resolve();
        });

        isPlaying = true;

        audio.play();
      }),
    pause: () => {
      isPlaying = false;

      audio.pause();
    },
    stop: () => {
      isPlaying = false;

      audio.stop();
    },
  };
};

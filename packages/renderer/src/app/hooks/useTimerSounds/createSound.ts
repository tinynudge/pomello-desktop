import { Sound } from '@domain';
import { Howl } from 'howler';

const createSound = (audio: Howl, volume: number, shouldLoop: boolean): Sound => {
  return {
    isPlaying: () => audio.playing(),
    play: () =>
      new Promise<void>(resolve => {
        audio.volume(volume);
        audio.loop(shouldLoop);
        audio.once('end', () => {
          resolve();
        });

        audio.play();
      }),
    pause: () => {
      audio.pause();
    },
    stop: () => {
      audio.stop();
    },
  };
};

export default createSound;

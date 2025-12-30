import { usePomelloService } from '@/app/context/PomelloContext';
import { useSettings } from '@/shared/context/RuntimeContext';
import { PomelloEvent } from '@tinynudge/pomello-service';
import { createMemo, onCleanup, onMount } from 'solid-js';
import { TimerSounds, createTimerSounds } from './createTimerSounds';

export const useTimerSounds = (): void => {
  const pomelloService = usePomelloService();
  const settings = useSettings();

  const getTimerSounds = createMemo<TimerSounds>(previousSound =>
    createTimerSounds(settings, previousSound)
  );

  onMount(() => {
    const handleTimerStart = ({ timer }: PomelloEvent) => {
      if (timer) {
        const startSound = getTimerSounds()[timer.type].start;
        const tickSound = getTimerSounds()[timer.type].tick;

        if (startSound) {
          startSound.play().then(tickSound?.play);
        } else if (tickSound) {
          tickSound.play();
        }
      }
    };

    const handleTimerPause = ({ timer }: PomelloEvent) => {
      if (timer) {
        getTimerSounds()[timer.type].tick?.pause();
      }
    };

    const handleTimerResume = ({ timer }: PomelloEvent) => {
      if (timer) {
        getTimerSounds()[timer.type].tick?.play();
      }
    };

    const handleTimerEnd = ({ timer }: PomelloEvent) => {
      if (timer) {
        const { end, tick } = getTimerSounds()[timer.type];

        tick?.stop();
        end?.play();
      }
    };

    const handleTimerDestroy = ({ timer }: PomelloEvent) => {
      if (timer) {
        const { tick } = getTimerSounds()[timer.type];

        tick?.stop();
      }
    };

    pomelloService.on('timerStart', handleTimerStart);
    pomelloService.on('timerPause', handleTimerPause);
    pomelloService.on('timerResume', handleTimerResume);
    pomelloService.on('timerEnd', handleTimerEnd);
    pomelloService.on('timerDestroy', handleTimerDestroy);

    onCleanup(() => {
      pomelloService.off('timerStart', handleTimerStart);
      pomelloService.off('timerPause', handleTimerPause);
      pomelloService.off('timerResume', handleTimerResume);
      pomelloService.off('timerEnd', handleTimerEnd);
      pomelloService.off('timerDestroy', handleTimerDestroy);
    });
  });
};

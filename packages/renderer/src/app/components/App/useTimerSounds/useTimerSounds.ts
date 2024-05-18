import { usePomelloService } from '@/app/context/PomelloContext';
import { useSettings } from '@/shared/context/RuntimeContext';
import { TimerSounds } from '@pomello-desktop/domain';
import { PomelloEvent } from '@tinynudge/pomello-service';
import { createMemo, onCleanup, onMount } from 'solid-js';
import { createTimerSounds } from './createTimerSounds';

export const useTimerSounds = (): void => {
  const pomelloService = usePomelloService();
  const settings = useSettings();

  const timerSounds = createMemo<TimerSounds>(previousSound =>
    createTimerSounds(settings, previousSound)
  );

  onMount(() => {
    const handleTimerStart = ({ timer }: PomelloEvent) => {
      if (timer) {
        const startSound = timerSounds()[timer.type].start;
        const tickSound = timerSounds()[timer.type].tick;

        if (startSound) {
          startSound.play().then(tickSound?.play);
        } else if (tickSound) {
          tickSound.play();
        }
      }
    };

    const handleTimerPause = ({ timer }: PomelloEvent) => {
      if (timer) {
        timerSounds()[timer.type].tick?.pause();
      }
    };

    const handleTimerResume = ({ timer }: PomelloEvent) => {
      if (timer) {
        timerSounds()[timer.type].tick?.play();
      }
    };

    const handleTimerEnd = ({ timer }: PomelloEvent) => {
      if (timer) {
        const { end, tick } = timerSounds()[timer.type];

        tick?.stop();
        end?.play();
      }
    };

    const handleTimerDestroy = ({ timer }: PomelloEvent) => {
      if (timer) {
        const { tick } = timerSounds()[timer.type];

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

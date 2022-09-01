import { selectSettings } from '@/app/appSlice';
import { TimerSounds } from '@domain';
import { PomelloEvent } from '@tinynudge/pomello-service';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import usePomelloService from '../usePomelloService';
import getTimerSounds from './getTimerSounds';

const useTimerSounds = (): void => {
  const pomelloService = usePomelloService();
  const settings = useSelector(selectSettings);

  const timerSounds = useRef<TimerSounds>(getTimerSounds(settings));

  useEffect(() => {
    timerSounds.current = getTimerSounds(settings, timerSounds.current);
  }, [settings]);

  useEffect(() => {
    const handleTimerStart = ({ timer }: PomelloEvent) => {
      if (timer) {
        const startSound = timerSounds.current[timer.type].start;
        const tickSound = timerSounds.current[timer.type].tick;

        if (startSound) {
          startSound.play().then(tickSound?.play);
        } else if (tickSound) {
          tickSound.play();
        }
      }
    };

    const handleTimerPause = ({ timer }: PomelloEvent) => {
      if (timer) {
        timerSounds.current[timer.type].tick?.pause();
      }
    };

    const handleTimerResume = ({ timer }: PomelloEvent) => {
      if (timer) {
        timerSounds.current[timer.type].tick?.play();
      }
    };

    const handleTimerEnd = ({ timer }: PomelloEvent) => {
      if (timer) {
        const { end, tick } = timerSounds.current[timer.type];

        tick?.stop();
        end?.play();
      }
    };

    const handleTimerDestroy = ({ timer }: PomelloEvent) => {
      if (timer) {
        const { tick } = timerSounds.current[timer.type];

        tick?.stop();
      }
    };

    pomelloService.on('timerStart', handleTimerStart);
    pomelloService.on('timerPause', handleTimerPause);
    pomelloService.on('timerResume', handleTimerResume);
    pomelloService.on('timerEnd', handleTimerEnd);
    pomelloService.on('timerDestroy', handleTimerDestroy);

    return () => {
      pomelloService.off('timerStart', handleTimerStart);
      pomelloService.off('timerPause', handleTimerPause);
      pomelloService.off('timerResume', handleTimerResume);
      pomelloService.off('timerEnd', handleTimerEnd);
      pomelloService.off('timerDestroy', handleTimerDestroy);
    };
  });
};

export default useTimerSounds;

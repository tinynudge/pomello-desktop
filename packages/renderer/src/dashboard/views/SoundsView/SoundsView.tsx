import { MainHeader } from '@/dashboard/components/MainHeader';
import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Option, OptionItem } from '@/ui/dashboard/Select';
import { TimerPhase, TimerType } from '@pomello-desktop/domain';
import { Component, For, createMemo } from 'solid-js';
import { SoundField } from './SoundField';

const timerPhases: TimerPhase[] = ['start', 'tick', 'end'];

export const SoundsView: Component = () => {
  const { getSetting } = useDashboard();
  const t = useTranslate();

  const getDefaultSounds = createMemo<Record<TimerPhase, OptionItem>>(() => ({
    start: {
      id: 'wind-up',
      label: t('sound.windUp'),
    },
    tick: {
      id: 'egg-timer',
      label: t('sound.eggTimer'),
    },
    end: {
      id: 'ding',
      label: t('sound.ding'),
    },
  }));

  const getSoundOptions = createMemo(() => {
    const options: Option[] = [
      getDefaultSounds().start,
      getDefaultSounds().tick,
      getDefaultSounds().end,
    ];

    const customSounds = getSetting('sounds');
    const customSoundOptions = Object.entries(customSounds).map(([id, { name }]) => ({
      id,
      label: name,
    }));

    if (customSoundOptions.length) {
      options.push({
        items: customSoundOptions,
        label: t('customSoundsGroup'),
      });
    }

    return options;
  });

  return (
    <>
      <MainHeader heading={t('routeSounds')} />
      <For each={Object.entries(TimerType)}>
        {([formattedType, type]) => (
          <Panel heading={t(`${formattedType}SoundsHeader`)} isPaddingDisabled>
            <Panel.List aria-label={t(`${formattedType}SoundsLabel`)}>
              <For each={timerPhases}>
                {phase => (
                  <SoundField
                    defaultSound={getDefaultSounds()[phase]}
                    soundOptions={getSoundOptions()}
                    staticTimerPhase={phase}
                    staticTimerType={type}
                  />
                )}
              </For>
            </Panel.List>
          </Panel>
        )}
      </For>
    </>
  );
};

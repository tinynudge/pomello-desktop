import { MainHeader } from '@/dashboard/components/MainHeader';
import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Select } from '@/ui/dashboard/Select';
import { Slider } from '@/ui/dashboard/Slider';
import { Component, For, createMemo } from 'solid-js';
import styles from './SoundsView.module.scss';

type TimerType = (typeof timerTypes)[number];

type TimerPhase = (typeof timerPhases)[number];

type TimerName = `${TimerType}Timer${Capitalize<TimerPhase>}`;

const timerTypes = ['task', 'shortBreak', 'longBreak'] as const;

const timerPhases = ['start', 'tick', 'end'] as const;

export const SoundsView: Component = () => {
  const { getSetting, stageSetting } = useDashboard();
  const t = useTranslate();

  const getDefaultSounds = createMemo(() => ({
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

  const getDefaultSoundOptions = createMemo(() => [
    getDefaultSounds().start,
    getDefaultSounds().tick,
    getDefaultSounds().end,
  ]);

  const handleSoundChange = (timerName: TimerName, sound: string) => {
    stageSetting(`${timerName}Sound`, sound);
  };

  const handleVolumeChange = (timerName: TimerName, volume: number) => {
    stageSetting(`${timerName}Vol`, volume);
  };

  const handleRestoreDefaultClick = (timerName: TimerName, phase: TimerPhase) => {
    stageSetting(`${timerName}Sound`, getDefaultSounds()[phase].id);
    stageSetting(`${timerName}Vol`, 1);
  };

  const getTimerName = (type: TimerType, phase: TimerPhase): TimerName =>
    `${type}Timer${phase.charAt(0).toUpperCase()}${phase.slice(1)}` as TimerName;

  return (
    <>
      <MainHeader heading={t('routeSounds')} />
      <For each={timerTypes}>
        {type => (
          <Panel heading={t(`${type}SoundsHeader`)} isPaddingDisabled>
            <Panel.List aria-label={t(`${type}SoundsLabel`)}>
              <For each={timerPhases}>
                {phase => {
                  const timerName = getTimerName(type, phase);

                  return (
                    <Panel.List.FormField
                      actions={[
                        {
                          onClick: () => handleRestoreDefaultClick(timerName, phase),
                          text: t('restoreDefault', { value: getDefaultSounds()[phase].label }),
                        },
                      ]}
                      for={`${type}-${phase}`}
                      label={t(`sounds.${phase}`)}
                    >
                      <Slider
                        aria-label={t(`sounds.${type}.${phase}.volume`)}
                        class={styles.volumeSlider}
                        max={1}
                        min={0}
                        onInput={event => handleVolumeChange(timerName, +event.currentTarget.value)}
                        step={0.1}
                        value={getSetting(`${timerName}Vol`) ?? 1}
                      />
                      <Select
                        aria-label={t(`sounds.${type}.${phase}.sound`)}
                        id={`${type}-${phase}`}
                        onChange={sound => handleSoundChange(timerName, sound)}
                        options={getDefaultSoundOptions()}
                        value={getSetting(`${timerName}Sound`) ?? undefined}
                      />
                    </Panel.List.FormField>
                  );
                }}
              </For>
            </Panel.List>
          </Panel>
        )}
      </For>
    </>
  );
};

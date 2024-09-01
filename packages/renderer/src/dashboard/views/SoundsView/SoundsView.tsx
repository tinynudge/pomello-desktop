import { MainHeader } from '@/dashboard/components/MainHeader';
import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Select } from '@/ui/dashboard/Select';
import { Component, For } from 'solid-js';

type TimerType = (typeof timerTypes)[number];

type TimerPhase = (typeof timerPhases)[number];

const timerTypes = ['task', 'shortBreak', 'longBreak'] as const;

const timerPhases = ['Start', 'Tick', 'End'] as const;

export const SoundsView: Component = () => {
  const { getSetting, stageSetting } = useDashboard();
  const t = useTranslate();

  const handleSoundChange = (type: TimerType, phase: TimerPhase, sound: string) => {
    stageSetting(`${type}Timer${phase}Sound`, sound);
  };

  const defaultSoundOptions = [
    {
      id: 'wind-up',
      label: t('sound.windUp'),
    },
    {
      id: 'egg-timer',
      label: t('sound.eggTimer'),
    },
    {
      id: 'ding',
      label: t('sound.ding'),
    },
  ];

  return (
    <>
      <MainHeader heading={t('routeSounds')} />
      <For each={timerTypes}>
        {type => (
          <Panel heading={t(`${type}SoundsHeader`)} isPaddingDisabled>
            <Panel.List aria-label={t(`${type}SoundsLabel`)}>
              <For each={timerPhases}>
                {phase => (
                  <Panel.List.FormField
                    for={`${type}-${phase}`}
                    label={t(`sounds.${phase.toLowerCase()}`)}
                  >
                    <Select
                      aria-label={t(`sounds.${type}${phase}`)}
                      id={`${type}${phase}`}
                      onChange={sound => handleSoundChange(type, phase, sound)}
                      options={defaultSoundOptions}
                      value={getSetting(`${type}Timer${phase}Sound`) ?? undefined}
                    />
                  </Panel.List.FormField>
                )}
              </For>
            </Panel.List>
          </Panel>
        )}
      </For>
    </>
  );
};

import { MainHeader } from '@/dashboard/components/MainHeader';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Component, For } from 'solid-js';

const timerTypes = ['task', 'shortBreak', 'longBreak'] as const;

const timerPhases = ['start', 'tick', 'end'] as const;

export const SoundsView: Component = () => {
  const t = useTranslate();
  return (
    <>
      <MainHeader heading={t('routeSounds')} />
      <For each={timerTypes}>
        {timerType => (
          <Panel heading={t(`${timerType}SoundsHeader`)} isPaddingDisabled>
            <Panel.List aria-label={t(`${timerType}SoundsLabel`)}>
              <For each={timerPhases}>
                {phase => (
                  <Panel.List.FormField
                    for={`${timerType}-${phase}`}
                    label={t(`sounds.${phase}`)}
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

import { MainHeader } from '@/dashboard/components/MainHeader';
import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Option, OptionItem } from '@/ui/dashboard/Select';
import { TimerPhase, TimerType } from '@pomello-desktop/domain';
import { Component, For, Index, Show, createMemo } from 'solid-js';
import { AddCustomSoundButton } from './AddCustomSoundButton';
import { CustomSoundListItem } from './CustomSoundListItem';
import { NoCustomSoundsItem } from './NoCustomSoundsItem';
import { SoundField } from './SoundField';
import styles from './SoundsView.module.scss';

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

  const getSoundOptions = createMemo<Option[]>(() => {
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

  const getHasCustomSounds = createMemo<boolean>(
    () => Object.keys(getSetting('sounds')).length > 0
  );

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
      <Panel heading={t('customSoundsHeader')} isPaddingDisabled>
        <Panel.List aria-label={t('customSoundsHeader')}>
          <Show when={getHasCustomSounds()} fallback={<NoCustomSoundsItem />}>
            <Index each={Object.keys(getSetting('sounds'))}>
              {getSoundId => (
                <CustomSoundListItem
                  sound={getSetting('sounds')[getSoundId()]}
                  soundId={getSoundId()}
                />
              )}
            </Index>
          </Show>
        </Panel.List>
      </Panel>
      <Show when={getHasCustomSounds()}>
        <AddCustomSoundButton class={styles.addCustomSoundButton} />
      </Show>
    </>
  );
};

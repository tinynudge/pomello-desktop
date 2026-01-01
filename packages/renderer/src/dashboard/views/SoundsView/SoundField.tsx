import { PremiumFeatureModal } from '@/dashboard/components/PremiumFeatureModal';
import { useDashboard } from '@/dashboard/context/DashboardContext';
import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { getTimerSettingKey } from '@/shared/helpers/getTimerSettingKey';
import { isDefaultSoundId } from '@/shared/helpers/isDefaultSoundId';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { Option, OptionItem, Select } from '@/ui/dashboard/Select';
import { Slider } from '@/ui/dashboard/Slider';
import { AppProtocol, TimerPhase, TimerType } from '@pomello-desktop/domain';
import { Howl } from 'howler';
import { Component, JSX, Show, createEffect, createMemo, createSignal, on } from 'solid-js';
import styles from './SoundField.module.scss';

type SoundFieldProps = {
  defaultSound: OptionItem;
  soundOptions: Option[];
  staticTimerPhase: TimerPhase;
  staticTimerType: TimerType;
};

export const SoundField: Component<SoundFieldProps> = props => {
  const timerSettingKey = getTimerSettingKey(props.staticTimerType, props.staticTimerPhase);

  const { getSetting, stageSetting } = useDashboard();
  const pomelloConfig = usePomelloConfig();
  const t = useTranslate();

  const [getIsPlaying, setIsPlaying] = createSignal(false);

  const getSoundId = createMemo(() => getSetting(`${timerSettingKey}Sound`));

  const getIsSoundDisabled = createMemo<boolean>(() => {
    const soundId = getSoundId();

    return !!soundId && !isDefaultSoundId(soundId) && pomelloConfig.store.user?.type !== 'premium';
  });

  createEffect(
    on(
      getSoundId,
      () => {
        if (sound?.playing) {
          sound.stop();
        }
      },
      { defer: true }
    )
  );

  let sound: Howl | null = null;

  const handleSoundChange = (sound: string) => {
    stageSetting(`${timerSettingKey}Sound`, sound);
  };

  const handleVolumeChange: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    stageSetting(`${timerSettingKey}Vol`, +event.currentTarget.value);
  };

  const handleRestoreDefaultClick = () => {
    stageSetting(`${timerSettingKey}Sound`, props.defaultSound.id);
    stageSetting(`${timerSettingKey}Vol`, 1);
  };

  const handlePreviewSoundClick = () => {
    const soundId = getSoundId();
    const volume = getSetting(`${timerSettingKey}Vol`);

    if (!soundId) {
      return;
    }

    const soundSource = isDefaultSoundId(soundId)
      ? window.app.getSoundPath(soundId)
      : getSetting('sounds')[soundId]?.path;

    if (!soundSource) {
      return;
    }

    setIsPlaying(true);

    sound = new Howl({
      src: `${AppProtocol.Audio}${soundSource}`,
      volume: +volume,
    });

    sound.on('stop', () => {
      setIsPlaying(false);

      sound = null;
    });

    sound.on('end', () => {
      setIsPlaying(false);

      sound = null;
    });

    sound.play();
  };

  const handleStopPreviewClick = () => {
    sound?.stop();
  };

  let premiumFeatureModalRef!: HTMLDialogElement;

  return (
    <Panel.List.FormField
      actions={[
        getIsPlaying()
          ? {
              onClick: handleStopPreviewClick,
              text: t('stopPreview'),
            }
          : {
              onClick: handlePreviewSoundClick,
              text: t('previewSound'),
            },
        {
          onClick: handleRestoreDefaultClick,
          text: t('restoreDefault', { value: props.defaultSound.label }),
        },
      ]}
      for={timerSettingKey}
      label={t(`sounds.${props.staticTimerPhase}`)}
    >
      <Show when={getIsSoundDisabled()}>
        <Button size="small" variant="warning" onClick={() => premiumFeatureModalRef.showModal()}>
          {t('issueFound')}
        </Button>
        <PremiumFeatureModal
          ref={premiumFeatureModalRef}
          text={t('premiumFeatureModalCustomSoundText')}
        />
      </Show>
      <Slider
        aria-label={t(`sounds.${timerSettingKey}.volume`)}
        class={styles.volumeSlider}
        max={1}
        min={0}
        onInput={handleVolumeChange}
        step={0.1}
        value={getSetting(`${timerSettingKey}Vol`) ?? 1}
      />
      <Select
        aria-label={t(`sounds.${timerSettingKey}.sound`)}
        id={timerSettingKey}
        onChange={handleSoundChange}
        options={props.soundOptions}
        value={getSoundId() ?? undefined}
      />
    </Panel.List.FormField>
  );
};

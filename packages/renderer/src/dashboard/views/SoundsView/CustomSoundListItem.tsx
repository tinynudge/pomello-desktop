import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { ActionsMenu } from '@/ui/dashboard/ActionsMenu';
import { Button } from '@/ui/dashboard/Button';
import { Input } from '@/ui/dashboard/Input';
import { Panel } from '@/ui/dashboard/Panel';
import { AppProtocol, CustomSound } from '@pomello-desktop/domain';
import { Howl } from 'howler';
import { Component, JSX, createEffect, createMemo, createSignal, on } from 'solid-js';
import styles from './CustomSoundListItem.module.scss';

type CustomSoundListItemProps = {
  sound: CustomSound;
  soundId: string;
};

export const CustomSoundListItem: Component<CustomSoundListItemProps> = props => {
  const { getSetting, stageSetting } = useDashboard();
  const t = useTranslate();

  const [getIsPlaying, setIsPlaying] = createSignal(false);

  const getSoundPath = createMemo(() => props.sound.path);

  createEffect(
    on(
      getSoundPath,
      () => {
        if (sound?.playing) {
          sound.stop();
        }
      },
      { defer: true }
    )
  );

  let sound: Howl | null = null;

  const handleChangeClick = () => {
    fileInputRef.click();
  };

  const handleNameInput: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    stageSound({ name: event.currentTarget.value });
  };

  const handlePathInput: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    const file = event.currentTarget.files?.item(0);

    if (!file) {
      return;
    }

    stageSound({ path: file.path });

    // Clear the file input after updating the path. Otherwise if the user undoes
    // their changes and then re-adds the same file, it won't trigger an update.
    event.currentTarget.value = '';
  };

  const handleStopPreviewClick = () => {
    sound?.stop();
  };

  const handlePreviewSoundClick = () => {
    setIsPlaying(true);

    sound = new Howl({
      src: `${AppProtocol.Audio}${getSoundPath()}`,
      volume: 1,
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

  const handleDeleteSoundClick = () => {
    const soundId = props.soundId;

    stageSetting('sounds', stagedSounds => {
      // If there are sounds staged, then we need to explicitly set the sound
      // to "undefined" due to SolidJS store's shallow merging.
      if (stagedSounds) {
        return {
          [soundId]: undefined!,
        };
      }

      const sounds = { ...getSetting('sounds') };

      delete sounds[soundId];

      return sounds;
    });
  };

  const stageSound = (sound: Partial<CustomSound>) => {
    const sounds = getSetting('sounds');

    stageSetting('sounds', {
      ...sounds,
      [props.soundId]: {
        ...props.sound,
        ...sound,
      },
    });
  };

  let fileInputRef: HTMLInputElement;

  return (
    <Panel.List.Item
      aria-label={t('customSoundItem', { name: props.sound.name })}
      class={styles.customSoundListItem}
    >
      <div class={styles.content}>
        <div class={styles.nameField}>
          <label class={styles.label} for={`${props.soundId}-name`}>
            {t('customSoundName')}
          </label>
          <Input
            class={styles.input}
            id={`${props.soundId}-name`}
            onInput={handleNameInput}
            value={props.sound.name}
          />
        </div>
        <div class={styles.pathField}>
          <label class={styles.label} for={`${props.soundId}-path`}>
            {t('customSoundPath')}
          </label>
          <Input
            aria-labelledby={`${props.soundId}-path`}
            class={styles.input}
            readOnly
            value={getSoundPath()}
          />
          <Button onClick={handleChangeClick}>{t('changeCustomSound')}</Button>
          <input
            accept="audio/*"
            class={styles.pathInput}
            id={`${props.soundId}-path`}
            name="path"
            onInput={handlePathInput}
            ref={fileInputRef!}
            type="file"
          />
        </div>
      </div>
      <ActionsMenu
        menuItems={[
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
            text: t('deleteCustomSound'),
            onClick: handleDeleteSoundClick,
          },
        ]}
        menuLabel={t('formFieldMoreOptionsMenuLabel')}
        tooltip={t('formFieldMoreOptionsTooltip')}
        triggerLabel={t('formFieldMoreOptionsTriggerLabel')}
      />
    </Panel.List.Item>
  );
};

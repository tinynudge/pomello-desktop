import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { nanoid } from 'nanoid';
import { Component, JSX } from 'solid-js';
import styles from './AddCustomSoundButton.module.scss';

type AddCustomSoundButtonProps = {
  class?: string;
};

export const AddCustomSoundButton: Component<AddCustomSoundButtonProps> = props => {
  const { getSetting, stageSetting } = useDashboard();
  const t = useTranslate();

  const handleAddSoundButtonClick = () => {
    fileInputRef.click();
  };

  const handleSoundInput: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    const file = event.currentTarget.files?.item(0);

    if (!file) {
      return;
    }

    const path = window.app.getFilePath(file);

    stageSetting('sounds', {
      ...getSetting('sounds'),
      [nanoid()]: {
        name: file.name,
        path,
      },
    });

    // Clear the file input after updating the path. Otherwise adding the same
    // won't trigger the onInput event.
    event.currentTarget.value = '';
  };

  let fileInputRef!: HTMLInputElement;

  return (
    <>
      <Button class={props.class} onClick={handleAddSoundButtonClick} variant="primary">
        {t('addCustomSound')}
      </Button>
      <input
        accept="audio/*"
        class={styles.fileInput}
        data-testid="add-sound-input"
        onInput={handleSoundInput}
        ref={fileInputRef}
        type="file"
      />
    </>
  );
};

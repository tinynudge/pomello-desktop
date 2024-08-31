import { useTranslate } from '@/shared/context/RuntimeContext';
import { Input } from '@/ui/dashboard/Input';
import { FormattedHotkey } from '@pomello-desktop/domain';
import BaseMousetrap from 'mousetrap';
import attachRecorder from 'mousetrap-record';
import { Component, JSX, createSignal, onMount } from 'solid-js';
import styles from './HotkeyRecorder.module.scss';

type HotkeyRecorderProps = {
  onRecordingCancel(): void;
  onRecordingComplete(hotkey: FormattedHotkey): void;
};

const Mousetrap = attachRecorder(BaseMousetrap);

export const HotkeyRecorder: Component<HotkeyRecorderProps> = props => {
  const t = useTranslate();

  const [getValue, setValue] = createSignal('');

  onMount(() => {
    inputRef.focus();
  });

  const handleInputBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = () => {
    stopRecording?.();
    stopRecording = null;

    props.onRecordingCancel();
  };

  const handleInputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    event.preventDefault();
  };

  const handleRecordingComplete = (event: CustomEvent<string>) => {
    props.onRecordingComplete(window.app.formatHotkey(event.detail));
  };

  const attachInputRef = (element: HTMLInputElement) => {
    inputRef = element;

    const mousetrap = new Mousetrap(element);

    stopRecording = mousetrap.record({
      onRecordComplete: sequence => {
        element.dispatchEvent(
          new CustomEvent('Recording-Complete', {
            detail: sequence.join(' '),
          })
        );

        stopRecording = null;
      },
      onSequenceUpdate: sequence => {
        setValue(window.app.formatHotkey(sequence.join(' ')).label);
      },
    });
  };

  let inputRef: HTMLInputElement;
  let stopRecording: (() => void) | null = null;

  return (
    <Input
      aria-label={t('hotkeyRecorderLabel')}
      class={styles.hotkeyRecorder}
      on:Recording-Complete={handleRecordingComplete}
      onBlur={handleInputBlur}
      onKeyDown={handleInputKeyDown}
      placeholder={t('recordingHotkey')}
      ref={attachInputRef}
      value={getValue()}
    />
  );
};

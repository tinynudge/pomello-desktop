import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Input } from '@/ui/dashboard/Input';
import { Component, JSX, createSignal, onCleanup, onMount } from 'solid-js';
import styles from './TimeSettingAdvancedInput.module.scss';

type TimeSettingAdvancedInputProps = {
  id: string;
  onSettingChange(value: number): void;
  value: number;
};

export const TimeSettingAdvancedInput: Component<TimeSettingAdvancedInputProps> = props => {
  const { onStagedSettingsClear } = useDashboard();
  const t = useTranslate();

  const [getHasValidationError, setHasValidationError] = createSignal(false);

  onMount(() => {
    const unsubscribeOnSettingsClear = onStagedSettingsClear(() => {
      setHasValidationError(!inputRef.validity.valid);
    });

    onCleanup(unsubscribeOnSettingsClear);
  });

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    const { validity, value } = event.currentTarget;

    setHasValidationError(!validity.valid);

    if (!validity.valid || props.value === +value) {
      return;
    }

    props.onSettingChange(+value);
  };

  let inputRef!: HTMLInputElement;

  return (
    <span class={styles.timeSettingAdvancedInput}>
      <Input
        class={styles.input}
        errorMessage={getHasValidationError() ? t('invalidTime') : undefined}
        id={props.id}
        onInput={handleInput}
        pattern="^\d+$"
        ref={inputRef}
        required
        type="text"
        value={props.value}
      />
      {t('timeSelectSecSuffix')}
    </span>
  );
};

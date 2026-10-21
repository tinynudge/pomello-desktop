import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Input } from '@/ui/dashboard/Input';
import { Component, JSX } from 'solid-js';
import styles from './TimeSettingAdvancedInput.module.scss';

type TimeSettingAdvancedInputProps = {
  id: string;
  onSettingChange(value: number): void;
  value: number;
};

export const TimeSettingAdvancedInput: Component<TimeSettingAdvancedInputProps> = props => {
  const { registerValidationField } = useDashboard();
  const t = useTranslate();

  const { clearValidationError, getValidationError, setValidationError } =
    registerValidationField();

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = event => {
    const { validity, value } = event.currentTarget;

    if (!validity.valid) {
      setValidationError(t('invalidTime'));
    } else {
      clearValidationError();

      props.onSettingChange(+value);
    }
  };

  let inputRef!: HTMLInputElement;

  return (
    <span class={styles.timeSettingAdvancedInput}>
      <Input
        class={styles.input}
        id={props.id}
        message={getValidationError()}
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

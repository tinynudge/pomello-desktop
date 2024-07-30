import { Component, JSX, splitProps } from 'solid-js';
import styles from './ToggleSwitch.module.scss';

type ToggleSwitchProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange?(checked: boolean): void;
};

export const ToggleSwitch: Component<ToggleSwitchProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['onChange']);

  const handleInputChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = event => {
    props.onChange?.(event.currentTarget.checked);
  };

  return (
    <input
      {...remainingProps}
      class={styles.toggleSwitch}
      onChange={handleInputChange}
      type="checkbox"
    />
  );
};

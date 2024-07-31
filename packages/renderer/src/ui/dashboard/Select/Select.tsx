import cc from 'classcat';
import { Component, For, JSX, splitProps } from 'solid-js';
import styles from './Select.module.scss';
import CaretIcon from './assets/caret.svg';

type SelectProps = Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  onChange?(value: string): void;
  options: Option[];
  value?: string;
};

type Option = {
  id: string;
  label: string;
};

export const Select: Component<SelectProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['class', 'onChange', 'options', 'value']);

  const handleSelectChange: JSX.EventHandler<HTMLSelectElement, Event> = event => {
    props.onChange?.(event.currentTarget.value);
  };

  return (
    <div class={styles.select}>
      <select
        {...remainingProps}
        class={cc([styles.dropdown, props.class])}
        onChange={handleSelectChange}
      >
        <For each={props.options}>
          {option => (
            <option value={option.id} selected={option.id === props.value}>
              {option.label}
            </option>
          )}
        </For>
      </select>
      <CaretIcon class={styles.caret} />
    </div>
  );
};

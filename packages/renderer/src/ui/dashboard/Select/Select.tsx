import cc from 'classcat';
import { Component, For, JSX, Match, Switch, splitProps } from 'solid-js';
import styles from './Select.module.scss';
import CaretIcon from './assets/caret.svg';

export type Option = OptionGroup | OptionItem;

type OptionGroup = {
  label: string;
  items: OptionItem[];
};

type OptionItem = {
  id: string;
  label: string;
};

type SelectProps = Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  onChange?(value: string): void;
  options: Option[];
  value?: string;
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
            <Switch>
              <Match when={'items' in option && option}>
                {getOptionGroup => (
                  <optgroup label={getOptionGroup().label}>
                    <For each={getOptionGroup().items}>
                      {groupOption => (
                        <option value={groupOption.id} selected={groupOption.id === props.value}>
                          {groupOption.label}
                        </option>
                      )}
                    </For>
                  </optgroup>
                )}
              </Match>
              <Match when={'id' in option && option}>
                {getOptionItem => (
                  <option value={getOptionItem().id} selected={getOptionItem().id === props.value}>
                    {getOptionItem().label}
                  </option>
                )}
              </Match>
            </Switch>
          )}
        </For>
      </select>
      <CaretIcon class={styles.caret} />
    </div>
  );
};

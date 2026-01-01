import { ValidationMessage } from '@pomello-desktop/domain';
import cc from 'classcat';
import { nanoid } from 'nanoid';
import { Component, For, JSX, Match, Show, Switch, splitProps } from 'solid-js';
import styles from './Select.module.scss';
import CaretIcon from './assets/caret.svg';

export type Option = OptionGroup | OptionItem;

export type OptionGroup = {
  label: string;
  items: OptionItem[];
};

export type OptionItem = {
  id: string;
  label: string;
};

type SelectProps = Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  message?: ValidationMessage;
  onChange?(value: string): void;
  options: Option[];
  value?: string;
};

export const Select: Component<SelectProps> = allProps => {
  const [props, remainingProps] = splitProps(allProps, [
    'class',
    'message',
    'onChange',
    'options',
    'value',
  ]);
  const anchorId = `--${nanoid()}`;

  const handleSelectChange: JSX.EventHandler<HTMLSelectElement, Event> = event => {
    props.onChange?.(event.currentTarget.value);
  };

  return (
    <>
      <Show when={props.message}>
        {getMessage => (
          <small
            class={styles.message}
            data-message-type={getMessage().type}
            role="status"
            // eslint-disable-next-line solid/style-prop
            style={{ 'position-anchor': anchorId }}
          >
            {getMessage().text}
          </small>
        )}
      </Show>
      <div class={styles.select}>
        <select
          {...remainingProps}
          class={cc([
            props.class,
            {
              [styles.dropdown]: true,
              [styles.hasError]: props.message?.type === 'error',
              [styles.hasWarning]: props.message?.type === 'warning',
            },
          ])}
          onChange={handleSelectChange}
          style={{ 'anchor-name': anchorId }}
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
                    <option
                      value={getOptionItem().id}
                      selected={getOptionItem().id === props.value}
                    >
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
    </>
  );
};

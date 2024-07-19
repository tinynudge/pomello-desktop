import cc from 'classcat';
import { Component, JSX, splitProps } from 'solid-js';
import styles from './InputField.module.scss';

type InputFieldProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  onEscape?(): void;
  onKeyDown?: JSX.EventHandler<HTMLInputElement, KeyboardEvent>;
  onSubmit?(): void;
};

export const InputField: Component<InputFieldProps> = props => {
  const [formProps, inputProps] = splitProps(props, ['onEscape', 'onKeyDown', 'onSubmit']);

  const handleFormSubmit: JSX.EventHandler<HTMLFormElement, Event> = event => {
    event.preventDefault();

    formProps.onSubmit?.();
  };

  const handleInputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    if (event.key === 'Escape') {
      formProps.onEscape?.();
    }

    formProps.onKeyDown?.(event);
  };

  return (
    <form class={styles.inputField} onSubmit={handleFormSubmit}>
      <input
        {...inputProps}
        class={cc([styles.input, inputProps.class])}
        onKeyDown={handleInputKeyDown}
      />
    </form>
  );
};

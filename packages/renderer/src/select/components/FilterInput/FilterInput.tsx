import { Component, JSX } from 'solid-js';
import styles from './FilterInput.module.scss';

type FilterInputProps = {
  activeOptionId?: string;
  listboxId: string;
  onChange(query: string): void;
  onEnter(): void;
  onEscape(): void;
  onFirstOptionSelect(): void;
  onLastOptionSelect(): void;
  onNextOptionSelect(): void;
  onPreviousOptionSelect(): void;
  placeholder: string;
  query: string;
  ref: HTMLInputElement;
};

export const FilterInput: Component<FilterInputProps> = props => {
  const handleInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    props.onChange(event.currentTarget.value);
  };

  const handleInputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    const { key, shiftKey } = event;

    if (key === 'Tab') {
      event.preventDefault();
    }

    if (key === 'ArrowDown' || (!shiftKey && key === 'Tab')) {
      props.onNextOptionSelect();
    } else if (key === 'ArrowUp' || (shiftKey && key === 'Tab')) {
      props.onPreviousOptionSelect();
    } else if (key === 'Home') {
      props.onFirstOptionSelect();
    } else if (key === 'End') {
      props.onLastOptionSelect();
    } else if (key === 'Escape') {
      props.onEscape();
    } else if (key === 'Enter') {
      props.onEnter();
    }
  };

  return (
    <input
      aria-activedescendant={props.activeOptionId}
      aria-autocomplete="list"
      aria-controls={props.listboxId}
      aria-expanded
      class={styles.input}
      onInput={handleInputChange}
      onKeyDown={handleInputKeyDown}
      placeholder={props.placeholder}
      ref={props.ref}
      role="combobox"
      type="text"
      value={props.query}
    />
  );
};

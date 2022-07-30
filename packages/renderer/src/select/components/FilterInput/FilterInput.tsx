import { ChangeEvent, forwardRef, KeyboardEvent } from 'react';
import styles from './FilterInput.module.scss';

interface FilterInputProps {
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
}

const FilterInput = forwardRef<HTMLInputElement, FilterInputProps>(
  (
    {
      activeOptionId,
      listboxId,
      onChange,
      onEnter,
      onEscape,
      onFirstOptionSelect,
      onLastOptionSelect,
      onNextOptionSelect,
      onPreviousOptionSelect,
      placeholder,
      query,
    },
    ref
  ) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.currentTarget.value);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const { key, shiftKey } = event;

      if (key === 'Tab') {
        event.preventDefault();
      }

      if (key === 'ArrowDown' || (!shiftKey && key === 'Tab')) {
        onNextOptionSelect();
      } else if (key === 'ArrowUp' || (shiftKey && key === 'Tab')) {
        onPreviousOptionSelect();
      } else if (key === 'Home') {
        onFirstOptionSelect();
      } else if (key === 'End') {
        onLastOptionSelect();
      } else if (key === 'Escape') {
        onEscape();
      } else if (key === 'Enter') {
        onEnter();
      }
    };

    return (
      <input
        aria-activedescendant={activeOptionId}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded
        className={styles.input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        ref={ref}
        role="combobox"
        type="text"
        value={query}
      />
    );
  }
);

export default FilterInput;

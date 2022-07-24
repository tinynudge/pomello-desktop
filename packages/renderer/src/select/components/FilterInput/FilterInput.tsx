import { ChangeEvent, FC, KeyboardEvent } from 'react';
import styles from './FilterInput.module.scss';

interface FilterInputProps {
  activeOptionId?: string;
  listboxId: string;
  onChange(query: string): void;
  onFirstOptionSelect(): void;
  onLastOptionSelect(): void;
  onNextOptionSelect(): void;
  onPreviousOptionSelect(): void;
  placeholder: string;
  query: string;
}

const FilterInput: FC<FilterInputProps> = ({
  activeOptionId,
  listboxId,
  onChange,
  onFirstOptionSelect,
  onLastOptionSelect,
  onNextOptionSelect,
  onPreviousOptionSelect,
  placeholder,
  query,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };

  const handleInputKeyDown = ({ key, shiftKey }: KeyboardEvent<HTMLInputElement>) => {
    if (key === 'ArrowDown' || (!shiftKey && key === 'Tab')) {
      onNextOptionSelect();
    } else if (key === 'ArrowUp' || (shiftKey && key === 'Tab')) {
      onPreviousOptionSelect();
    } else if (key === 'Home') {
      onFirstOptionSelect();
    } else if (key === 'End') {
      onLastOptionSelect();
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
      role="combobox"
      type="text"
      value={query}
    />
  );
};

export default FilterInput;

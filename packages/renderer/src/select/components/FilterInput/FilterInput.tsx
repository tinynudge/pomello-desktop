import { ChangeEvent, FC } from 'react';
import styles from './FilterInput.module.scss';

interface FilterInputProps {
  listboxId: string;
  onChange(query: string): void;
  placeholder: string;
  query: string;
}

const FilterInput: FC<FilterInputProps> = ({ listboxId, onChange, placeholder, query }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <input
      aria-autocomplete="list"
      aria-controls={listboxId}
      aria-expanded
      className={styles.input}
      onChange={handleInputChange}
      placeholder={placeholder}
      role="combobox"
      type="text"
      value={query}
    />
  );
};

export default FilterInput;

import cc from 'classcat';
import { FormEvent, forwardRef, InputHTMLAttributes, KeyboardEvent } from 'react';
import styles from './InputField.module.scss';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  onEscape?(): void;
  onSubmit?(): void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, onEscape, onKeyDown, onSubmit, ...remainingProps }, ref) => {
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onSubmit?.();
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        onEscape?.();
      }

      onKeyDown?.(event);
    };

    return (
      <form className={styles.inputField} onSubmit={handleFormSubmit}>
        <input
          {...remainingProps}
          className={cc([styles.input, className])}
          onKeyDown={handleInputKeyDown}
          ref={ref}
        />
      </form>
    );
  }
);

export default InputField;

import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC, useCallback, useEffect, useRef } from 'react';
import styles from './SelectField.module.scss';
import useHideSelectOnUnmount from './useHideSelectOnUnmount';

interface SelectFieldProps {
  defaultOpen?: boolean;
  items: SelectItem[];
  noResultsMessage?: string;
  onChange(optionId: string): void;
  placeholder?: string;
}

const SelectField: FC<SelectFieldProps> = ({
  defaultOpen = false,
  items,
  noResultsMessage,
  placeholder: customPlaceholder,
  onChange,
}) => {
  const { t } = useTranslation();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const shouldOpenOnUpdate = useRef(defaultOpen);

  const placeholder = customPlaceholder ?? t('selectPlaceholder');

  const showSelectWindow = useCallback(() => {
    if (buttonRef.current) {
      const bounds = buttonRef.current.getBoundingClientRect();

      window.app.showSelect({
        buttonBounds: {
          height: bounds.height,
          width: bounds.width,
          x: bounds.x,
          y: bounds.y,
        },
      });
    }
  }, []);

  useHideSelectOnUnmount();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.target === document.body) {
        showSelectWindow();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSelectWindow]);

  useEffect(() => {
    return window.app.onSelectChange(onChange);
  }, [onChange]);

  useEffect(() => {
    window.app.setSelectItems({ items, noResultsMessage, placeholder });

    // This is much simpler than doing a lot of message passing to figure out if
    // the select window has updated.
    if (shouldOpenOnUpdate.current) {
      setTimeout(showSelectWindow, 5);
    }

    shouldOpenOnUpdate.current = false;
  }, [items, noResultsMessage, placeholder, showSelectWindow]);

  const handleButtonClick = () => {
    showSelectWindow();
  };

  return (
    <button className={styles.button} onClick={handleButtonClick} ref={buttonRef}>
      {placeholder}
    </button>
  );
};

export default SelectField;

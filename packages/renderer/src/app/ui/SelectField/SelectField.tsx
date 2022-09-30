import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC, useCallback, useEffect, useRef } from 'react';
import styles from './SelectField.module.scss';
import useHideSelectOnUnmount from './useHideSelectOnUnmount';
import useShowSelectOnMount from './useShowSelectOnMount';

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

  useShowSelectOnMount(defaultOpen, showSelectWindow);

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
  }, [items, noResultsMessage, placeholder]);

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

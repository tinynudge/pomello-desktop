import { useTranslate } from '@/shared/context/RuntimeContext';
import { SelectItem } from '@pomello-desktop/domain';
import { Component, createEffect, onCleanup } from 'solid-js';
import styles from './SelectField.module.scss';

interface SelectFieldProps {
  defaultOpen?: boolean;
  items: SelectItem[];
  noResultsMessage?: string;
  onChange(optionId: string): void;
  placeholder?: string;
}

export const SelectField: Component<SelectFieldProps> = props => {
  const t = useTranslate();

  let buttonRef: HTMLButtonElement;

  createEffect(() => {
    window.app.setSelectItems({
      items: props.items,
      noResultsMessage: props.noResultsMessage,
      placeholder: getPlaceholder(),
    });
  });

  createEffect(() => {
    const unsubscribe = window.app.onSelectChange(props.onChange);

    onCleanup(unsubscribe);
  });

  const getPlaceholder = () => props.placeholder ?? t('selectPlaceholder');

  const showSelectWindow = () => {
    const bounds = buttonRef.getBoundingClientRect();

    window.app.showSelect({
      buttonBounds: {
        height: bounds.height,
        width: bounds.width,
        x: bounds.x,
        y: bounds.y,
      },
    });
  };

  const handleButtonClick = () => {
    showSelectWindow();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space' && event.target === document.body) {
      showSelectWindow();
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);

    window.app.resetSelect();
  });

  // This is much simpler than doing a lot of message passing to figure out if
  // the select window has updated.
  if (props.defaultOpen) {
    setTimeout(showSelectWindow, 5);
  }

  return (
    <button class={styles.button} onClick={handleButtonClick} ref={buttonRef!}>
      {getPlaceholder()}
    </button>
  );
};

import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Component } from 'solid-js';

type SaveButtonProps = {
  disabled?: boolean;
  onClick(): void;
  ref?(element: HTMLElement): void;
  tooltipId?: string;
};

export const SaveButton: Component<SaveButtonProps> = props => {
  const t = useTranslate();

  const handleSaveClick = () => {
    if (props.disabled) {
      return;
    }

    props.onClick();
  };

  return (
    <Button
      aria-describedby={props.tooltipId || undefined}
      aria-disabled={props.disabled || undefined}
      aria-label={t('saveChangesLabel')}
      onClick={handleSaveClick}
      ref={props.ref}
      variant="primary"
    >
      {t('saveChanges')}
    </Button>
  );
};

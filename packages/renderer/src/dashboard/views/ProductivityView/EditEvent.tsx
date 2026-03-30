import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Component } from 'solid-js';
import styles from './EditEvent.module.scss';

type EditEventProps = {
  onCancel(): void;
};

export const EditEvent: Component<EditEventProps> = props => {
  const t = useTranslate();

  return (
    <div class={styles.editEvent}>
      <div class={styles.actions}>
        <Button onClick={props.onCancel}>{t('cancel')}</Button>
      </div>
    </div>
  );
};

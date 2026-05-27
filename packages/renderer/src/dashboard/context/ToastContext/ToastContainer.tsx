import { For } from 'solid-js';
import styles from './ToastContainer.module.scss';
import { Toast } from './ToastContext';
import { ToastItem } from './ToastItem';

type ToastContainerProps = {
  onDismiss(id: string): void;
  toasts: Toast[];
};

export const ToastContainer = (props: ToastContainerProps) => {
  return (
    <div aria-live="polite" class={styles.container} role="status">
      <For each={props.toasts}>
        {toast => (
          <ToastItem
            initialDuration={toast.duration}
            message={toast.message}
            onDismiss={() => props.onDismiss(toast.id)}
            variant={toast.variant}
          />
        )}
      </For>
    </div>
  );
};

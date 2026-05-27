import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { nanoid } from 'nanoid';
import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ToastContainer } from './ToastContainer';

export type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

type ShowToastOptions = {
  duration?: number;
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast(message: string, options?: ShowToastOptions): void;
};

const DEFAULT_DURATION = 5_000;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);

  assertNonNullish(context, 'useToast must be used inside <ToastProvider>');

  return context;
};

export const ToastProvider: ParentComponent = props => {
  const [store, setStore] = createStore<{ toasts: Toast[] }>({ toasts: [] });

  const handleToastDismiss = (id: string) => {
    setStore('toasts', toasts => toasts.filter(toast => toast.id !== id));
  };

  const showToast = (message: string, options: ShowToastOptions = {}) => {
    const { duration = DEFAULT_DURATION, variant = 'info' } = options;

    const id = nanoid();
    const toast: Toast = { duration, id, message, variant };

    setStore('toasts', toasts => [toast, ...toasts]);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {props.children}
      <ToastContainer onDismiss={handleToastDismiss} toasts={store.toasts} />
    </ToastContext.Provider>
  );
};

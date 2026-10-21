import { ValidationMessage } from '@pomello-desktop/domain';
import { nanoid } from 'nanoid';
import { onCleanup } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

export type ValidationField = {
  clearValidationError(): void;
  getValidationError(): ValidationMessage | undefined;
  setValidationError(message: string): void;
};

export type ValidationRegistry = {
  clearValidationErrors(): void;
  getHasValidationErrors(): boolean;
  registerValidationField(): ValidationField;
};

export const createValidationRegistry = (): ValidationRegistry => {
  const [validationErrors, setValidationErrors] = createStore<Record<string, string | undefined>>(
    {}
  );

  const clearValidationErrors = () => setValidationErrors(reconcile({}));

  const getHasValidationErrors = () =>
    Object.values(validationErrors).some(message => message !== undefined);

  const registerValidationField = (): ValidationField => {
    const id = nanoid();

    onCleanup(() => {
      setValidationErrors(id, undefined);
    });

    const clearValidationError = () => setValidationErrors(id, undefined);

    const getValidationError = () => {
      const text = validationErrors[id];

      return text ? ({ text, type: 'error' } as const) : undefined;
    };

    const setValidationError = (message: string) => setValidationErrors(id, message);

    return { clearValidationError, getValidationError, setValidationError };
  };

  return { clearValidationErrors, getHasValidationErrors, registerValidationField };
};

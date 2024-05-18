import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Component, JSX, createSignal, onMount } from 'solid-js';
import { useStoreActions } from '../context/StoreContext';
import { Content } from '@/ui/components/Content';
import { Heading } from '@/ui/components/Heading';
import { InputField } from '@/ui/components/InputField';

export const CreateTaskView: Component = () => {
  const { overlayViewCleared } = useStoreActions();
  const getService = useService();
  const t = useTranslate();

  const [getText, setText] = createSignal('');

  let inputRef: HTMLInputElement;

  onMount(() => {
    inputRef?.focus();
  });

  const handleInputChange: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    setText(event.currentTarget.value);
  };

  const handleInputEscape = () => {
    overlayViewCleared();
  };

  const handleInputSubmit = () => {
    const text = getText();

    if (!text) {
      return;
    }

    if (text === '/?') {
      setText('');

      window.app.openUrl(`${import.meta.env.VITE_APP_URL}/help#creating-tasks`);

      return;
    }

    const { onTaskCreate } = getService();
    let response: false | void | undefined;

    if (onTaskCreate) {
      window.app.logMessage('debug', 'Will create task');

      response = onTaskCreate(text);
    }

    if (response !== false) {
      overlayViewCleared();
    }
  };

  return (
    <Content>
      <Heading>{t('createTaskHeading')}</Heading>
      <InputField
        onEscape={handleInputEscape}
        onInput={handleInputChange}
        onSubmit={handleInputSubmit}
        placeholder={t('createTaskPlaceholder')}
        ref={inputRef!}
        value={getText()}
      />
    </Content>
  );
};

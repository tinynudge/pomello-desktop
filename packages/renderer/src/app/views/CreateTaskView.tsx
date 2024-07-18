import { useTranslate } from '@/shared/context/RuntimeContext';
import { useService } from '@/shared/context/ServiceContext';
import { Content } from '@/ui/app/Content';
import { Heading } from '@/ui/app/Heading';
import { InputField } from '@/ui/app/InputField';
import { Component, JSX, createSignal, onMount } from 'solid-js';
import { useStoreActions } from '../context/StoreContext';
import { useInvalidateTasksCache } from '../hooks/useInvalidateTasksCache';

export const CreateTaskView: Component = () => {
  const { overlayViewCleared } = useStoreActions();
  const invalidateTasksCache = useInvalidateTasksCache();
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

  const handleInputSubmit = async () => {
    const text = getText();

    if (!text) {
      return;
    }

    if (text === '/?') {
      setText('');

      window.app.openUrl(`${import.meta.env.VITE_APP_URL}/help#creating-tasks`);

      return;
    }

    const { createTask, notification } = getService().onTaskCreate?.(text) ?? {};

    if (notification) {
      const [title, body] = notification;

      new Notification(title, { body });
    }

    if (createTask) {
      overlayViewCleared();

      window.app.logMessage('debug', 'Will create task');

      const { notification, shouldInvalidateTasksCache } = (await createTask()) ?? {};

      window.app.logMessage('debug', 'Did create task');

      if (notification) {
        const [title, body] = notification;

        new Notification(title, { body });
      }

      if (shouldInvalidateTasksCache) {
        invalidateTasksCache();
      }
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

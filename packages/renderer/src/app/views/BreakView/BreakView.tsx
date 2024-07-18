import { useStore, useStoreActions } from '@/app/context/StoreContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Heading } from '@/ui/app/Heading';
import { Component, Show } from 'solid-js';
import { NextTaskHeading } from './NextTaskHeading';

interface BreakViewProps {
  type: 'SHORT_BREAK' | 'LONG_BREAK';
}

export const BreakView: Component<BreakViewProps> = props => {
  const { dialActionsSet } = useStoreActions();
  const store = useStore();
  const t = useTranslate();

  dialActionsSet(['skipTimer']);

  return (
    <>
      <Show
        fallback={<Heading>{t('newTaskHeading')}</Heading>}
        when={store.pomelloState.currentTaskId}
      >
        <NextTaskHeading />
      </Show>
      <p>{props.type === 'SHORT_BREAK' ? t('shortBreakMessage') : t('longBreakMessage')}</p>
    </>
  );
};

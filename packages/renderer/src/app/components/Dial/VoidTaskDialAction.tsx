import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { createHintTitle } from '@/shared/helpers/createHintTitle';
import { Component } from 'solid-js';
import { DialAction } from './DialAction';
import { DialActionProps } from './DialActionProps';
import CloseIcon from './assets/close.svg';

export const VoidTaskDialAction: Component<DialActionProps> = props => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { voidTask } = usePomelloActions();
  const t = useTranslate();

  const handleActionClick = () => {
    voidTask();
    props.onClick();
  };

  registerHotkeys({ voidTask });

  return (
    <DialAction
      class={props.class}
      isVisible={props.isVisible}
      label={t('voidTaskLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'voidTaskLabel', getHotkeyLabel('voidTask'))}
    >
      <CloseIcon width={10} />
    </DialAction>
  );
};

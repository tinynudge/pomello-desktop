import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { createHintTitle } from '@/shared/helpers/createHintTitle';
import { Component } from 'solid-js';
import { DialAction } from './DialAction';
import { DialActionProps } from './DialActionProps';
import CheckIcon from './assets/check.svg';

export const CompleteTaskDialAction: Component<DialActionProps> = props => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { completeTask } = usePomelloActions();
  const t = useTranslate();

  const handleActionClick = () => {
    completeTask();
    props.onClick();
  };

  registerHotkeys({ completeTaskEarly: completeTask });

  return (
    <DialAction
      class={props.class}
      isVisible={props.isVisible}
      label={t('completeTaskLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'completeTaskLabel', getHotkeyLabel('completeTaskEarly'))}
    >
      <CheckIcon width={13} />
    </DialAction>
  );
};

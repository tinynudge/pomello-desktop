import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { createHintTitle } from '@/shared/helpers/createHintTitle';
import { Component } from 'solid-js';
import { DialAction } from './DialAction';
import { DialActionProps } from './DialActionProps';
import SwitchIcon from './assets/switch.svg';

export const SwitchTaskDialAction: Component<DialActionProps> = props => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { switchTask } = usePomelloActions();
  const t = useTranslate();

  const handleActionClick = () => {
    switchTask();
    props.onClick();
  };

  registerHotkeys({ switchTask });

  return (
    <DialAction
      class={props.class}
      isVisible={props.isVisible}
      label={t('switchTaskLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'switchTaskLabel', getHotkeyLabel('switchTask'))}
    >
      <SwitchIcon width={16} />
    </DialAction>
  );
};

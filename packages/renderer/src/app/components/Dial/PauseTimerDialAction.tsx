import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { createHintTitle } from '@/shared/helpers/createHintTitle';
import { Component } from 'solid-js';
import { DialAction } from './DialAction';
import { DialActionProps } from './DialActionProps';
import PauseIcon from './assets/pause.svg';

export const PauseTimerDialAction: Component<DialActionProps> = props => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { pauseTimer } = usePomelloActions();
  const t = useTranslate();

  const handleActionClick = () => {
    pauseTimer();
    props.onClick();
  };

  registerHotkeys({ pauseTimer });

  return (
    <DialAction
      class={props.class}
      isVisible={props.isVisible}
      label={t('pauseTimerLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'pauseTimerLabel', getHotkeyLabel('pauseTimer'))}
    >
      <PauseIcon width={6} />
    </DialAction>
  );
};

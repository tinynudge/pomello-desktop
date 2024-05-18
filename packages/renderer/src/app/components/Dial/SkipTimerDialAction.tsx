import { useHotkeys } from '@/app/context/HotkeysContext';
import { usePomelloActions } from '@/app/context/PomelloContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { createHintTitle } from '@/shared/helpers/createHintTitle';
import { Component } from 'solid-js';
import { DialAction } from './DialAction';
import { DialActionProps } from './DialActionProps';
import SkipIcon from './assets/skip.svg';

export const SkipTimerDialAction: Component<DialActionProps> = props => {
  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  const { skipTimer } = usePomelloActions();
  const t = useTranslate();

  const handleActionClick = () => {
    skipTimer();
    props.onClick();
  };

  registerHotkeys({ skipBreak: skipTimer });

  return (
    <DialAction
      class={props.class}
      isVisible={props.isVisible}
      label={t('skipBreakLabel')}
      onClick={handleActionClick}
      title={createHintTitle(t, 'skipBreakLabel', getHotkeyLabel('skipBreak'))}
    >
      <SkipIcon width={9} />
    </DialAction>
  );
};

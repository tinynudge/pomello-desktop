import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { Component } from 'solid-js';
import styles from './UnboundHotkey.module.scss';

type UnboundHotkeyProps = {
  command: string;
};

export const UnboundHotkey: Component<UnboundHotkeyProps> = props => {
  const t = useTranslate();

  return (
    <Tooltip text={t('setKeyboardShortcutText')}>
      {tooltipTargetRef => (
        <Button
          aria-label={t('setKeyboardShortcutLabel', {
            command: t(`hotkeys.${props.command}.label`),
          })}
          class={styles.unboundHotkey}
          ref={tooltipTargetRef}
        >
          {t('unboundKeyboardShortcut')}
        </Button>
      )}
    </Tooltip>
  );
};

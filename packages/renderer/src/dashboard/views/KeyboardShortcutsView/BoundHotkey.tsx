import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { FormattedHotkey } from '@pomello-desktop/domain';
import { Component, For, Show } from 'solid-js';
import styles from './BoundHotkey.module.scss';

type BoundHotkeyProps = {
  command: string;
  hotkey: FormattedHotkey;
  onClick(): void;
};

export const BoundHotkey: Component<BoundHotkeyProps> = props => {
  const t = useTranslate();

  return (
    <Tooltip text={t('editKeyboardShortcutText')}>
      {tooltipTargetRef => (
        <Button
          aria-label={t('editKeyboardShortcutLabel', {
            binding: props.hotkey.label,
            command: t(`hotkeys.${props.command}.label`),
          })}
          class={styles.hotkey}
          onClick={props.onClick}
          ref={tooltipTargetRef}
        >
          <For each={props.hotkey.keys}>
            {(sequence, getIndex) => (
              <>
                <Show when={getIndex() !== 0}>
                  <span class={styles.separator}>&bull;</span>
                </Show>
                <span class={styles.sequence}>
                  <For each={sequence}>{key => <kbd class={styles.key}>{key}</kbd>}</For>
                </span>
              </>
            )}
          </For>
        </Button>
      )}
    </Tooltip>
  );
};

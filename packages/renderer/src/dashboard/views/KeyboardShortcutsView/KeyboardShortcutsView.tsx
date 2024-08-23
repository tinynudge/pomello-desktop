import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Component, For } from 'solid-js';
import { MainHeader } from '../../components/MainHeader';
import { hotkeysByCategory } from './hotkeysByCategory';

export const KeyboardShortcutsView: Component = () => {
  const t = useTranslate();

  return (
    <>
      <MainHeader heading={t('routeKeyboardShortcuts')} />
      <For each={hotkeysByCategory}>
        {category => (
          <Panel heading={t(category.headingKey)} isPaddingDisabled>
            <Panel.List aria-label={t(category.listLabelKey)}>
              <For each={category.hotkeyCommands}>
                {hotkeyCommand => (
                  <Panel.List.FormField
                    description={t(`hotkeys.${hotkeyCommand}.description`)}
                    for={hotkeyCommand}
                    label={t(`hotkeys.${hotkeyCommand}.label`)}
                  />
                )}
              </For>
            </Panel.List>
          </Panel>
        )}
      </For>
    </>
  );
};

import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { Component, For, Show } from 'solid-js';
import { MainHeader } from '../../components/MainHeader';
import { Hotkey } from './Hotkey';
import { UnboundHotkey } from './UnboundHotkey';
import { hotkeysByCategory } from './hotkeysByCategory';

export const KeyboardShortcutsView: Component = () => {
  const { getHotkey } = useDashboard();
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
                  >
                    <Show
                      fallback={<UnboundHotkey command={hotkeyCommand} />}
                      when={getHotkey(hotkeyCommand)}
                    >
                      {getFormattedHotkey => (
                        <Hotkey command={hotkeyCommand} hotkey={getFormattedHotkey()} />
                      )}
                    </Show>
                  </Panel.List.FormField>
                )}
              </For>
            </Panel.List>
          </Panel>
        )}
      </For>
    </>
  );
};

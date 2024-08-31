import { HotkeyConflictError, useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Panel } from '@/ui/dashboard/Panel';
import { FormattedHotkey, HotkeyCommand } from '@pomello-desktop/domain';
import { Component, For, Show, createSignal } from 'solid-js';
import { MainHeader } from '../../components/MainHeader';
import { Hotkey } from './Hotkey';
import { HotkeyConflictModal } from './HotkeyConflictModal';
import { hotkeysByCategory } from './hotkeysByCategory';

export const KeyboardShortcutsView: Component = () => {
  const { getDefaultHotkey, stageHotkey } = useDashboard();
  const t = useTranslate();

  const [getHotkeyConflict, setHotkeyConflict] = createSignal<HotkeyConflictError | null>(null);

  const handleHotkeyClear = (command: HotkeyCommand) => {
    stageHotkey(command, false);
  };

  const handleHotkeyChange = (command: HotkeyCommand, hotkey: FormattedHotkey) => {
    try {
      stageHotkey(command, hotkey);
    } catch (error) {
      if (error instanceof HotkeyConflictError) {
        setHotkeyConflict(error);
      } else {
        throw error;
      }
    }
  };

  const clearHotkeyConflictError = () => {
    setHotkeyConflict(null);
  };

  return (
    <>
      <MainHeader heading={t('routeKeyboardShortcuts')} />
      <For each={hotkeysByCategory}>
        {category => (
          <Panel heading={t(category.headingKey)} isPaddingDisabled>
            <Panel.List aria-label={t(category.listLabelKey)}>
              <For each={category.hotkeyCommands}>
                {command => (
                  <Panel.List.FormField
                    actions={[
                      {
                        onClick: () => handleHotkeyChange(command, getDefaultHotkey(command)),
                        text: t('restoreDefault', { value: getDefaultHotkey(command).label }),
                      },
                      {
                        onClick: () => handleHotkeyClear(command),
                        text: t('unsetHotkey'),
                      },
                    ]}
                    description={t(`hotkeys.${command}.description`)}
                    for={command}
                    label={t(`hotkeys.${command}.label`)}
                  >
                    <Hotkey command={command} onHotkeyChange={handleHotkeyChange} />
                  </Panel.List.FormField>
                )}
              </For>
            </Panel.List>
          </Panel>
        )}
      </For>
      <Show when={getHotkeyConflict()}>
        {getError => (
          <HotkeyConflictModal error={getError()} clearError={clearHotkeyConflictError} />
        )}
      </Show>
    </>
  );
};

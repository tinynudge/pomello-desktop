import { useTranslate } from '@/shared/context/RuntimeContext';
import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { HotkeyCommand, Hotkeys, LabeledHotkeys } from '@pomello-desktop/domain';
import mousetrap from 'mousetrap';
import { ParentComponent, createContext, createEffect, onCleanup, useContext } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';

type HotkeysProviderProps = {
  initialHotkeys: LabeledHotkeys;
};

type HotkeysContextValue = {
  getHotkeyLabel(command: HotkeyCommand): string | undefined;
  getTitleWithHotkey(titleKey: string, command: HotkeyCommand): string;
  registerHotkeys(hotkeys: HotkeysRegistry): void;
};

type HotkeysRegistry = Partial<Record<HotkeyCommand, HotkeyHandler>>;

type HotkeyHandler = () => void;

const HotkeysContext = createContext<HotkeysContextValue | undefined>(undefined);

export const useHotkeys = () => {
  const context = useContext(HotkeysContext);

  assertNonNullish(context, 'useHotkeys must be used inside <HotkeysProvider>');

  return context;
};

export const HotkeysProvider: ParentComponent<HotkeysProviderProps> = props => {
  const t = useTranslate();

  const [hotkeys, setHotkeys] = createStore(props.initialHotkeys);

  const unsubscribe = window.app.onHotkeysChange(hotkeys => setHotkeys(reconcile(hotkeys)));

  onCleanup(unsubscribe);

  const getHotkeyLabel = (command: keyof Hotkeys) => {
    return hotkeys[command]?.label;
  };

  const getTitleWithHotkey = (titleKey: string, command: HotkeyCommand) => {
    const hotkeyLabel = getHotkeyLabel(command);

    return t('hintTitle', {
      title: t(titleKey),
      hotkey: hotkeyLabel ? t('hintTitleHotkey', { hotkey: hotkeyLabel }) : '',
    });
  };

  const registerHotkeys = (registry: HotkeysRegistry) => {
    Object.entries(registry).forEach(([command, handler]) => {
      createEffect(() => {
        const binding = hotkeys[command as keyof Hotkeys]?.binding;

        if (binding) {
          mousetrap.bind(binding, handler);

          onCleanup(() => {
            mousetrap.unbind(binding);
          });
        }
      });
    });
  };

  return (
    <HotkeysContext.Provider value={{ getHotkeyLabel, getTitleWithHotkey, registerHotkeys }}>
      {props.children}
    </HotkeysContext.Provider>
  );
};

import { useTranslate } from '@/shared/context/RuntimeContext';
import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { HotkeyCommand, Hotkeys, LabeledHotkeys, Unsubscribe } from '@pomello-desktop/domain';
import Mousetrap from 'mousetrap';
import { ParentComponent, createContext, onCleanup, onMount, useContext } from 'solid-js';

type HotkeysProviderProps = {
  hotkeys: LabeledHotkeys;
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

  const getHotkeyLabel = (command: keyof Hotkeys) => {
    return props.hotkeys[command]?.label;
  };

  const getTitleWithHotkey = (titleKey: string, command: HotkeyCommand) => {
    const hotkeyLabel = getHotkeyLabel(command);

    return t('hintTitle', {
      title: t(titleKey),
      hotkey: hotkeyLabel ? t('hintTitleHotkey', { hotkey: hotkeyLabel }) : '',
    });
  };

  const registerHotkeys = (registry: HotkeysRegistry) => {
    onMount(() => {
      const unregisterHotkeys: Unsubscribe[] = [];

      Object.entries(registry).forEach(([command, handler]) => {
        const hotkey = props.hotkeys[command as keyof Hotkeys];

        if (hotkey) {
          Mousetrap.bind(hotkey.binding, handler);

          unregisterHotkeys.push(() => Mousetrap.unbind(hotkey.binding));
        }
      });

      onCleanup(() => {
        unregisterHotkeys.forEach(unregisterHotkey => unregisterHotkey());
      });
    });
  };

  return (
    <HotkeysContext.Provider value={{ getHotkeyLabel, getTitleWithHotkey, registerHotkeys }}>
      {props.children}
    </HotkeysContext.Provider>
  );
};

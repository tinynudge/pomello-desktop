import { Hotkeys, LabeledHotkeys } from '@domain';
import Mousetrap from 'mousetrap';
import { createContext, FC, ReactNode, useMemo } from 'react';

interface HotkeysProviderProps {
  children: ReactNode;
  hotkeys: LabeledHotkeys;
}

interface HotkeysContextValue {
  getHotkeyLabel(command: keyof Hotkeys): string | undefined;
  registerHotkeys(hotkeys: HotkeysRegistry): UnregisterHotkeys;
}

type HotkeysRegistry = Partial<Record<keyof Hotkeys, HotkeyHandler>>;

type HotkeyHandler = () => void;

type UnregisterHotkeys = () => void;

export const HotkeysContext = createContext<HotkeysContextValue | undefined>(undefined);

export const HotkeysProvider: FC<HotkeysProviderProps> = ({ children, hotkeys }) => {
  const value = useMemo(() => {
    const getHotkeyLabel = (command: keyof Hotkeys) => {
      return hotkeys[command]?.label;
    };

    const registerHotkeys = (registry: HotkeysRegistry) => {
      const unregisterHotkeys: UnregisterHotkeys[] = [];

      Object.entries(registry).forEach(([command, handler]) => {
        const hotkey = hotkeys[command as keyof Hotkeys];

        if (hotkey) {
          Mousetrap.bind(hotkey.binding, handler);

          unregisterHotkeys.push(() => Mousetrap.unbind(hotkey.binding));
        }
      });

      return () => {
        unregisterHotkeys.forEach(unregisterHotkey => unregisterHotkey());
      };
    };

    return { getHotkeyLabel, registerHotkeys };
  }, [hotkeys]);

  return <HotkeysContext.Provider value={value}>{children}</HotkeysContext.Provider>;
};

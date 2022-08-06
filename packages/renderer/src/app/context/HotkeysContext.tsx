import { Hotkeys, LabeledHotkeys } from '@domain';
import Mousetrap from 'mousetrap';
import { createContext, FC, ReactNode, useMemo } from 'react';

interface HotkeysProviderProps {
  children: ReactNode;
  hotkeys: LabeledHotkeys;
}

interface HotkeysContextValue {
  getHotkeyLabel(command: keyof Hotkeys): string;
  registerHotkeys(hotkeys: HotkeysRegistry): UnregisterHotkeys;
}

type HotkeysRegistry = Partial<Record<keyof Hotkeys, HotkeyHandler>>;

type HotkeyHandler = () => void;

type UnregisterHotkeys = () => void;

export const HotkeysContext = createContext<HotkeysContextValue | undefined>(undefined);

export const HotkeysProvider: FC<HotkeysProviderProps> = ({ children, hotkeys }) => {
  const value = useMemo(() => {
    const getHotkeyLabel = (command: keyof Hotkeys) => {
      return hotkeys[command].label;
    };

    const registerHotkeys = (registry: HotkeysRegistry) => {
      Object.entries(registry).forEach(([command, handler]) => {
        const { binding } = hotkeys[command as keyof Hotkeys];

        Mousetrap.bind(binding, handler);
      });

      return () => {
        Object.keys(registry).forEach(command => {
          const { binding } = hotkeys[command as keyof Hotkeys];

          Mousetrap.unbind(binding);
        });
      };
    };

    return { getHotkeyLabel, registerHotkeys };
  }, [hotkeys]);

  return <HotkeysContext.Provider value={value}>{children}</HotkeysContext.Provider>;
};

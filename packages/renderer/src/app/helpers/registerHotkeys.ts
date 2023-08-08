import { getHotkeysContext } from '@/app/contexts/hotkeysContext';
import type { Hotkeys, UnsubscribeHandler } from '@domain';
import Mousetrap from 'mousetrap';
import { onMount } from 'svelte';

type HotkeysRegistry = Partial<Record<keyof Hotkeys, HotkeyHandler>>;

type HotkeyHandler = () => void;

const registerHotkeys = (hotkeysRegistry: HotkeysRegistry): void => {
  const hotkeys = getHotkeysContext();

  onMount(() => {
    const unregisterHotkeys: UnsubscribeHandler[] = [];

    Object.entries(hotkeysRegistry).forEach(([command, handler]) => {
      const hotkey = hotkeys[command as keyof Hotkeys];

      if (hotkey) {
        Mousetrap.bind(hotkey.binding, handler);

        unregisterHotkeys.push(() => Mousetrap.unbind(hotkey.binding));
      }
    });

    return () => {
      unregisterHotkeys.forEach(unregisterHotkey => unregisterHotkey());
    };
  });
};

export default registerHotkeys;

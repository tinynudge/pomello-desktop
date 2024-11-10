import { useSettings } from '@/shared/context/RuntimeContext';
import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import {
  CompleteFormattedHotkeys,
  FormattedHotkey,
  FormattedHotkeys,
  HotkeyCommand,
  Hotkeys,
  Settings,
  Unsubscribe,
} from '@pomello-desktop/domain';
import { ParentComponent, createContext, onCleanup, onMount, useContext } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';
import { HotkeyConflictError } from './HotkeyConflictError';

type SetSettingFunction<TSetting extends keyof Settings> = (
  state: Settings[TSetting]
) => Settings[TSetting];

type DashboardContextValue = {
  clearStagedSettings(): void;
  commitStagedSettings(): Promise<void>;
  getDefaultHotkey(command: HotkeyCommand): FormattedHotkey;
  getHasStagedChanges(): boolean;
  getHotkey(command: HotkeyCommand): FormattedHotkey | false;
  getSetting<TSetting extends keyof Settings>(key: TSetting): Settings[TSetting];
  onStagedSettingsClear(subscriber: () => void): Unsubscribe;
  stageHotkey(command: HotkeyCommand, hotkey: FormattedHotkey | false): void;
  stageSetting<TSetting extends keyof Settings>(
    key: TSetting,
    value: Settings[TSetting] | SetSettingFunction<TSetting>
  ): void;
};

type DashboardProviderProps = {
  initialDefaultHotkeys: CompleteFormattedHotkeys;
  initialHotkeys: FormattedHotkeys;
};

type StagedHotkeys = Partial<Record<HotkeyCommand, FormattedHotkey | false>>;

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  assertNonNullish(context, 'useDashboard must be used inside <DashboardProvider>');

  return context;
};

export const DashboardProvider: ParentComponent<DashboardProviderProps> = props => {
  const settings = useSettings();
  const [stagedSettings, setStagedSettings] = createStore<Partial<Settings>>({});

  const [hotkeys, setHotkeys] = createStore(props.initialHotkeys);
  const [stagedHotkeys, setStagedHotkeys] = createStore<StagedHotkeys>({});

  onMount(() => {
    const unsubscribe = window.app.onHotkeysChange(hotkeys => setHotkeys(reconcile(hotkeys)));

    onCleanup(unsubscribe);
  });

  const checkForHotkeyConflict = (command: HotkeyCommand, hotkey: FormattedHotkey) => {
    const normalizeBinding = (hotkey?: FormattedHotkey | false) =>
      hotkey ? hotkey.binding.replaceAll('command', 'meta') : null;

    const hotkeyBinding = normalizeBinding(hotkey);

    let conflictingCommand = Object.keys(stagedHotkeys).find(stagedCommand => {
      const stagedHotkey = stagedHotkeys[stagedCommand as HotkeyCommand];

      return command !== stagedCommand && hotkeyBinding === normalizeBinding(stagedHotkey);
    });

    if (!conflictingCommand) {
      conflictingCommand = Object.keys(hotkeys).find(storedCommand => {
        const storedHotkey = hotkeys[storedCommand as HotkeyCommand];

        return (
          !(storedCommand in stagedHotkeys) &&
          command !== storedCommand &&
          hotkeyBinding === normalizeBinding(storedHotkey)
        );
      });
    }

    if (conflictingCommand) {
      throw new HotkeyConflictError({
        currentCommand: conflictingCommand as HotkeyCommand,
        hotkey,
        incomingCommand: command,
      });
    }
  };

  const clearStagedSettings = () => {
    setStagedHotkeys(reconcile({}));
    setStagedSettings(reconcile({}));

    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  const commitStagedSettings = async () => {
    if (getHasStagedHotkeys()) {
      const updatedHotkeys = Object.entries(stagedHotkeys).reduce(
        (hotkeys, [command, formattedHotkey]) => ({
          ...hotkeys,
          [command]: formattedHotkey ? formattedHotkey.binding : false,
        }),
        {} as Hotkeys
      );

      await window.app.updateHotkeys(updatedHotkeys);

      setStagedHotkeys(reconcile({}));
    }

    if (getHasStagedSettings()) {
      await window.app.updateSettings({ ...unwrap(stagedSettings) });

      setStagedSettings(reconcile({}));
    }
  };

  const getDefaultHotkey = (command: HotkeyCommand) => props.initialDefaultHotkeys[command];

  const getHasStagedChanges = () => getHasStagedHotkeys() || getHasStagedSettings();

  const getHasStagedHotkeys = () => !!Object.keys(stagedHotkeys).length;

  const getHasStagedSettings = () => !!Object.keys(stagedSettings).length;

  const getHotkey = (command: HotkeyCommand) => stagedHotkeys[command] ?? hotkeys[command] ?? false;

  const getSetting = <TSetting extends keyof Settings>(setting: TSetting) =>
    stagedSettings[setting] ?? settings[setting];

  const onStagedSettingsClear = (subscriber: () => void) => {
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  const stageHotkey = (command: HotkeyCommand, hotkey: FormattedHotkey | false) => {
    if (hotkey !== false) {
      checkForHotkeyConflict(command, hotkey);
    }

    setStagedHotkeys(command, hotkey);
  };

  const stageSetting = <TSetting extends keyof Settings>(
    setting: TSetting,
    value: Settings[TSetting]
  ) => {
    setStagedSettings(setting, value);
  };

  const subscribers = new Set<() => void>();

  return (
    <DashboardContext.Provider
      value={{
        clearStagedSettings,
        commitStagedSettings,
        getDefaultHotkey,
        getHasStagedChanges,
        getHotkey,
        getSetting,
        onStagedSettingsClear,
        stageHotkey,
        stageSetting,
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
};

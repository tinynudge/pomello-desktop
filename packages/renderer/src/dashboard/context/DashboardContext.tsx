import { useSettings } from '@/shared/context/RuntimeContext';
import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import {
  FormattedHotkey,
  FormattedHotkeys,
  HotkeyCommand,
  Settings,
  Unsubscribe,
} from '@pomello-desktop/domain';
import { ParentComponent, createContext, onCleanup, onMount, useContext } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';

type DashboardContextValue = {
  clearStagedSettings(): void;
  commitStagedSettings(): Promise<void>;
  getHasStagedChanges(): boolean;
  getHotkey(command: HotkeyCommand): FormattedHotkey | undefined;
  getSetting<TSetting extends keyof Settings>(key: TSetting): Settings[TSetting];
  onStagedSettingsClear(subscriber: () => void): Unsubscribe;
  stageSetting<TSetting extends keyof Settings>(key: TSetting, value: Settings[TSetting]): void;
};

type DashboardProviderProps = {
  initialHotkeys: FormattedHotkeys;
};

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

  onMount(() => {
    const unsubscribe = window.app.onHotkeysChange(hotkeys => setHotkeys(reconcile(hotkeys)));

    onCleanup(unsubscribe);
  });

  const clearStagedSettings = () => {
    setStagedSettings(reconcile({}));

    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  const commitStagedSettings = async () => {
    if (!getHasStagedChanges()) {
      return;
    }

    await window.app.updateSettings({ ...unwrap(stagedSettings) });

    setStagedSettings(reconcile({}));
  };

  const getHasStagedChanges = () => !!Object.keys(stagedSettings).length;

  const getHotkey = (command: HotkeyCommand) => hotkeys[command];

  const getSetting = <TSetting extends keyof Settings>(setting: TSetting) =>
    stagedSettings[setting] ?? settings[setting];

  const onStagedSettingsClear = (subscriber: () => void) => {
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
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
        getHasStagedChanges,
        getHotkey,
        getSetting,
        onStagedSettingsClear,
        stageSetting,
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
};

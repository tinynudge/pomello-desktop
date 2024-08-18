import { useSettings } from '@/shared/context/RuntimeContext';
import { assertNonNullish } from '@/shared/helpers/assertNonNullish';
import { Settings, Unsubscribe } from '@pomello-desktop/domain';
import { ParentComponent, createContext, useContext } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';

type DashboardSettingsContextValue = {
  clearStagedSettings(): void;
  commitStagedSettings(): Promise<void>;
  getHasStagedChanges(): boolean;
  getSetting<TSetting extends keyof Settings>(key: TSetting): Settings[TSetting];
  onStagedSettingsClear(subscriber: () => void): Unsubscribe;
  stageSetting<TSetting extends keyof Settings>(key: TSetting, value: Settings[TSetting]): void;
};

const DashboardSettingsContext = createContext<DashboardSettingsContextValue | undefined>(
  undefined
);

export const useDashboardSettings = () => {
  const context = useContext(DashboardSettingsContext);

  assertNonNullish(context, 'useDashboardSettings must be used inside <DashboardSettingsProvider>');

  return context;
};

export const DashboardSettingsProvider: ParentComponent = props => {
  const settings = useSettings();
  const [stagedSettings, setStagedSettings] = createStore<Partial<Settings>>({});

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
    <DashboardSettingsContext.Provider
      value={{
        clearStagedSettings,
        commitStagedSettings,
        getHasStagedChanges,
        getSetting,
        onStagedSettingsClear,
        stageSetting,
      }}
    >
      {props.children}
    </DashboardSettingsContext.Provider>
  );
};

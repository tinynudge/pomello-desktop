import { SaveChangesBanner } from '@/dashboard/components/SaveChangesBanner';
import { ServiceConfig, StoreContents } from '@pomello-desktop/domain';
import { ParentComponent, Show, createContext, onCleanup, onMount, useContext } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { assertNonNullish } from '../helpers/assertNonNullish';

type SetServiceConfigFunction<TServiceConfig, TKey extends keyof TServiceConfig> = (
  state: TServiceConfig[TKey]
) => TServiceConfig[TKey];

type ConfigureServiceConfigContextValue<TServiceConfig = StoreContents> = {
  getServiceConfigValue<TKey extends keyof TServiceConfig>(key: TKey): TServiceConfig[TKey];
  serviceConfig: TServiceConfig;
  stageServiceConfigValue<TKey extends keyof TServiceConfig>(
    key: TKey,
    value: TServiceConfig[TKey] | SetServiceConfigFunction<TServiceConfig, TKey>
  ): void;
};

type ConfigureServiceConfigProviderProps = {
  initialServiceConfig: ServiceConfig<StoreContents> | null;
};

const ConfigureServiceConfigContext = createContext<ConfigureServiceConfigContextValue | undefined>(
  undefined
);

export const useConfigureServiceConfig = <
  TServiceConfig = void,
>(): ConfigureServiceConfigContextValue<TServiceConfig> => {
  const context = useContext(ConfigureServiceConfigContext);

  assertNonNullish(
    context,
    'useConfigureServiceConfig must be used inside <ConfigureServiceConfigProvider>'
  );

  return context as ConfigureServiceConfigContextValue<TServiceConfig>;
};

export const ConfigureServiceConfigProvider: ParentComponent<
  ConfigureServiceConfigProviderProps
> = props => {
  const [serviceConfig, setServiceConfig] = createStore<StoreContents>(
    props.initialServiceConfig?.get() ?? {}
  );
  const [stagedServiceConfig, setStagedServiceConfig] = createStore<StoreContents>({});

  onMount(() => {
    if (props.initialServiceConfig) {
      const unsubscribe = props.initialServiceConfig.onChange(updatedConfig => {
        setServiceConfig(reconcile(updatedConfig));
      });

      onCleanup(unsubscribe);
    }
  });

  const clearStagedServiceConfig = () => {
    setStagedServiceConfig(reconcile({}));
  };

  const commitStagedServiceConfig = async () => {
    assertNonNullish(props.initialServiceConfig, 'A service config is required to commit changes');

    if (getHasStagedChanges()) {
      for (const key of Object.keys(stagedServiceConfig)) {
        props.initialServiceConfig.set(key, stagedServiceConfig[key]);
      }

      setStagedServiceConfig(reconcile({}));
    }
  };

  const getHasStagedChanges = () => !!Object.keys(stagedServiceConfig).length;

  const getServiceConfigValue = (value: string) =>
    stagedServiceConfig[value] ?? serviceConfig[value];

  const stageServiceConfigValue = (key: string, value: unknown) => {
    setStagedServiceConfig(key, value);
  };

  return (
    <ConfigureServiceConfigContext.Provider
      value={{
        getServiceConfigValue,
        serviceConfig,
        stageServiceConfigValue,
      }}
    >
      {props.children}
      <Show when={getHasStagedChanges()}>
        <SaveChangesBanner
          onSaveClick={commitStagedServiceConfig}
          onUndoClick={clearStagedServiceConfig}
        />
      </Show>
    </ConfigureServiceConfigContext.Provider>
  );
};

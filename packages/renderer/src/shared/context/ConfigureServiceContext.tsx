import { SaveChangesBanner } from '@/dashboard/components/SaveChangesBanner';
import { ServiceConfig, StoreContents } from '@pomello-desktop/domain';
import { ParentComponent, Show, createContext, onCleanup, onMount, useContext } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';
import { assertNonNullish } from '../helpers/assertNonNullish';

type SetServiceConfigFunction<TServiceConfig, TKey extends keyof TServiceConfig> = (
  state: TServiceConfig[TKey]
) => TServiceConfig[TKey];

type ConfigureServiceContextValue<TServiceConfig = StoreContents> = {
  getServiceConfigValue<TKey extends keyof TServiceConfig>(key: TKey): TServiceConfig[TKey];
  serviceConfig: TServiceConfig;
  setServiceConfigValue<TKey extends keyof TServiceConfig>(
    key: TKey,
    value: TServiceConfig[TKey]
  ): void;
  stageServiceConfigValue<TKey extends keyof TServiceConfig>(
    key: TKey,
    value: TServiceConfig[TKey] | SetServiceConfigFunction<TServiceConfig, TKey>
  ): void;
};

type ConfigureServiceProviderProps = {
  initialServiceConfig: ServiceConfig<StoreContents> | null;
};

const ConfigureServiceContext = createContext<ConfigureServiceContextValue | undefined>(undefined);

export const useConfigureService = <
  TServiceConfig = void,
>(): ConfigureServiceContextValue<TServiceConfig> => {
  const context = useContext(ConfigureServiceContext);

  assertNonNullish(context, 'useConfigureService must be used inside <ConfigureServiceProvider>');

  return context as ConfigureServiceContextValue<TServiceConfig>;
};

export const ConfigureServiceProvider: ParentComponent<ConfigureServiceProviderProps> = props => {
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
        props.initialServiceConfig.set(key, unwrap(stagedServiceConfig[key]));
      }

      setStagedServiceConfig(reconcile({}));
    }
  };

  const getHasStagedChanges = () => !!Object.keys(stagedServiceConfig).length;

  const getServiceConfigValue = (value: string) =>
    stagedServiceConfig[value] ?? serviceConfig[value];

  const setServiceConfigValue = (key: string, value: unknown) => {
    props.initialServiceConfig?.set(key, value);

    if (stagedServiceConfig[key] !== undefined) {
      setStagedServiceConfig(key, undefined);
    }
  };

  const stageServiceConfigValue = (key: string, value: unknown) => {
    setStagedServiceConfig(key, value);
  };

  return (
    <ConfigureServiceContext.Provider
      value={{
        getServiceConfigValue,
        serviceConfig,
        setServiceConfigValue,
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
    </ConfigureServiceContext.Provider>
  );
};

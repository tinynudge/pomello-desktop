import {
  Logger,
  PomelloServiceConfig,
  ServiceConfig,
  ServiceRegistry,
  Settings,
  TranslationsDictionary,
} from '@pomello-desktop/domain';
import { ParentComponent, createContext, useContext } from 'solid-js';
import { assertNonNullish } from '../../helpers/assertNonNullish';
import { RuntimePomelloConfig, createRuntimePomelloConfig } from './createRuntimePomelloConfig';
import { createRuntimeSettings } from './createRuntimeSettings';
import { RuntimeTranslations, createRuntimeTranslations } from './createRuntimeTranslations';

export { useTranslate } from './createRuntimeTranslations';
export { usePomelloConfig } from './createRuntimePomelloConfig';
export { useSettings } from './createRuntimeSettings';

interface RuntimeProviderProps {
  initialLogger: Logger;
  initialPomelloConfig: ServiceConfig<PomelloServiceConfig>;
  initialServices: ServiceRegistry;
  initialSettings: Settings;
  initialTranslations: TranslationsDictionary;
}

interface RuntimeContextValue {
  logger: Logger;
  pomelloConfig: RuntimePomelloConfig;
  services: ServiceRegistry;
  settings: Settings;
  translations: RuntimeTranslations;
}

const RuntimeContext = createContext<RuntimeContextValue | undefined>(undefined);

export const useRuntime = (): RuntimeContextValue => {
  const runtime = useContext(RuntimeContext);

  assertNonNullish(runtime, 'useRuntime must be used inside a <RuntimeProvider>');

  return runtime;
};

export const RuntimeProvider: ParentComponent<RuntimeProviderProps> = props => {
  const pomelloConfig = createRuntimePomelloConfig(props.initialPomelloConfig);
  const settings = createRuntimeSettings(props.initialSettings);
  const translations = createRuntimeTranslations(props.initialTranslations);

  const runtime: RuntimeContextValue = {
    logger: props.initialLogger,
    pomelloConfig,
    services: props.initialServices,
    settings,
    translations,
  };

  return <RuntimeContext.Provider value={runtime}>{props.children}</RuntimeContext.Provider>;
};

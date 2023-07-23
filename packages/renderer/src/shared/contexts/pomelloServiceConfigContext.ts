import type { PomelloServiceConfig, ServiceConfig } from '@domain';
import { getContext, setContext } from 'svelte';

const pomelloServiceConfigContext = 'pomelloServiceConfig';

const setPomelloServiceConfigContext = (
  pomelloServiceConfig: ServiceConfig<PomelloServiceConfig>
) => {
  setContext(pomelloServiceConfigContext, pomelloServiceConfig);
};

const getPomelloServiceConfigContext = (): ServiceConfig<PomelloServiceConfig> => {
  return getContext(pomelloServiceConfigContext);
};

export { getPomelloServiceConfigContext, setPomelloServiceConfigContext };

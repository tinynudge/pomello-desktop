import type { PomelloServiceConfig, ServiceConfig } from '@domain';
import { getContext, setContext } from 'svelte';
import { derived, type Readable } from 'svelte/store';

interface PomelloServiceConfigStore extends ServiceConfig<PomelloServiceConfig> {
  isPremium: () => Readable<boolean>;
}

const pomelloServiceConfigContext = 'pomelloServiceConfig';

const setPomelloServiceConfigContext = (
  pomelloServiceConfig: ServiceConfig<PomelloServiceConfig>
) => {
  setContext<PomelloServiceConfigStore>(pomelloServiceConfigContext, {
    ...pomelloServiceConfig,
    isPremium: () => derived(pomelloServiceConfig, ({ user }) => user?.type === 'premium'),
  });
};

const getPomelloServiceConfigContext = (): PomelloServiceConfigStore => {
  return getContext(pomelloServiceConfigContext);
};

export { getPomelloServiceConfigContext, setPomelloServiceConfigContext };

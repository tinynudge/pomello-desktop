import { getServiceContext } from '@/app/contexts/serviceContext';
import { getPomelloServiceConfigContext } from '@/shared/contexts/pomelloServiceConfigContext';
import { derived, type Readable } from 'svelte/store';

const getTasksCacheKey = (): Readable<string[]> => {
  const service = getServiceContext();
  const pomelloConfig = getPomelloServiceConfigContext();

  const isPremium = pomelloConfig.isPremium();

  return derived(isPremium, $isPremium => ['tasks', service.id, `premium:${$isPremium}`]);
};

export default getTasksCacheKey;

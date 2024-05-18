import { renderApp } from '@/app/__fixtures__/renderApp';
import { vi } from 'vitest';
import { createZenService } from '../createZenService';
import translations from '../translations/en-US.json';

export * from '@solidjs/testing-library';

export const renderZenService = () => {
  const getTranslations = vi.fn().mockResolvedValue(translations);

  return renderApp({
    appApi: { getTranslations },
    createServiceRegistry: () => ({
      [createZenService.id]: createZenService,
    }),
    serviceId: 'zen',
  });
};

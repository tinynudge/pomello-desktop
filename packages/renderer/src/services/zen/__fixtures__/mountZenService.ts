import mountApp from '@/app/__fixtures__/mountApp';
import { vi } from 'vitest';
import createZenService from '..';
import translations from '../translations/en-US.json';

export * from '@testing-library/react';

const mountZenService = () => {
  const getTranslations = vi.fn().mockResolvedValue(translations);

  return mountApp({
    appApi: { getTranslations },
    createServiceRegistry: () => ({
      [createZenService.id]: createZenService,
    }),
    serviceId: 'zen',
  });
};

export default mountZenService;

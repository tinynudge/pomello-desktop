import { Logger } from '@pomello-desktop/domain';
import { vi } from 'vitest';

export const createMockLogger = (): Logger => {
  return {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  };
};

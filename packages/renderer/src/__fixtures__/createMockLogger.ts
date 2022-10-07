import { Logger } from '@domain';
import { vi } from 'vitest';

const createMockLogger = (): Logger => {
  return {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  };
};

export default createMockLogger;

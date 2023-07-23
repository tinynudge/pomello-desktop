import type { PomelloServiceConfig, ServiceConfig } from '@domain';

const getPomelloServiceConfig = async (): Promise<ServiceConfig<PomelloServiceConfig>> => {
  return window.app.registerServiceConfig<PomelloServiceConfig>('pomello', {
    defaults: {},
    schema: {
      type: 'object',
      properties: {
        didPromptRegistration: { type: 'boolean', nullable: true },
        token: { type: 'string', nullable: true },
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            timezone: { type: 'string' },
            type: { type: 'string' },
          },
          required: ['name', 'email', 'timezone', 'type'],
          nullable: true,
        },
      },
    },
  });
};

export default getPomelloServiceConfig;

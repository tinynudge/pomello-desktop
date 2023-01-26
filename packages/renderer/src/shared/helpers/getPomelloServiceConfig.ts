import createServiceConfig from '@/shared/helpers/createServiceConfig';
import { PomelloServiceConfig, ServiceConfig } from '@domain';

const getPomelloServiceConfig = (): Promise<ServiceConfig<PomelloServiceConfig>> => {
  return createServiceConfig<PomelloServiceConfig>('pomello', {
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

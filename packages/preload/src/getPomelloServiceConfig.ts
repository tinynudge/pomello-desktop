import { PomelloServiceConfig, ServiceConfig } from '@domain';
import registerServiceConfig from './registerServiceConfig';

const getPomelloServiceConfig = (): Promise<ServiceConfig<PomelloServiceConfig>> =>
  registerServiceConfig<PomelloServiceConfig>('pomello', {
    defaults: {},
    schema: {
      type: 'object',
      properties: {
        didPromptRegistration: { type: 'boolean', nullable: true },
        token: { type: 'string', nullable: true },
      },
    },
  });

export default getPomelloServiceConfig;

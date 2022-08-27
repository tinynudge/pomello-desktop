import { PomelloServiceConfig, ServiceConfig } from '@domain';
import registerServiceConfig from './registerServiceConfig';

const getPomelloServiceConfig = (): Promise<ServiceConfig<PomelloServiceConfig>> =>
  registerServiceConfig<PomelloServiceConfig>('pomello', {
    defaults: {},
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', nullable: true },
      },
    },
  });

export default getPomelloServiceConfig;

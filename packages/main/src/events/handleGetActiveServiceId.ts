import { runtime } from '@/runtime';
import { Services } from '@pomello-desktop/domain';

export const handleGetActiveServiceId = (): string | undefined => {
  const services = runtime.storeManager.registerStore<Services>({
    path: 'services',
    emitChangeEvents: true,
    defaults: {},
    schema: {
      type: 'object',
      properties: {
        activeServiceId: {
          type: 'string',
          nullable: true,
        },
      },
      required: [],
    },
  });

  return services.get('activeServiceId');
};

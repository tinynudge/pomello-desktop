import storeManager from '@/helpers/storeManager';
import { Services } from '@domain';

const handleGetActiveServiceId = (): string | undefined => {
  const services = storeManager.registerStore<Services>({
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

export default handleGetActiveServiceId;

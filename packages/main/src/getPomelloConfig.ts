import { PomelloConfig, Store } from '@pomello-desktop/domain';
import runtime from './runtime';

const getPomelloConfig = (): Store<PomelloConfig> =>
  runtime.storeManager.registerStore<PomelloConfig>({
    path: 'pomello',
    defaults: {
      dashboardHeight: 560,
      dashboardWidth: 800,
      height: 56,
      width: 230,
    },
    schema: {
      type: 'object',
      properties: {
        dashboardHeight: {
          type: 'number',
        },
        dashboardWidth: {
          type: 'number',
        },
        dashboardX: {
          type: 'number',
          nullable: true,
        },
        dashboardY: {
          type: 'number',
          nullable: true,
        },
        debug: {
          type: 'boolean',
          nullable: true,
        },
        dev: {
          type: 'boolean',
          nullable: true,
        },
        height: {
          type: 'number',
        },
        releaseChannel: {
          type: 'string',
          enum: ['alpha'],
          nullable: true,
        },
        width: {
          type: 'number',
        },
        x: {
          type: 'number',
          nullable: true,
        },
        y: {
          type: 'number',
          nullable: true,
        },
      },
      required: ['dashboardHeight', 'dashboardWidth', 'height', 'width'],
      additionalProperties: false,
    },
  });

export default getPomelloConfig;

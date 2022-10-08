import { Logger } from './Logger';
import { ServiceConfig } from './ServiceConfig';
import { Translate } from './Translate';

export interface ServiceRuntime<TConfig> {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
  logger: Logger;
  translate: Translate;
}

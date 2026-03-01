import { Logger } from './Logger';
import { ServiceConfig } from './ServiceConfig';
import { Translate } from './Translate';
import { Unsubscribe } from './Unsubscribe';

export type CreateFetchTaskNamesOptions<TConfig = void> = {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
  logger: Logger;
  onCleanUp(callback: Unsubscribe): void;
  translate: Translate;
};

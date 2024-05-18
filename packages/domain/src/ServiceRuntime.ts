import { Logger } from './Logger';
import { PomelloUser } from './PomelloUser';
import { ServiceCleanUpCallback } from './ServiceCleanUpCallback';
import { ServiceConfig } from './ServiceConfig';
import { Settings } from './Settings';
import { Translate } from './Translate';

export type ServiceRuntime<TConfig> = {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
  logger: Logger;
  onServiceCleanUp(callback: ServiceCleanUpCallback): void;
  settings: Settings;
  translate: Translate;
  user?: PomelloUser;
};

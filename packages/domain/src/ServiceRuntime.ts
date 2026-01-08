import { Logger } from './Logger';
import { PomelloUser } from './PomelloUser';
import { ReinitializePomelloServiceOptions } from './ReinitializePomelloServiceOptions';
import { ServiceCleanUpCallback } from './ServiceCleanUpCallback';
import { ServiceConfig } from './ServiceConfig';
import { Settings } from './Settings';
import { Translate } from './Translate';

export type ServiceRuntime<TConfig> = {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
  getUser(): PomelloUser | undefined;
  logger: Logger;
  onServiceCleanUp(callback: ServiceCleanUpCallback): void;
  reinitializePomelloService(options?: ReinitializePomelloServiceOptions): void;
  settings: Settings;
  translate: Translate;
};

import type { Logger } from './Logger';
import type { PomelloUser } from './PomelloUser';
import type { ServiceConfig } from './ServiceConfig';
import type { Settings } from './Settings';
import type { Translate } from './Translate';

export interface ServiceRuntime<TConfig> {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
  getSettings(): Settings;
  getUser(): PomelloUser | undefined;
  logger: Logger;
  translate: Translate;
}

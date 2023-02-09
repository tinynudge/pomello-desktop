import { Logger } from './Logger';
import { PomelloUser } from './PomelloUser';
import { ServiceConfig } from './ServiceConfig';
import { Settings } from './Settings';
import { Translate } from './Translate';

export interface ServiceRuntime<TConfig> {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
  getSettings(): Settings;
  getUser(): PomelloUser | undefined;
  logger: Logger;
  translate: Translate;
}

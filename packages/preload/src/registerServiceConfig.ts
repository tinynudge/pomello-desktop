import { AppEvent, ServiceConfig, StoreContents } from '@domain';
import { ipcRenderer } from 'electron';

const registerServiceConfig = <TConfig = StoreContents>(
  serviceId: string,
  config: ServiceConfig<TConfig>
) => ipcRenderer.invoke(AppEvent.RegisterServiceConfig, serviceId, config);

export default registerServiceConfig;

import { Service } from './Service';

export interface ServiceFactory {
  (): Service;
  displayName: string;
}

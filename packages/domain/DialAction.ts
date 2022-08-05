import { ReactNode } from 'react';
import { DialActionClickHandler } from './DialActionClickHandler';

export interface DialAction {
  Content: ReactNode;
  id: string;
  label: string;
  onClick: DialActionClickHandler;
}

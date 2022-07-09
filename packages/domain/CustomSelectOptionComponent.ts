import { FC, ReactNode } from 'react';
import { CustomSelectOption } from './CustomSelectOption';

export type CustomSelectOptionComponent = FC<{
  children: ReactNode;
  option: CustomSelectOption;
}>;

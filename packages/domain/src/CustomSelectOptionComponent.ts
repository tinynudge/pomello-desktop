import { Component, JSX } from 'solid-js';
import { CustomSelectOption } from './CustomSelectOption';

export type CustomSelectOptionComponent = Component<{
  children: JSX.Element;
  option: CustomSelectOption;
}>;

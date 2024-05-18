import { CustomSelectOptionComponent } from '@pomello-desktop/domain';

export const MockCustomSelectOption: CustomSelectOptionComponent = props => {
  return <strong>{props.option.label}</strong>;
};

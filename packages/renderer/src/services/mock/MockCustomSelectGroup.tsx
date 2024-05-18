import { CustomSelectGroupComponent } from '@pomello-desktop/domain';

export const MockCustomSelectGroup: CustomSelectGroupComponent = props => {
  return <em>{props.group.label}</em>;
};

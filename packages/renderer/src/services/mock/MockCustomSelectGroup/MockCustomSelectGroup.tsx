import { CustomSelectGroupComponent } from '@domain';

const MockCustomSelectGroup: CustomSelectGroupComponent = ({ group }) => {
  return <em>{group.label}</em>;
};

export default MockCustomSelectGroup;

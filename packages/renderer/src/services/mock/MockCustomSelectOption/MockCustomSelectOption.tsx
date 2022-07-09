import { CustomSelectOptionComponent } from '@domain';

const MockCustomSelectOption: CustomSelectOptionComponent = ({ option }) => {
  return <strong>{option.label}</strong>;
};

export default MockCustomSelectOption;

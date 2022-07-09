import { SelectGroupType } from '@domain';
import { FC } from 'react';

interface OptionGroupProps {
  group: SelectGroupType;
}

const OptionGroup: FC<OptionGroupProps> = ({ group }) => {
  return <span>{group.label}</span>;
};

export default OptionGroup;

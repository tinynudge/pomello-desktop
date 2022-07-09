import { SelectOptionType } from '@domain';
import { FC, ReactNode } from 'react';

interface OptionProps {
  children: ReactNode;
  option: SelectOptionType;
}

const Option: FC<OptionProps> = ({ children }) => {
  return <span>{children}</span>;
};

export default Option;

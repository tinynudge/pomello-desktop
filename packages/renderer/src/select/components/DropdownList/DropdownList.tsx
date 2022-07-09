import { SelectItem, SelectOptionType, Service } from '@domain';
import { FC } from 'react';
import DropdownItem from '../DropdownItem';

interface DropdownListProps {
  depth: number;
  items: SelectItem[];
  onOptionSelect(option: SelectOptionType): void;
  service?: Service;
}

const DropdownList: FC<DropdownListProps> = ({ depth, items, onOptionSelect, service }) => {
  return (
    <>
      {items.map(item => (
        <DropdownItem
          depth={depth}
          item={item}
          key={item.id}
          onOptionSelect={onOptionSelect}
          service={service}
        />
      ))}
    </>
  );
};

export default DropdownList;

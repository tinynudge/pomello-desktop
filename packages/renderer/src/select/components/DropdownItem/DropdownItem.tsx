import { SelectItem, SelectOptionType, Service } from '@domain';
import { FC } from 'react';
import DropdownList from '../DropdownList';
import DropdownRow from '../DropdownRow';
import Option from '../Option';
import OptionGroup from '../OptionGroup';

interface DropdownItemProps {
  depth: number;
  item: SelectItem;
  onOptionSelect(option: SelectOptionType): void;
  service?: Service;
}

const DropdownItem: FC<DropdownItemProps> = ({ depth, item, onOptionSelect, service }) => {
  const isGroupType = item.type === 'group' || item.type === 'customGroup';

  if (isGroupType) {
    return (
      <>
        <DropdownRow depth={depth + 1}>
          {item.type === 'customGroup' && service?.CustomSelectGroup ? (
            <service.CustomSelectGroup group={item} />
          ) : (
            <OptionGroup group={item} />
          )}
        </DropdownRow>
        <DropdownList
          depth={depth + 1}
          items={item.items}
          onOptionSelect={onOptionSelect}
          service={service}
        />
      </>
    );
  }

  const handleOptionClick = () => {
    onOptionSelect(item);
  };

  return (
    <DropdownRow depth={depth} onClick={handleOptionClick}>
      {item.type === 'customOption' && service?.CustomSelectOption ? (
        <service.CustomSelectOption option={item} children={item.label} />
      ) : (
        <Option option={item} children={item.label} />
      )}
    </DropdownRow>
  );
};

export default DropdownItem;

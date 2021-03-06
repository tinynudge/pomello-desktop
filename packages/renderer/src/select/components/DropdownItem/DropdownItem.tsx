import { SelectItem, SelectOptionType, Service } from '@domain';
import cc from 'classcat';
import { FC } from 'react';
import DropdownList from '../DropdownList';
import DropdownRow from '../DropdownRow';
import styles from './DropdownItem.module.scss';

interface DropdownItemProps {
  activeOptionId?: string;
  depth: number;
  item: SelectItem;
  onOptionHover(option: SelectOptionType): void;
  onOptionSelect(): void;
  service?: Service;
}

const DropdownItem: FC<DropdownItemProps> = ({
  activeOptionId,
  depth,
  item,
  onOptionHover,
  onOptionSelect,
  service,
}) => {
  const isGroupType = item.type === 'group' || item.type === 'customGroup';

  if (isGroupType) {
    return (
      <DropdownList
        activeOptionId={activeOptionId}
        aria-labelledby={item.id}
        depth={depth + 1}
        items={item.items}
        onOptionHover={onOptionHover}
        onOptionSelect={onOptionSelect}
        role="group"
        service={service}
      >
        <DropdownRow className={styles.group} id={item.id} role="presentation">
          {item.type === 'customGroup' && service?.CustomSelectGroup ? (
            <service.CustomSelectGroup group={item} />
          ) : (
            item.label
          )}
        </DropdownRow>
      </DropdownList>
    );
  }

  const handleOptionMouseOver = () => {
    onOptionHover(item);
  };

  return (
    <DropdownRow
      className={cc({
        [styles.selected]: activeOptionId === item.id,
      })}
      id={item.id}
      onClick={onOptionSelect}
      onMouseOver={handleOptionMouseOver}
      role="option"
    >
      {item.type === 'customOption' && service?.CustomSelectOption ? (
        <service.CustomSelectOption option={item} children={item.label} />
      ) : (
        item.label
      )}
    </DropdownRow>
  );
};

export default DropdownItem;

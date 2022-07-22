import { SelectItem, SelectOptionType, Service } from '@domain';
import { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';
import DropdownItem from '../DropdownItem';
import styles from './DropdownList.module.scss';

interface DropdownListProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
  depth: number;
  items: SelectItem[];
  onOptionHover(option: SelectOptionType): void;
  onOptionSelect(): void;
  selectedOption?: SelectOptionType;
  service?: Service;
}

const DropdownList: FC<DropdownListProps> = ({
  children,
  depth,
  items,
  onOptionHover,
  onOptionSelect,
  selectedOption,
  service,
  ...remainingProps
}) => {
  return (
    <ul
      className={styles.list}
      style={{ '--row-depth': depth } as CSSProperties}
      {...remainingProps}
    >
      {children}
      {items.map(item => (
        <DropdownItem
          depth={depth}
          item={item}
          key={item.id}
          onOptionHover={onOptionHover}
          onOptionSelect={onOptionSelect}
          selectedOption={selectedOption}
          service={service}
        />
      ))}
    </ul>
  );
};

export default DropdownList;

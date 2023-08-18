import { Store } from '@/shared/helpers/createStore';
import { SelectItem, SelectOptionType, Service } from '@domain';
import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';
import DropdownItem from '../DropdownItem';
import styles from './DropdownList.module.scss';

interface DropdownListProps extends HTMLAttributes<HTMLUListElement> {
  activeOptionId: Store<string | undefined>;
  children?: ReactNode;
  depth: number;
  items: SelectItem[];
  onOptionHover(option: SelectOptionType): void;
  onOptionSelect(): void;
  service?: Service;
}

const DropdownList = forwardRef<HTMLUListElement, DropdownListProps>(
  (
    {
      activeOptionId,
      children,
      depth,
      items,
      onOptionHover,
      onOptionSelect,
      service,
      ...remainingProps
    },
    ref
  ) => {
    return (
      <ul
        className={styles.list}
        style={{ '--row-depth': depth } as CSSProperties}
        ref={ref}
        {...remainingProps}
      >
        {children}
        {items.map(item => (
          <DropdownItem
            activeOptionId={activeOptionId}
            depth={depth}
            item={item}
            key={item.id}
            onOptionHover={onOptionHover}
            onOptionSelect={onOptionSelect}
            service={service}
          />
        ))}
      </ul>
    );
  }
);

export default DropdownList;

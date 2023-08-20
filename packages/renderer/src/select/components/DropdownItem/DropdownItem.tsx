import { SelectItem, SelectOptionType, Service, Signal } from '@domain';
import cc from 'classcat';
import { FC, useSyncExternalStore } from 'react';
import DropdownList from '../DropdownList';
import DropdownRow from '../DropdownRow';
import styles from './DropdownItem.module.scss';

interface DropdownItemProps {
  activeOptionId: Signal<string | undefined>;
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
  const isSelected = useSyncExternalStore(
    activeOptionId.subscribe,
    () => activeOptionId.get() === item.id
  );

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
        <DropdownRow className={cc([styles.item, styles.group])} id={item.id} role="presentation">
          {item.type === 'customGroup' && service?.CustomSelectGroup ? (
            <service.CustomSelectGroup group={item} />
          ) : (
            <>
              <span className={styles.label}>{item.label}</span>
              {item.hint && <span className={styles.hint}>{item.hint}</span>}
            </>
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
        [styles.item]: true,
        [styles.selected]: isSelected,
      })}
      id={item.id}
      onClick={onOptionSelect}
      onMouseOver={handleOptionMouseOver}
      role="option"
    >
      {item.type === 'customOption' && service?.CustomSelectOption ? (
        <service.CustomSelectOption option={item} children={item.label} />
      ) : (
        <>
          <span className={styles.label}>{item.label}</span>
          {item.hint && <span className={styles.hint}>{item.hint}</span>}
        </>
      )}
    </DropdownRow>
  );
};

export default DropdownItem;

import { SelectItem, SelectOptionType, Service } from '@pomello-desktop/domain';
import { For, JSX, ParentComponent, splitProps } from 'solid-js';
import { DropdownItem } from '../DropdownItem';
import styles from './DropdownList.module.scss';

interface DropdownListProps extends JSX.HTMLAttributes<HTMLUListElement> {
  activeOptionId?: string;
  depth: number;
  items: SelectItem[];
  onOptionHover(option: SelectOptionType): void;
  onOptionSelect(): void;
  ref?: HTMLUListElement;
  service?: Service;
}

export const DropdownList: ParentComponent<DropdownListProps> = allProps => {
  const [props, listProps] = splitProps(allProps, [
    'activeOptionId',
    'children',
    'depth',
    'items',
    'onOptionHover',
    'onOptionSelect',
    'service',
  ]);

  return (
    <ul class={styles.list} style={{ '--row-depth': props.depth }} {...listProps}>
      {props.children}
      <For each={props.items}>
        {item => (
          <DropdownItem
            activeOptionId={props.activeOptionId}
            depth={props.depth}
            item={item}
            onOptionHover={props.onOptionHover}
            onOptionSelect={props.onOptionSelect}
            service={props.service}
          />
        )}
      </For>
    </ul>
  );
};

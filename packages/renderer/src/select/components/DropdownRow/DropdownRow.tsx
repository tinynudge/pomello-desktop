import cc from 'classcat';
import { JSX, ParentComponent, splitProps } from 'solid-js';
import styles from './DropdownRow.module.scss';

interface DropdownRowProps extends JSX.HTMLAttributes<HTMLLIElement> {
  onClick?(): void;
}

export const DropdownRow: ParentComponent<DropdownRowProps> = allProps => {
  const [props, listItemProps] = splitProps(allProps, ['children', 'class', 'onClick']);

  return (
    <li
      {...listItemProps}
      class={cc([styles.row, props.class])}
      data-row
      onClick={() => props.onClick?.()}
    >
      {props.children}
    </li>
  );
};

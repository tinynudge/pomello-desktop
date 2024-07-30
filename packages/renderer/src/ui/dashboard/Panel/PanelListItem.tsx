import cc from 'classcat';
import { JSX, ParentComponent, splitProps } from 'solid-js';
import styles from './PanelListItem.module.scss';

export const PanelListItem: ParentComponent<JSX.LiHTMLAttributes<HTMLLIElement>> = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['children', 'class']);

  return (
    <li class={cc([styles.panelListItem, props.class])} {...remainingProps}>
      {props.children}
    </li>
  );
};

import { JSX, ParentComponent } from 'solid-js';
import styles from './PanelListItem.module.scss';

export const PanelListItem: ParentComponent<JSX.LiHTMLAttributes<HTMLLIElement>> = props => {
  return <li class={styles.panelListItem}>{props.children}</li>;
};

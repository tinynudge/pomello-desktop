import { JSX, ParentComponent } from 'solid-js';
import styles from './PanelList.module.scss';
import { PanelListItem } from './PanelListItem';

type PanelListComponent = ParentComponent<JSX.HTMLAttributes<HTMLUListElement>> & {
  Item: typeof PanelListItem;
};

export const PanelList: PanelListComponent = props => {
  return <ul class={styles.panelList}>{props.children}</ul>;
};

PanelList.Item = PanelListItem;

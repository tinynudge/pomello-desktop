import cc from 'classcat';
import { JSX, ParentComponent, splitProps } from 'solid-js';
import styles from './PanelList.module.scss';
import { PanelListItem } from './PanelListItem';

type PanelListComponent = ParentComponent<JSX.HTMLAttributes<HTMLUListElement>> & {
  Item: typeof PanelListItem;
};

export const PanelList: PanelListComponent = allProps => {
  const [props, remainingProps] = splitProps(allProps, ['children', 'class']);

  return (
    <ul class={cc([styles.panelList, props.class])} {...remainingProps}>
      {props.children}
    </ul>
  );
};

PanelList.Item = PanelListItem;

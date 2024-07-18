import cc from 'classcat';
import { ParentComponent } from 'solid-js';
import styles from './Content.module.scss';

interface ContentProps {
  class?: string;
}

export const Content: ParentComponent<ContentProps> = props => {
  return <div class={cc([styles.content, props.class])}>{props.children}</div>;
};

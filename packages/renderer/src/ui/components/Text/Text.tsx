import { ParentComponent } from 'solid-js';
import styles from './Text.module.scss';

export const Text: ParentComponent = props => {
  return <div class={styles.text}>{props.children}</div>;
};

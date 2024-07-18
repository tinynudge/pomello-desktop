import { ParentComponent } from 'solid-js';
import styles from './Heading.module.scss';

export const Heading: ParentComponent = props => {
  return <h1 class={styles.heading}>{props.children}</h1>;
};

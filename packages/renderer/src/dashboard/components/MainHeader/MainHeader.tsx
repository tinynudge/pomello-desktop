import { ParentComponent } from 'solid-js';
import styles from './MainHeader.module.scss';

type MainHeaderProps = {
  heading: string;
};

export const MainHeader: ParentComponent<MainHeaderProps> = props => {
  return (
    <div class={styles.mainHeader}>
      <h1>{props.heading}</h1>
      {props.children}
    </div>
  );
};

import cc from 'classcat';
import { ParentComponent } from 'solid-js';
import styles from './Panel.module.scss';
import { PanelList } from './PanelList';

type PanelComponent = ParentComponent<PanelProps> & {
  List: typeof PanelList;
};

type PanelProps = {
  heading: string;
  isPaddingDisabled?: boolean;
};

export const Panel: PanelComponent = props => {
  return (
    <section class={styles.panel}>
      <h2 class={styles.heading}>{props.heading}</h2>
      <div
        class={cc({
          [styles.content]: true,
          [styles.isPaddingDisabled]: props.isPaddingDisabled,
        })}
      >
        {props.children}
      </div>
    </section>
  );
};

Panel.List = PanelList;

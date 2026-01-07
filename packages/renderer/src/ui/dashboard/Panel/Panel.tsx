import cc from 'classcat';
import { JSX, ParentComponent, Show } from 'solid-js';
import styles from './Panel.module.scss';
import { PanelList } from './PanelList';

type PanelComponent = ParentComponent<PanelProps> & {
  List: typeof PanelList;
};

type PanelProps = {
  heading: string;
  isPaddingDisabled?: boolean;
  subHeading?: JSX.Element;
};

export const Panel: PanelComponent = props => {
  return (
    <section class={styles.panel}>
      <h2 class={styles.heading}>{props.heading}</h2>
      <Show when={props.subHeading}>
        <div class={styles.subHeading}>{props.subHeading}</div>
      </Show>
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

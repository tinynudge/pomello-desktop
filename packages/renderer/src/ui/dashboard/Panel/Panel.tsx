import { nanoid } from 'nanoid';
import { JSX, ParentComponent, Show } from 'solid-js';
import styles from './Panel.module.scss';
import { PanelList } from './PanelList';

type PanelComponent = ParentComponent<PanelProps> & {
  List: typeof PanelList;
};

type PanelProps = {
  heading: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  subHeading?: JSX.Element;
};

export const Panel: PanelComponent = props => {
  const headingId = `panel-${nanoid()}`;

  return (
    <section aria-labelledby={headingId} class={styles.panel}>
      <h2 class={styles.heading} id={headingId}>
        {props.heading}
      </h2>
      <Show when={props.subHeading}>
        <div class={styles.subHeading}>{props.subHeading}</div>
      </Show>
      <div class={styles.content} data-padding={props.padding ?? 'medium'}>
        {props.children}
      </div>
    </section>
  );
};

Panel.List = PanelList;
